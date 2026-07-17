import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DataService } from '../services/dataService';
import { authMiddleware, AuthRequest } from './auth';

export const aiRouter = Router();

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('Failed to initialize GoogleGenerativeAI client:', error);
    return null;
  }
};

// 1. AI Content & Itinerary Generator Endpoint
aiRouter.post('/generate-itinerary', async (req: Request, res: Response) => {
  try {
    const { listingId, title, description, duration, pace, focus } = req.body;

    const days = Number(duration) || 3;
    const selectedPace = pace || 'Moderate';
    const selectedFocus = focus || 'Adventure';
    const tripTitle = title || 'Your Aetheria Adventure';

    const prompt = `
      Create a detailed, high-quality, and realistic day-by-day travel itinerary for a travel package.
      Title: "${tripTitle}"
      Overview: "${description || 'A beautiful getaway experience.'}"
      Trip Duration: ${days} days
      Pace: ${selectedPace} (Relaxed, Moderate, or Active)
      Primary Focus: ${selectedFocus} (Adventure, Culture, Food, Wellness, or Relaxation)

      Provide the response in structured JSON format with the following keys:
      {
        "highlights": [string],
        "itinerary": [
          { "day": number, "title": string, "morning": string, "afternoon": string, "evening": string }
        ],
        "packingList": [string],
        "safetyTips": [string]
      }
      Do not output any markdown formatting, only pure JSON.
    `;

    const genAI = getGeminiClient();
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.status(200).json(parsed);
        }
      } catch (err) {
        console.warn('Gemini live call failed, falling back to simulated engine:', err);
      }
    }

    const simulatedResponse = simulateItinerary(tripTitle, selectedFocus, selectedPace, days);
    return res.status(200).json(simulatedResponse);

  } catch (error) {
    console.error('Itinerary generation error:', error);
    res.status(500).json({ message: 'Error generating itinerary' });
  }
});

// Helper: Itinerary Simulation
function simulateItinerary(title: string, focus: string, pace: string, days: number) {
  const morningActivities = {
    Adventure: ['Guided sunrise hiking tour', 'Whitewater rafting safety briefing and launch', 'Canyoning adventure down the gorge', 'Mountain bike trail exploration'],
    Culture: ['Guided museum walking tour', 'Local artisan market visit', 'Heritage architecture photography walk', 'Historical temple exploration'],
    Food: ['Local cooking school pastry masterclass', 'Fresh fish market tour and seafood breakfast', 'Organic spice garden exploration', 'Street food breakfast crawl'],
    Wellness: ['Sunrise yoga session on the terrace', 'Silent forest bathing meditation', 'Sound healing therapy session', 'Mineral hot springs soak'],
    Relaxation: ['Gourmet breakfast in bed with ocean views', 'Beach hammock relaxation and reading', 'Subtle garden walk', 'Leisurely poolside sunbathing']
  };

  const afternoonActivities = {
    Adventure: ['Ziplining through forest canopy', 'Kayaking in ocean currents', 'ATV off-road trail expedition', 'Rock climbing experience with local guide'],
    Culture: ['Traditional cooking class and lunch', 'Ceramics workshop with local master', 'Interactive history museum visit', 'Folk art demonstration'],
    Food: ['Fine wine and local cheese pairing lunch', 'Gourmet street food tasting tour', 'Local coffee roastery workshop', 'Dessert and tea tasting crawl'],
    Wellness: ['Aromatherapy full-body massage', 'Detox mud wrap treatment', 'Reflexology walk and herbal tea session', 'Therapeutic hydrotherapy pool access'],
    Relaxation: ['Gentle coastal catamaran sailing', 'Spa manicure and facial', 'Seaside reading and cocktail flight', 'Private beach cabana rest']
  };

  const eveningActivities = {
    Adventure: ['Campfire gathering under the stars', 'Night safari hike', 'Seafood grill on the beach', 'Stargazing session with local astronomer'],
    Culture: ['Traditional music and dance performance', 'Storytelling dinner with historical experts', 'Night market shopping and dining', 'Sunset temple views and blessings'],
    Food: ['7-course chef table degustation dinner', 'Sunset cocktail mixing session and dining', 'Night-time tapas and wine crawl', 'Traditional BBQ dinner under the stars'],
    Wellness: ['Candlelight restoration yoga', 'Warm herbal bath', 'Organic farm-to-table light dinner', 'Evening meditation and chamomile tea'],
    Relaxation: ['Candlelit beach dinner', 'Sunset jazz lounge cocktails', 'Private balcony jacuzzi and mocktails', 'Acoustic beachside music and cocktails']
  };

  const activityFocus = (focus as keyof typeof morningActivities) in morningActivities 
    ? (focus as keyof typeof morningActivities) 
    : 'Adventure';

  const highlights = [
    `Curated day plans optimized for a ${pace.toLowerCase()} pace.`,
    `Immersive focus on local ${focus.toLowerCase()} experiences.`,
    `Handpicked scenic viewpoints and dining recommendations.`
  ];

  const itinerary = [];
  for (let i = 1; i <= days; i++) {
    const mAct = morningActivities[activityFocus][i % morningActivities[activityFocus].length];
    const aAct = afternoonActivities[activityFocus][i % afternoonActivities[activityFocus].length];
    const eAct = eveningActivities[activityFocus][i % eveningActivities[activityFocus].length];

    itinerary.push({
      day: i,
      title: `Day ${i}: Discovering the Essence of ${title}`,
      morning: `${mAct}. Start the day with energy, enjoying a local organic breakfast.`,
      afternoon: `${aAct}. Immerse yourself in the environment, taking plenty of photos and connecting with local experts.`,
      evening: `${eAct}. Wind down the day, reflecting on your adventures over a premium dining experience.`
    });
  }

  const packingList = [
    'Comfortable layered clothing adapted to regional climate',
    'Sturdy walking shoes or hiking boots',
    'Reusable water bottle and sunscreen (SPF 50+)',
    'Camera or smartphone for memories',
    'Personal medications and a light windbreaker jacket'
  ];

  if (focus === 'Adventure') {
    packingList.push('Dry bag for water activities', 'Insect repellent');
  } else if (focus === 'Wellness') {
    packingList.push('Comfortable yoga attire', 'Slip-on shoes for spa visits');
  } else if (focus === 'Relaxation') {
    packingList.push('Swimwear & beach towel', 'Sun hat and sunglasses');
  }

  const safetyTips = [
    'Always stay hydrated during outings.',
    'Keep your guide\'s contact details handy.',
    'Respect local cultural customs and dress codes.',
    'Ensure you have travel insurance details saved offline.'
  ];

  return { highlights, itinerary, packingList, safetyTips };
}

// 2. AI Smart Recommendation Engine Endpoint
aiRouter.post('/recommendations', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await DataService.findUserById(req.user?.id || '');
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const { budget, interests, climate, pace } = user.profile;

    // Fetch all listings using DataService
    const listings = await DataService.getListings({});

    const prompt = `
      You are an expert travel matchmaking agent.
      User Profile:
      - Budget Limit: $${budget}
      - Interests: ${interests.join(', ')}
      - Climate Preference: ${climate}
      - Travel Pace: ${pace}

      Available Listings Data (JSON):
      ${JSON.stringify(listings.map((l: any) => ({ id: l._id, title: l.title, category: l.category, price: l.price, location: l.location, duration: l.duration, difficulty: l.difficulty })))}

      Recommend the best 3 trips from the listings that match this user's profile.
      For each trip recommended, provide:
      1. The listing id.
      2. A personalized explanation/reasoning of why this listing was chosen for them, highlighting budget compatibility, interest alignment, and pace.

      Output the response in structured JSON format with this schema:
      {
        "personalizedIntro": "string summary message",
        "recommendations": [
          { "listingId": "string", "reasoning": "string" }
        ]
      }
      Do not output any markdown formatting, only pure JSON.
    `;

    const genAI = getGeminiClient();
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.status(200).json(parsed);
        }
      } catch (err) {
        console.warn('Gemini live recommendations call failed, falling back to simulated match:', err);
      }
    }

    const simulatedMatches = simulateRecommendations(user.profile, listings);
    return res.status(200).json(simulatedMatches);

  } catch (error) {
    console.error('Recommendation engine error:', error);
    res.status(500).json({ message: 'Error generating recommendations' });
  }
});

// Helper: Score and Match Listings
function simulateRecommendations(profile: any, listings: any[]) {
  const { budget, interests, climate, pace } = profile;

  // Score each listing
  const scored = listings.map(listing => {
    let score = 0;

    if (listing.price <= budget) {
      score += 4;
    } else if (listing.price <= budget * 1.25) {
      score += 1.5;
    }

    const matchingInterests = interests.filter((interest: string) => 
      listing.category.toLowerCase().includes(interest.toLowerCase()) ||
      listing.title.toLowerCase().includes(interest.toLowerCase()) ||
      listing.shortDescription.toLowerCase().includes(interest.toLowerCase())
    );
    score += matchingInterests.length * 3;

    const categoryLower = listing.category.toLowerCase();
    const locationLower = listing.location.toLowerCase();

    if (climate === 'Tropical' && (categoryLower.includes('beach') || categoryLower.includes('island') || locationLower.includes('bali') || locationLower.includes('maldives') || locationLower.includes('thailand') || locationLower.includes('costa'))) {
      score += 2.5;
    } else if (climate === 'Cold' && (categoryLower.includes('mountain') || categoryLower.includes('snow') || categoryLower.includes('ski') || locationLower.includes('switzerland') || locationLower.includes('iceland') || locationLower.includes('nepal'))) {
      score += 2.5;
    } else if (climate === 'Warm' && (categoryLower.includes('desert') || locationLower.includes('egypt') || locationLower.includes('safari') || locationLower.includes('greece'))) {
      score += 2.5;
    } else if (climate === 'Temperate' && (categoryLower.includes('city') || categoryLower.includes('culture') || locationLower.includes('japan') || locationLower.includes('italy') || locationLower.includes('france') || locationLower.includes('kyoto'))) {
      score += 2.5;
    }

    if (pace === 'Relaxed' && listing.difficulty === 'Easy') {
      score += 2;
    } else if (pace === 'Moderate' && listing.difficulty === 'Moderate') {
      score += 2;
    } else if (pace === 'Active' && listing.difficulty === 'Challenging') {
      score += 2;
    }

    return { listing, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const top3 = scored.slice(0, 3);
  const recommendations = top3.map(item => {
    const l = item.listing;
    let reason = `Recommended because it matches your interest in ${l.category}. `;
    if (l.price <= budget) {
      reason += `At $${l.price}, it is well within your budget limit of $${budget}. `;
    } else {
      reason += `At $${l.price}, it is slightly above your target budget, but offers incredible value. `;
    }

    if (pace === 'Relaxed' && l.difficulty === 'Easy') {
      reason += `The Easy difficulty aligns perfectly with your preference for a relaxed pace.`;
    } else if (pace === 'Active' && l.difficulty === 'Challenging') {
      reason += `The challenging activities match your desire for an active, high-intensity adventure.`;
    } else {
      reason += `The moderate intensity matches your preferred physical activity pace.`;
    }

    return {
      listingId: l._id.toString(),
      reasoning: reason
    };
  });

  const interestText = interests.length > 0 ? interests.join('/') : 'your profile';
  return {
    personalizedIntro: `Hello! Based on your budget of $${budget}, preference for a ${pace.toLowerCase()} pace, and interest in ${interestText}, we have matched you with these handpicked destinations:`,
    recommendations
  };
}

// 3. AI Chat Assistant (Concierge) Endpoint
aiRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages, currentUrl, activeListingId } = req.body;

    const userMessage = messages[messages.length - 1]?.content || '';
    
    let contextListing: any = null;
    if (activeListingId && (typeof activeListingId === 'string' && activeListingId.length === 24)) {
      contextListing = await DataService.getListingById(activeListingId);
    }

    const contextPrompt = `
      You are the Aetheria AI Travel Concierge, a smart, friendly, and helpful agent.
      Current URL/Page context: ${currentUrl || 'Home page'}
      ${contextListing ? `Active Listing Context:
      - Title: "${contextListing.title}"
      - Category: ${contextListing.category}
      - Price: $${contextListing.price}
      - Location: ${contextListing.location}
      - Duration: ${contextListing.duration} days
      - Difficulty: ${contextListing.difficulty}
      - Group Size: Up to ${contextListing.groupSize} people
      - Rating: ${contextListing.ratingAverage}/5` : 'No specific listing is currently open.'}

      Conversation History:
      ${messages.map((m: any) => `${m.role === 'user' ? 'User' : 'Concierge'}: ${m.content}`).join('\n')}

      Respond to the user's latest query in a concise, friendly, and engaging manner. 
      If they ask about the package, price, location, or schedule, use the Active Listing Context.
      Suggest 2-3 short, clickable follow-up prompt questions for the user based on your reply.

      Format the response in JSON:
      {
        "content": "Your chat response text here",
        "suggestedPrompts": ["question 1", "question 2"]
      }
      Do not output any markdown formatting, only pure JSON.
    `;

    const genAI = getGeminiClient();
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(contextPrompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.status(200).json(parsed);
        }
      } catch (err) {
        console.warn('Gemini live chat call failed, falling back to simulated response:', err);
      }
    }

    const simulatedChat = simulateChatResponse(userMessage, currentUrl, contextListing);
    return res.status(200).json(simulatedChat);

  } catch (error) {
    console.error('AI Chat Assistant error:', error);
    res.status(500).json({ message: 'Error processing chat message' });
  }
});

// Helper: Context-Aware Chat Response
function simulateChatResponse(userMessage: string, url: string, listing: any | null) {
  const msg = userMessage.toLowerCase();
  let content = "Hello! I am the Aetheria AI Concierge. I can help you search for destinations, calculate travel costs, customize itineraries, or answer questions about our activities. How can I help you today?";
  let suggestedPrompts = [
    'How do recommendations work?',
    'Show me budget adventures',
    'Where is the best place to travel?'
  ];

  if (listing) {
    if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
      content = `The "${listing.title}" package costs $${listing.price} per person. This includes all guided excursions, local transportation, gear rentals, and accommodation as specified.`;
      suggestedPrompts = [
        'What difficulty is this?',
        'Can I generate a day-by-day itinerary?',
        'What is included in this trip?'
      ];
    } else if (msg.includes('duration') || msg.includes('days') || msg.includes('how long')) {
      content = `The duration of the "${listing.title}" trip is ${listing.duration} days. It features a ${listing.difficulty.toLowerCase()} level of difficulty, which is ideal for people seeking a ${listing.difficulty === 'Challenging' ? 'demanding and rewarding' : 'balanced'} pace.`;
      suggestedPrompts = [
        'Generate an itinerary for this',
        'What is the maximum group size?',
        'How much does it cost?'
      ];
    } else if (msg.includes('difficulty') || msg.includes('hard') || msg.includes('easy') || msg.includes('challenging')) {
      content = `This trip is rated as "${listing.difficulty}". It typically requires a ${listing.difficulty === 'Easy' ? 'basic' : listing.difficulty === 'Moderate' ? 'moderate' : 'very good'} level of physical fitness. Group size is limited to ${listing.groupSize} participants to ensure personal attention from guides.`;
      suggestedPrompts = [
        'What should I pack for this?',
        'Generate itinerary',
        'Reviews for this trip'
      ];
    } else if (msg.includes('pack') || msg.includes('packing') || msg.includes('bring')) {
      content = `For the "${listing.title}" in ${listing.location}, we recommend packing layered clothing suitable for ${listing.category.toLowerCase()} activities, comfortable walking or trail shoes, a reusable water bottle, sunscreen, and a light camera. You can also generate a custom packing list using our "AI Itinerary Planner" widget on this page!`;
      suggestedPrompts = [
        'How many days is this trip?',
        'Generate itinerary',
        'Show details about reviews'
      ];
    } else if (msg.includes('itinerary') || msg.includes('schedule') || msg.includes('plan')) {
      content = `You can generate a personalized day-by-day itinerary for "${listing.title}" right here! Use the AI Itinerary widget above to select your preferred pace and activity focus, and I'll build a custom schedule for you.`;
      suggestedPrompts = [
        'What is the price?',
        'Is this trip difficult?',
        'Tell me about related items'
      ];
    } else {
      content = `The "${listing.title}" in ${listing.location} is an incredible choice! It falls under the "${listing.category}" category and has a solid rating of ${listing.ratingAverage}/5 stars based on customer reviews. Would you like me to help you generate a custom day-by-day plan or answer any specific questions about it?`;
      suggestedPrompts = [
        'How much does this trip cost?',
        'Generate custom itinerary',
        'What is the physical difficulty?'
      ];
    }
  } else if (url && (url.includes('/explore') || url.includes('/listings'))) {
    if (msg.includes('filter') || msg.includes('search')) {
      content = `You can filter our adventures by using the sidebar on the left. You can filter by category (e.g. Adventure, Culture, Wellness), price range, ratings, and location. You can also search by keyword or sort by price/rating.`;
      suggestedPrompts = [
        'What are the most popular trips?',
        'Show me the cheapest trip',
        'How do I get recommendations?'
      ];
    } else {
      content = `You are currently browsing our Explore page! Feel free to search for destinations like "Bali", "Japan", or "Swiss Alps". I can help you filter, or you can complete your Travel Profile in the profile page to get personalized matching suggestions.`;
      suggestedPrompts = [
        'Show me budget adventures',
        'Tell me about luxury packages',
        'How do recommendations work?'
      ];
    }
  } else if (url && url.includes('/manage')) {
    content = `You are on the Listings Manager dashboard. Here you can see analytics about listing distributions and reviews. You can view existing listings or delete them if they are outdated. Use the button in the navbar to add a new listing.`;
    suggestedPrompts = [
      'How do I add a listing?',
      'Tell me about listings distribution',
      'Go to homepage'
    ];
  } else {
    if (msg.includes('recommend') || msg.includes('match') || msg.includes('suggest')) {
      content = `Our Smart Recommendation Engine analyzes your Travel Profile (budget, climate, interests, and pace) to match you with top listings in our database. Make sure you are logged in and have filled out your profile settings to see these matches!`;
      suggestedPrompts = [
        'Complete my travel profile',
        'What categories do you offer?',
        'Tell me about Aetheria'
      ];
    } else {
      content = `Welcome to Aetheria! I am your AI travel agent. I can answer questions, guide you through adding new tour packages, help you filter listings on the Explore page, or give you personalized recommendations. What's on your travel mind?`;
      suggestedPrompts = [
        'How do recommendations work?',
        'Tell me about Aetheria',
        'Search for tour listings'
      ];
    }
  }

  return { content, suggestedPrompts };
}
