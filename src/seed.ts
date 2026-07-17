import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User, Listing } from './models/models';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://Agentic-AI-Project:TVNQPYyUnnnVIovQ@ac-i2evadz-shard-00-00.v3xzplr.mongodb.net:27017,ac-i2evadz-shard-00-01.v3xzplr.mongodb.net:27017,ac-i2evadz-shard-00-02.v3xzplr.mongodb.net:27017/?ssl=true&replicaSet=atlas-48z3v9-shard-0&authSource=admin&appName=Cluster0';

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing data
    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Listing.deleteMany({});
    console.log('Cleared existing data.');

    // Create Demo User
    const hashedPassword = await bcrypt.hash('demo1234', 10);
    const demoUser = new User({
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
    await demoUser.save();
    console.log('Demo user seeded successfully (demo@aetheria.com / demo1234).');

    // Create Listings
    const listings = [
      {
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

    await Listing.insertMany(listings);
    console.log('Seed listings successfully added to database!');

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
