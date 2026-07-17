import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { DataService } from '../services/dataService';
import { authMiddleware, AuthRequest } from './auth';

export const listingsRouter = Router();

// GET all listings with search, filter, sort, and pagination
listingsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { q, category, minPrice, maxPrice, rating, location, difficulty, sort, page = '1', limit = '12' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const { listings, total } = await DataService.getListingsAdvanced({
      q: q ? String(q) : undefined,
      category: category ? String(category) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      rating: rating ? Number(rating) : undefined,
      location: location ? String(location) : undefined,
      difficulty: difficulty ? String(difficulty) : undefined,
      sort: sort ? String(sort) : undefined,
      page: pageNum,
      limit: limitNum
    });

    res.status(200).json({
      listings,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Fetch listings error:', error);
    res.status(500).json({ message: 'Error fetching listings' });
  }
});

// GET single listing + related listings
listingsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // In-memory might use different ID schemes, but we allow simple format or mongoose id check
    // We can check if it is a valid hex string of length 24, which mongoose object ids are
    const isValidId = mongoose.Types.ObjectId.isValid(id) || (typeof id === 'string' && id.length === 24);
    if (!isValidId) {
      return res.status(400).json({ message: 'Invalid listing ID format' });
    }

    const listing = await DataService.getListingById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Fetch related listings
    const relatedListings = await DataService.getRelatedListings(listing, 4);

    res.status(200).json({ listing, relatedListings });
  } catch (error) {
    console.error('Fetch single listing error:', error);
    res.status(500).json({ message: 'Error fetching listing details' });
  }
});

// POST add new listing (Protected)
listingsRouter.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      shortDescription,
      fullDescription,
      price,
      date,
      category,
      location,
      imageUrl,
      duration,
      difficulty,
      groupSize
    } = req.body;

    if (
      !title ||
      !shortDescription ||
      !fullDescription ||
      !price ||
      !date ||
      !category ||
      !location ||
      !imageUrl ||
      !duration ||
      !difficulty ||
      !groupSize
    ) {
      return res.status(400).json({ message: 'All listing fields are required' });
    }

    const newListing = await DataService.createListing({
      title,
      shortDescription,
      fullDescription,
      price: Number(price),
      date: new Date(date),
      category,
      location,
      imageUrl,
      duration: Number(duration),
      difficulty,
      groupSize: Number(groupSize)
    }, req.user?.id || '');

    res.status(201).json({ message: 'Listing created successfully', listing: newListing });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Error creating listing' });
  }
});

// DELETE listing (Protected)
listingsRouter.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(id) || (typeof id === 'string' && id.length === 24);
    if (!isValidId) {
      return res.status(400).json({ message: 'Invalid listing ID format' });
    }

    const listing = await DataService.getListingById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check listing creator auth if applicable
    if (listing.createdBy && listing.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this listing' });
    }

    await DataService.deleteListing(id);
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Error deleting listing' });
  }
});

// POST review (Protected)
listingsRouter.post('/:id/reviews', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const updated = await DataService.addReview(id, {
      username: req.user?.username || 'Anonymous',
      rating: Number(rating),
      comment
    });

    if (!updated) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(201).json({ message: 'Review added successfully', reviews: updated.reviews, ratingAverage: updated.ratingAverage });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Error adding review' });
  }
});
