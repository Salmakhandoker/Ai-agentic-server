import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { isConnectedToMongo } from '../config/db';
import { User, Listing, IUser, IListing, IReview } from '../models/models';

// In-Memory Database Arrays
let localUsers: any[] = [];
let localListings: any[] = [];

// Seed local memory DB
const seedLocalMemoryDb = async () => {
  const hashedPassword = await bcrypt.hash('demo1234', 10);
  
  // Seed demo user
  localUsers.push({
    _id: new mongoose.Types.ObjectId(),
    username: 'TravelerDemo',
    email: 'demo@aetheria.com',
    password: hashedPassword,
    profile: {
      budget: 3500,
      interests: ['Adventure', 'Nature', 'Wellness'],
      climate: 'Tropical',
      pace: 'Moderate'
    }
  });

  // Seed listing packages
  const defaultListings = [
    {
      _id: new mongoose.Types.ObjectId(),
      title: 'Bali Island Wellness Retreat',
      shortDescription: 'Unwind in tropical gardens with yoga, spa therapies, and cultural temple tours.',
      fullDescription: 'Experience the ultimate rejuvenation on the Island of the Gods. This package combines daily sunrise yoga sessions overlooking pristine rice terraces, traditional Balinese massage treatments, and guided hikes up Mount Batur. Discover local culture through culinary classes and temple blessings, ending your days in premium eco-resorts.',
      price: 1850,
      date: new Date('2026-09-10'),
      category: 'Wellness',
      location: 'Bali, Indonesia',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      duration: 7,
      difficulty: 'Easy',
      groupSize: 12,
      ratingAverage: 4.8,
      reviews: [
        { username: 'Sophia L.', rating: 5, comment: 'An absolute dream! The yoga deck views were breathtaking, and the spa therapies were top notch.', date: new Date() },
        { username: 'David M.', rating: 4, comment: 'Extremely relaxing. The food was organic and delicious, though the hike was early in the morning.', date: new Date() }
      ]
    },
    {
      _id: new mongoose.Types.ObjectId(),
      title: 'Swiss Alps Mountaineering Expedition',
      shortDescription: 'Challenging peak climbs, ice walking, and panoramic ridge hiking with expert guides.',
      fullDescription: 'Conquer the spectacular peaks of the Bernese Oberland. This intensive expedition takes you through glacier crossings, technical rock sections, and high-altitude hut stays. Under the guidance of certified alpine guides, you will develop glacier travel and crevasse rescue skills while viewing the majestic Eiger, Monch, and Jungfrau peaks.',
      price: 3400,
      date: new Date('2026-08-15'),
      category: 'Adventure',
      location: 'Zermatt, Switzerland',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      duration: 6,
      difficulty: 'Challenging',
      groupSize: 6,
      ratingAverage: 4.9,
      reviews: [
        { username: 'Alex H.', rating: 5, comment: 'The hardest thing I\'ve ever done but absolutely worth it. The glacier traverse was mind-blowing.', date: new Date() }
      ]
    },
    {
      _id: new mongoose.Types.ObjectId(),
      title: 'Kyoto Cultural Heritage Walk',
      shortDescription: 'Explore ancient temples, zen gardens, tea ceremonies, and bamboo forests.',
      fullDescription: 'Step back in time in Japan\'s ancient capital. Walk the stone-paved streets of Gion, participate in an authentic matcha tea ceremony led by a master, and meditate in silent Zen gardens. This curated tour includes a scenic walk through the Arashiyama Bamboo Grove and a private dinner showcasing multi-course kaiseki cuisine.',
      price: 2100,
      date: new Date('2026-10-22'),
      category: 'Culture',
      location: 'Kyoto, Japan',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      duration: 5,
      difficulty: 'Easy',
      groupSize: 10,
      ratingAverage: 4.7,
      reviews: [
        { username: 'Emma K.', rating: 5, comment: 'Kyoto is magic. Our guide knew so much history, and the food was like art.', date: new Date() },
        { username: 'Liam N.', rating: 4, comment: 'Great temples, but lots of walking! Wear good shoes. Beautiful gardens.', date: new Date() }
      ]
    },
    {
      _id: new mongoose.Types.ObjectId(),
      title: 'Costa Rica Wildlife & Canopy Tour',
      shortDescription: 'Spot sloths, zip-line over rainforests, and kayak in bio-diverse river inlets.',
      fullDescription: 'Dive deep into the rich biodiversity of Tortuguero and Arenal. Spot monkeys, sloths, and exotic frogs on a boat safari, kayak through mangrove estuaries, and cross hanging suspension bridges in the rainforest canopy. Finish the adventure with a thrilling zip-line ride past active volcano slopes and relax in geothermal pools.',
      price: 1650,
      date: new Date('2026-11-05'),
      category: 'Adventure',
      location: 'Arenal, Costa Rica',
      imageUrl: 'https://images.unsplash.com/photo-1530731141654-5961ad6f7857?auto=format&fit=crop&w=800&q=80',
      duration: 8,
      difficulty: 'Moderate',
      groupSize: 14,
      ratingAverage: 4.6,
      reviews: [
        { username: 'Carlos R.', rating: 5, comment: 'Pura Vida! We saw three sloths on day one! Zip-lining was fast and exhilarating.', date: new Date() }
      ]
    },
    {
      _id: new mongoose.Types.ObjectId(),
      title: 'Cairo & Nile Archeological Discovery',
      shortDescription: 'Walk the Pyramids of Giza, cruise on a luxury Nile Dahabiya, and tour Valley of the Kings.',
      fullDescription: 'Unlock the secrets of ancient Egypt on an architectural and historical voyage. Marvel at the Pyramids of Giza and the Sphinx, browse the new Grand Egyptian Museum, and sail along the peaceful Nile River on a traditional wooden Dahabiya boat. Explore the chambers of Ramses and Tutankhamun in the Valley of the Kings with an Egyptologist.',
      price: 2990,
      date: new Date('2026-12-01'),
      category: 'Culture',
      location: 'Cairo, Egypt',
      imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
      duration: 9,
      difficulty: 'Moderate',
      groupSize: 15,
      ratingAverage: 4.5,
      reviews: [
        { username: 'Sarah W.', rating: 4, comment: 'Nile cruise was very relaxing and the sights are historical marvels.', date: new Date() }
      ]
    },
    {
      _id: new mongoose.Types.ObjectId(),
      title: 'Iceland Northern Lights Safari',
      shortDescription: 'Chase the Aurora Borealis, soak in the Blue Lagoon, and see black sand beaches.',
      fullDescription: 'Explore the land of fire and ice during the peak aurora season. Seek the elusive green lights in the night sky, traverse glowing glacier ice caves, and walk along the wind-swept black sand beaches of Vik. Warm up in geothermal hot springs and view powerful thundering waterfalls along the Golden Circle route.',
      price: 2450,
      date: new Date('2026-10-10'),
      category: 'Nature',
      location: 'Reykjavik, Iceland',
      imageUrl: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=800&q=80',
      duration: 5,
      difficulty: 'Moderate',
      groupSize: 12,
      ratingAverage: 4.7,
      reviews: [
        { username: 'Oliver J.', rating: 5, comment: 'We saw the lights on two separate nights! Stunning waterfalls and magical hot springs.', date: new Date() }
      ]
    },
    {
      _id: new mongoose.Types.ObjectId(),
      title: 'Greek Islands Yacht Sailing',
      shortDescription: 'Sail across the Aegean Sea, tour Santorini cliffs, and eat fresh Mediterranean food.',
      fullDescription: 'Embark on a luxury sailing catamaran tour through the Cyclades. Anchor in secluded turquoise coves, walk the white-washed streets of Mykonos and Paros, and witness the legendary sunset over the Santorini caldera. Savor fresh seafood dinners, local wines, and olive oil tastings along the way.',
      price: 2750,
      date: new Date('2026-09-01'),
      category: 'Relaxation',
      location: 'Santorini, Greece',
      imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
      duration: 7,
      difficulty: 'Easy',
      groupSize: 8,
      ratingAverage: 4.8,
      reviews: [
        { username: 'James B.', rating: 5, comment: 'Cruising the Aegean was perfect. Beautiful towns and very skilled crew.', date: new Date() }
      ]
    },
    {
      _id: new mongoose.Types.ObjectId(),
      title: 'Patagonia Wilderness Trekking',
      shortDescription: 'Challenging trek through Torres del Paine mountains, giant granite towers and lakes.',
      fullDescription: 'A classic trek through one of the wildest places on Earth. Traverse the famous W-Trek trail, getting up close to the iconic granite towers and massive Grey Glacier. Hike along turquoise alpine lakes, through forests, and spend nights under clear southern skies in mountain refugios.',
      price: 3200,
      date: new Date('2026-12-15'),
      category: 'Nature',
      location: 'Patagonia, Chile',
      imageUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=80',
      duration: 9,
      difficulty: 'Challenging',
      groupSize: 8,
      ratingAverage: 4.9,
      reviews: [
        { username: 'Elena V.', rating: 5, comment: 'Pure wilderness. A tough hike but the views of the Torres towers at sunrise were life-changing.', date: new Date() }
      ]
    }
  ];

  localListings.push(...defaultListings);
  console.log('Seeded local memory database with default values.');
};

seedLocalMemoryDb();

// Generic Data Manager Service
export class DataService {
  
  // Users Queries
  static async findUserByEmail(email: string) {
    if (isConnectedToMongo) {
      return await User.findOne({ email });
    }
    return localUsers.find(u => u.email === email) || null;
  }

  static async findUserById(id: string) {
    if (isConnectedToMongo) {
      return await User.findById(id);
    }
    const oid = id.toString();
    return localUsers.find(u => u._id.toString() === oid) || null;
  }

  static async createUser(userData: any) {
    if (isConnectedToMongo) {
      const newUser = new User(userData);
      return await newUser.save();
    }
    const newUser = {
      _id: new mongoose.Types.ObjectId(),
      ...userData,
      profile: userData.profile || { budget: 3000, interests: ['Adventure'], climate: 'Tropical', pace: 'Moderate' }
    };
    localUsers.push(newUser);
    return newUser;
  }

  static async updateUserProfile(userId: string, profileData: any) {
    if (isConnectedToMongo) {
      const user = await User.findById(userId);
      if (user) {
        user.profile = { ...user.profile, ...profileData };
        return await user.save();
      }
      return null;
    }
    const user = localUsers.find(u => u._id.toString() === userId);
    if (user) {
      user.profile = { ...user.profile, ...profileData };
      return user;
    }
    return null;
  }

  // Listings Queries
  static async getListings(filters: any = {}) {
    if (isConnectedToMongo) {
      return await Listing.find(filters);
    }

    // Return filtered local listings
    let result = [...localListings];
    
    if (filters.category) {
      result = result.filter(l => l.category === filters.category);
    }
    if (filters.difficulty) {
      result = result.filter(l => l.difficulty === filters.difficulty);
    }
    
    return result;
  }

  static async getListingsAdvanced(options: {
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    location?: string;
    difficulty?: string;
    sort?: string;
    page: number;
    limit: number;
  }) {
    if (isConnectedToMongo) {
      const query: any = {};
      if (options.q) {
        query.$or = [
          { title: { $regex: options.q, $options: 'i' } },
          { location: { $regex: options.q, $options: 'i' } },
          { category: { $regex: options.q, $options: 'i' } },
          { shortDescription: { $regex: options.q, $options: 'i' } }
        ];
      }
      if (options.category) query.category = options.category;
      if (options.location) query.location = { $regex: options.location, $options: 'i' };
      if (options.difficulty) query.difficulty = options.difficulty;
      if (options.minPrice !== undefined || options.maxPrice !== undefined) {
        query.price = {};
        if (options.minPrice !== undefined) query.price.$gte = options.minPrice;
        if (options.maxPrice !== undefined) query.price.$lte = options.maxPrice;
      }
      if (options.rating !== undefined) query.ratingAverage = { $gte: options.rating };

      let sortObj: any = { date: -1 };
      if (options.sort) {
        switch (options.sort) {
          case 'price_asc': sortObj = { price: 1 }; break;
          case 'price_desc': sortObj = { price: -1 }; break;
          case 'rating': sortObj = { ratingAverage: -1 }; break;
          case 'duration': sortObj = { duration: 1 }; break;
          case 'date_asc': sortObj = { date: 1 }; break;
        }
      }

      const total = await Listing.countDocuments(query);
      const listings = await Listing.find(query)
        .sort(sortObj)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit);

      return { listings, total };
    }

    // Simulated Advanced Queries
    let result = [...localListings];

    // Search query
    if (options.q) {
      const qLower = options.q.toLowerCase();
      result = result.filter(l => 
        l.title.toLowerCase().includes(qLower) ||
        l.location.toLowerCase().includes(qLower) ||
        l.category.toLowerCase().includes(qLower) ||
        l.shortDescription.toLowerCase().includes(qLower)
      );
    }

    // Category
    if (options.category) {
      result = result.filter(l => l.category === options.category);
    }

    // Location
    if (options.location) {
      const locLower = options.location.toLowerCase();
      result = result.filter(l => l.location.toLowerCase().includes(locLower));
    }

    // Difficulty
    if (options.difficulty) {
      result = result.filter(l => l.difficulty === options.difficulty);
    }

    // Price range
    if (options.minPrice !== undefined) {
      result = result.filter(l => l.price >= options.minPrice!);
    }
    if (options.maxPrice !== undefined) {
      result = result.filter(l => l.price <= options.maxPrice!);
    }

    // Rating
    if (options.rating !== undefined) {
      result = result.filter(l => l.ratingAverage >= options.rating!);
    }

    // Sorting
    if (options.sort) {
      switch (options.sort) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.ratingAverage - a.ratingAverage);
          break;
        case 'duration':
          result.sort((a, b) => a.duration - b.duration);
          break;
        case 'date_asc':
          result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          break;
        case 'date_desc':
        default:
          result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    } else {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    const total = result.length;
    const paginatedListings = result.slice((options.page - 1) * options.limit, options.page * options.limit);

    return { listings: paginatedListings, total };
  }

  static async getListingById(id: string) {
    if (isConnectedToMongo) {
      return await Listing.findById(id);
    }
    const oid = id.toString();
    return localListings.find(l => l._id.toString() === oid) || null;
  }

  static async getRelatedListings(listing: any, limit: number = 4) {
    if (isConnectedToMongo) {
      return await Listing.find({
        category: listing.category,
        _id: { $ne: listing._id }
      }).limit(limit);
    }
    return localListings
      .filter(l => l.category === listing.category && l._id.toString() !== listing._id.toString())
      .slice(0, limit);
  }

  static async createListing(listingData: any, userId: string) {
    if (isConnectedToMongo) {
      const newListing = new Listing({
        ...listingData,
        createdBy: new mongoose.Types.ObjectId(userId)
      });
      return await newListing.save();
    }
    
    const newListing = {
      _id: new mongoose.Types.ObjectId(),
      ...listingData,
      price: Number(listingData.price),
      duration: Number(listingData.duration),
      groupSize: Number(listingData.groupSize),
      ratingAverage: 4.5,
      reviews: [],
      createdBy: new mongoose.Types.ObjectId(userId)
    };
    localListings.push(newListing);
    return newListing;
  }

  static async deleteListing(id: string) {
    if (isConnectedToMongo) {
      return await Listing.findByIdAndDelete(id);
    }
    const oid = id.toString();
    const index = localListings.findIndex(l => l._id.toString() === oid);
    if (index !== -1) {
      localListings.splice(index, 1);
      return true;
    }
    return null;
  }

  static async addReview(listingId: string, reviewData: { username: string; rating: number; comment: string }) {
    if (isConnectedToMongo) {
      const listing = await Listing.findById(listingId);
      if (listing) {
        listing.reviews.push({ ...reviewData, date: new Date() });
        const totalRating = listing.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0);
        listing.ratingAverage = parseFloat((totalRating / listing.reviews.length).toFixed(1));
        return await listing.save();
      }
      return null;
    }

    const listing = localListings.find(l => l._id.toString() === listingId);
    if (listing) {
      listing.reviews.push({ ...reviewData, date: new Date() });
      const totalRating = listing.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0);
      listing.ratingAverage = parseFloat((totalRating / listing.reviews.length).toFixed(1));
      return listing;
    }
    return null;
  }
}
