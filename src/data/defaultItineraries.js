// Default Itineraries for destinations — NOMAD Travel Planner
// Format: Morning → Breakfast → Afternoon → Lunch → Evening → Dinner → Hotel + Daily Cost

const defaultItineraries = {
  jaipur: {
    destination: 'Jaipur, Rajasthan',
    totalDays: 3,
    totalEstimatedCost: '₹18,500',
    packingTips: 'Light cotton clothing, comfortable walking shoes, sunscreen (SPF 50+), sunglasses, a scarf/dupatta for temple visits, reusable water bottle, power bank.',
    generalTips: 'Best visited October–March. Bargain at local markets. Carry cash for street food. Uber/Ola work well. Hindi and English widely spoken.',
    emergencyContacts: 'Police: 100 | Ambulance: 108 | Tourism Helpline: 1363 | SMS Hospital: 0141-256 0291',
    days: [
      {
        dayNumber: 1,
        title: 'Royal Jaipur — Forts & Palaces',
        date: 'Day 1',
        morning: { activity: 'Explore the majestic Amber Fort with its mirror work and stunning views', location: 'Amber Fort, Devisinghpura, Amer', tip: 'Arrive by 9 AM to beat the crowds. Opt for a jeep ride up the hill instead of elephants.' },
        breakfast: { restaurant: 'Rawat Mishthan Bhandar', mustTry: 'Pyaaz Kachori with Mirchi Vada', estCost: '₹200' },
        afternoon: { activity: 'Visit City Palace museum and the ornate Hawa Mahal', location: 'City Palace, Jaleb Chowk, Amer', tip: 'Hire a guide at City Palace for ₹300 — the stories bring it alive.' },
        lunch: { restaurant: 'LMB (Laxmi Mishthan Bhandar)', mustTry: 'Rajasthani Thali with Dal Baati Churma', estCost: '₹500' },
        evening: { activity: 'Watch sunset from Nahargarh Fort overlooking the city', location: 'Nahargarh Fort, Brahmpuri', tip: 'The fort café serves decent food with a jaw-dropping view of the pink city.' },
        dinner: { restaurant: '1135 AD at Amber Fort', mustTry: 'Laal Maas (spicy mutton curry)', estCost: '₹1,800' },
        hotel: 'Zostel Jaipur / Hotel Pearl Palace',
        estimatedDayCost: '₹5,500'
      },
      {
        dayNumber: 2,
        title: 'Culture & Crafts — Bazaars & Temples',
        date: 'Day 2',
        morning: { activity: 'Explore Jantar Mantar, the UNESCO astronomical observatory', location: 'Jantar Mantar, Gangori Bazaar, J.D.A. Market', tip: 'The giant sundial still tells accurate time — test it!' },
        breakfast: { restaurant: 'Tapri Central', mustTry: 'Masala Chai with Bun Maska', estCost: '₹150' },
        afternoon: { activity: 'Shopping at Johari Bazaar & Bapu Bazaar for textiles and jewelry', location: 'Johari Bazaar, Pink City', tip: 'Bargain hard — start at 40% of the quoted price.' },
        lunch: { restaurant: 'Handi Restaurant', mustTry: 'Handi Mutton / Paneer Handi with Naan', estCost: '₹600' },
        evening: { activity: 'Visit Albert Hall Museum and stroll through Ram Niwas Bagh', location: 'Albert Hall Museum, Ram Niwas Garden', tip: 'The museum is beautifully lit at night — great for photos.' },
        dinner: { restaurant: 'Chokhi Dhani (ethnic village resort)', mustTry: 'Traditional Rajasthani Thali with folk performances', estCost: '₹1,200' },
        hotel: 'Zostel Jaipur / Hotel Pearl Palace',
        estimatedDayCost: '₹5,200'
      },
      {
        dayNumber: 3,
        title: 'Hidden Gems & Farewell',
        date: 'Day 3',
        morning: { activity: 'Visit Panna Meena ka Kund stepwell & Jal Mahal photo stop', location: 'Panna Meena ka Kund, Amer', tip: 'Jal Mahal is photogenic from the road — you can\'t enter the palace itself.' },
        breakfast: { restaurant: 'Anokhi Café', mustTry: 'French Toast with Fresh Juice', estCost: '₹350' },
        afternoon: { activity: 'Explore Galtaji Temple (Monkey Temple) and Sisodia Rani Garden', location: 'Galtaji, Jaipur', tip: 'Keep belongings secure — the monkeys are cheeky but harmless.' },
        lunch: { restaurant: 'Spice Court', mustTry: 'Ker Sangri with Bajra Roti', estCost: '₹550' },
        evening: { activity: 'Sunset shopping at Bapu Bazaar for last-minute souvenirs', location: 'Bapu Bazaar, Pink City', tip: 'Buy blue pottery, block-print fabrics, and mojari shoes as souvenirs.' },
        dinner: { restaurant: 'Bar Palladio', mustTry: 'Italian-Rajasthani fusion with craft cocktails', estCost: '₹2,000' },
        hotel: 'Departure / Zostel Jaipur',
        estimatedDayCost: '₹7,800'
      }
    ]
  },

  goa: {
    destination: 'Goa',
    totalDays: 3,
    totalEstimatedCost: '₹22,000',
    packingTips: 'Swimwear, flip-flops, sunscreen (SPF 50+), light cotton clothes, mosquito repellent, waterproof phone pouch, party outfits for nightlife.',
    generalTips: 'Rent a scooter (₹300-400/day) for the best experience. North Goa is vibrant & party-centric, South Goa is calm & scenic. Carry cash for beach shacks.',
    emergencyContacts: 'Police: 100 | Ambulance: 108 | Tourism Helpline: 1800-233-7462 | Goa Medical College: 0832-245 8727',
    days: [
      {
        dayNumber: 1,
        title: 'North Goa Beaches & Vibes',
        date: 'Day 1',
        morning: { activity: 'Explore Calangute & Baga Beach — water sports (parasailing, jet ski)', location: 'Baga Beach, North Goa', tip: 'Negotiate water sports prices. Parasailing should be ₹500-800, not ₹1500.' },
        breakfast: { restaurant: 'Infantaria', mustTry: 'Goan Pork Sausage Omelette with Poi bread', estCost: '₹350' },
        afternoon: { activity: 'Visit Fort Aguada and Sinquerim Beach', location: 'Fort Aguada, Candolim', tip: 'The lighthouse offers panoramic views of the Arabian Sea.' },
        lunch: { restaurant: 'Britto\'s (Baga Beach)', mustTry: 'Goan Fish Curry Rice with Prawn Balchão', estCost: '₹700' },
        evening: { activity: 'Sunset drinks at Curlies Beach Shack, Anjuna', location: 'Anjuna Beach, North Goa', tip: 'Wednesday is flea market day at Anjuna — combine both!' },
        dinner: { restaurant: 'Thalassa Greek Restaurant', mustTry: 'Grilled Seafood Platter with greek salad', estCost: '₹1,500' },
        hotel: 'Zostel Goa Anjuna / The Hosteller',
        estimatedDayCost: '₹6,500'
      },
      {
        dayNumber: 2,
        title: 'Heritage & Spice Trail',
        date: 'Day 2',
        morning: { activity: 'Visit Basilica of Bom Jesus (UNESCO) & Se Cathedral in Old Goa', location: 'Old Goa, Tiswadi', tip: 'These are active churches — dress modestly (cover shoulders & knees).' },
        breakfast: { restaurant: 'Café Bodega', mustTry: 'Eggs Benedict with fresh orange juice', estCost: '₹400' },
        afternoon: { activity: 'Tropical Spice Plantation tour with lunch', location: 'Ponda, Goa', tip: 'Most spice farms include a buffet lunch with feni tasting in the ticket.' },
        lunch: { restaurant: 'Spice Plantation Buffet (included in tour)', mustTry: 'Authentic Goan Xacuti & Vindaloo', estCost: '₹Included' },
        evening: { activity: 'Latin Quarter walk in Fontainhas & Altinho Hill views', location: 'Fontainhas, Panaji', tip: 'The colorful Portuguese houses make for incredible Instagram photos.' },
        dinner: { restaurant: 'Viva Panjim', mustTry: 'Pork Vindaloo with Sannas (Goan rice cakes)', estCost: '₹800' },
        hotel: 'Zostel Goa Anjuna / The Hosteller',
        estimatedDayCost: '₹5,500'
      },
      {
        dayNumber: 3,
        title: 'South Goa Serenity',
        date: 'Day 3',
        morning: { activity: 'Relax at the crescent-shaped Palolem Beach', location: 'Palolem Beach, Canacona, South Goa', tip: 'Hire a kayak (₹500/hr) and paddle to Butterfly Beach — it\'s magical.' },
        breakfast: { restaurant: 'Dropadi (Palolem)', mustTry: 'Banana Pancakes with Honey & Fresh Fruit Bowl', estCost: '₹250' },
        afternoon: { activity: 'Cabo de Rama Fort and Cola Beach secret lagoon', location: 'Cola Beach, Canacona', tip: 'Cola Beach has a freshwater lagoon that meets the sea — surreal scenery.' },
        lunch: { restaurant: 'Martin\'s Corner (Betalbatim)', mustTry: 'Crab Xec Xec & Rava Fried Fish', estCost: '₹900' },
        evening: { activity: 'Silent noise party or beach bonfire at Palolem', location: 'Palolem Beach, South Goa', tip: 'The silent disco headphone parties are a uniquely Goan experience!' },
        dinner: { restaurant: 'The Black Sheep Bistro (Panaji)', mustTry: 'Bebinca (13-layer Goan dessert) & Seafood risotto', estCost: '₹1,200' },
        hotel: 'Departure',
        estimatedDayCost: '₹10,000'
      }
    ]
  },

  kerala: {
    destination: 'Kerala',
    totalDays: 4,
    totalEstimatedCost: '₹32,000',
    packingTips: 'Light cotton clothes, rain jacket/umbrella, mosquito repellent, comfortable walking shoes, swimwear for beaches, modest clothing for temples.',
    generalTips: 'Kerala is humid year-round. Google Maps works great here. Try local buses for authentic experience. Book houseboats 2 weeks in advance. Most places accept UPI.',
    emergencyContacts: 'Police: 100 | Ambulance: 108 | Tourism: 1800-425-4747 | KTDC: 0471-233 0031',
    days: [
      {
        dayNumber: 1,
        title: 'Kochi — Spice & Colonial Heritage',
        date: 'Day 1',
        morning: { activity: 'Explore Fort Kochi — Chinese Fishing Nets, St. Francis Church, Mattancherry Palace', location: 'Fort Kochi, Ernakulam', tip: 'Walk the Fort Kochi area — everything is within 2 km radius.' },
        breakfast: { restaurant: 'Kashi Art Café', mustTry: 'Kerala Banana Pancakes with Filter Coffee', estCost: '₹300' },
        afternoon: { activity: 'Jew Town antique market and Paradesi Synagogue', location: 'Mattancherry, Kochi', tip: 'The spice shops here sell fresh cardamom, pepper, and vanilla at wholesale prices.' },
        lunch: { restaurant: 'Kayees Rahmathulla Hotel', mustTry: 'Kerala Biryani with Pathiri', estCost: '₹350' },
        evening: { activity: 'Watch a Kathakali dance performance', location: 'Kerala Kathakali Centre, Fort Kochi', tip: 'Arrive 30 min early to watch the elaborate makeup process — it is part of the show.' },
        dinner: { restaurant: 'Fort House Restaurant', mustTry: 'Karimeen Pollichathu (Pearl spot fish in banana leaf)', estCost: '₹800' },
        hotel: 'Zostel Kochi / Fort House Heritage',
        estimatedDayCost: '₹6,000'
      },
      {
        dayNumber: 2,
        title: 'Munnar — Tea Gardens & Misty Peaks',
        date: 'Day 2',
        morning: { activity: 'Drive Kochi → Munnar (4 hrs). Stop at Cheeyappara Waterfalls en route', location: 'Cheeyappara Falls, Idukki', tip: 'Start by 6 AM — the hairpin bends are scenic but slow.' },
        breakfast: { restaurant: 'On the way — packed breakfast or Aby\'s', mustTry: 'Puttu & Kadala Curry', estCost: '₹200' },
        afternoon: { activity: 'Visit Eravikulam National Park (Nilgiri Tahr spotting) & Tea Museum', location: 'Eravikulam NP / KDHP Tea Museum, Munnar', tip: 'Book Eravikulam tickets online — they sell out by 10 AM in peak season.' },
        lunch: { restaurant: 'Saravana Bhavan Munnar', mustTry: 'Kerala Meals (Sadya-style) with Avial & Sambar', estCost: '₹300' },
        evening: { activity: 'Walk through the tea gardens at sunset. Visit the Rose Garden.', location: 'Munnar Tea Plantations', tip: 'The best photo spots are along the Mattupetty Road tea estates.' },
        dinner: { restaurant: 'Rapsy Restaurant', mustTry: 'Pepper Chicken & Appam', estCost: '₹600' },
        hotel: 'Misty Mountain Resort / Tea County',
        estimatedDayCost: '₹7,500'
      },
      {
        dayNumber: 3,
        title: 'Alleppey — Backwater Bliss',
        date: 'Day 3',
        morning: { activity: 'Drive Munnar → Alleppey (4.5 hrs). Board your houseboat by noon.', location: 'Alleppey Boat Jetty, Alappuzha', tip: 'Book a private houseboat for ₹6000-8000. Shared ones lack privacy.' },
        breakfast: { restaurant: 'Hotel Nalapad (en route)', mustTry: 'Idiyappam with Egg Curry', estCost: '₹200' },
        afternoon: { activity: 'Houseboat cruise through Vembanad Lake backwaters', location: 'Vembanad Lake, Alleppey Backwaters', tip: 'The houseboat crew cooks fresh Kerala meals onboard — just relax and float.' },
        lunch: { restaurant: 'Onboard Houseboat (included)', mustTry: 'Fresh Karimeen fry cooked by boat chef', estCost: '₹Included' },
        evening: { activity: 'Watch the sunset from the houseboat deck, spot kingfishers & cormorants', location: 'Alleppey Backwaters', tip: 'Evening tea on the deck with banana chips is peak serenity.' },
        dinner: { restaurant: 'Onboard Houseboat (included)', mustTry: 'Kerala Prawn Curry with Red Rice', estCost: '₹Included' },
        hotel: 'Overnight on Houseboat',
        estimatedDayCost: '₹9,000'
      },
      {
        dayNumber: 4,
        title: 'Beach Day & Departure',
        date: 'Day 4',
        morning: { activity: 'Disembark houseboat. Visit Alleppey Beach and lighthouse', location: 'Alleppey Beach, Alappuzha', tip: 'The pier area is great for a morning walk. Grab fresh coconut water.' },
        breakfast: { restaurant: 'Mushroom Café (Alleppey)', mustTry: 'Appam with Vegetable Stew', estCost: '₹250' },
        afternoon: { activity: 'Visit Marari Beach — Kerala\'s cleanest beach, coir-making village walk', location: 'Marari Beach, Alappuzha', tip: 'This is a quiet, uncrowded beach — perfect for relaxing before departure.' },
        lunch: { restaurant: 'Chakara Restaurant at Marari', mustTry: 'Meen Moilee (fish in coconut milk) with Appam', estCost: '₹500' },
        evening: { activity: 'Souvenir shopping — spices, coir products, Kathakali masks', location: 'Local Markets, Alleppey', tip: 'Buy whole spices here — they\'re fresher and cheaper than airports.' },
        dinner: { restaurant: 'Harbour Restaurant', mustTry: 'Beef Fry with Malabar Parotta', estCost: '₹400' },
        hotel: 'Departure from Kochi Airport',
        estimatedDayCost: '₹9,500'
      }
    ]
  },

  varanasi: {
    destination: 'Varanasi, Uttar Pradesh',
    totalDays: 2,
    totalEstimatedCost: '₹8,000',
    packingTips: 'Comfortable walking shoes (lanes are narrow), light clothes, a scarf for temples, flashlight for evening ghat walks, hand sanitizer.',
    generalTips: 'Varanasi is chaotic — embrace it. Auto-rickshaws are the best way to get around. Always negotiate fares in advance. Respect local customs at ghats.',
    emergencyContacts: 'Police: 100 | Ambulance: 108 | Tourism: 0542-250 6638 | BHU Hospital: 0542-236 8558',
    days: [
      {
        dayNumber: 1,
        title: 'Sacred Ghats & Ancient Temples',
        date: 'Day 1',
        morning: { activity: 'Sunrise boat ride on the Ganges — witness morning rituals at the ghats', location: 'Dashashwamedh Ghat, Varanasi', tip: 'Book a private boat for ₹500 (1 hour). Shared boats are ₹100/person.' },
        breakfast: { restaurant: 'Blue Lassi Shop', mustTry: 'Saffron Lassi & Malaiyyo (winter specialty)', estCost: '₹100' },
        afternoon: { activity: 'Visit Kashi Vishwanath Temple and walk the ancient lanes', location: 'Kashi Vishwanath Temple, Varanasi', tip: 'Leave phones/bags at hotel — security is strict. Carry only ID.' },
        lunch: { restaurant: 'Kachori Gali Stalls', mustTry: 'Kachori Sabzi with Jalebi', estCost: '₹80' },
        evening: { activity: 'Witness the grand Ganga Aarti ceremony at Dashashwamedh Ghat', location: 'Dashashwamedh Ghat', tip: 'Reach by 5:30 PM for a front-row spot. Or watch from a boat on the river.' },
        dinner: { restaurant: 'Dosa Café (Assi Ghat)', mustTry: 'South Indian Thali with Banarasi Paan', estCost: '₹300' },
        hotel: 'Zostel Varanasi / BrijRama Palace',
        estimatedDayCost: '₹3,500'
      },
      {
        dayNumber: 2,
        title: 'Sarnath & Silk Heritage',
        date: 'Day 2',
        morning: { activity: 'Day trip to Sarnath — where Buddha gave his first sermon', location: 'Sarnath, 10 km from Varanasi', tip: 'The Sarnath Museum has the original Ashoka Lion Capital — India\'s national emblem.' },
        breakfast: { restaurant: 'Brown Bread Bakery', mustTry: 'Fresh baked croissant with masala chai', estCost: '₹200' },
        afternoon: { activity: 'Visit a Banarasi silk weaving workshop', location: 'Silk weaving village, Sarai Mohana', tip: 'A real silk saree takes 15-45 days to weave. Buy directly from weavers for fair prices.' },
        lunch: { restaurant: 'Pizzeria Vaatika Café', mustTry: 'Wood-fired pizza with Ganga view', estCost: '₹400' },
        evening: { activity: 'Walk through Assi Ghat area, explore campus of BHU', location: 'Assi Ghat & BHU Campus', tip: 'BHU\'s Vishwanath Temple campus is peaceful and less crowded than the city one.' },
        dinner: { restaurant: 'Baati Chokha', mustTry: 'Traditional Banarasi Thali with Litti Chokha', estCost: '₹350' },
        hotel: 'Departure',
        estimatedDayCost: '₹4,500'
      }
    ]
  }
}

export default defaultItineraries
