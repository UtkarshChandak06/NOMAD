import { createContext, useContext, useEffect, useState } from 'react'

const TripContext = createContext(undefined)

const DEFAULT_TRIP = {
  id: 'jaipur-standard',
  title: 'The Pink City: A 3-Day Cultural Odyssey',
  region: 'Rajasthan',
  duration: '3 Days',
  style: 'Cultural',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEDKLkhpQu9hOk2elRPRW5TpggtrKHDGAYYQJpUBmohSl-Z1ZzPpu3YZRRGGQrS44oUWrCTM5sor5_qLovPITgIaL87G8T6V9xFP5lrAqT86yfPN3Z7BvPguq0RbfbniNCMdsng4xFCTbbpD9ju0wHlR1CAnUZJkHmO2DXJxsLtEropFeAJUA2bb3QiM3YS7QC8WURuaofbpUuP07ryqg3DXSNKtFNDpzjB8r0WdYqzNzGcGwrvRPjfQifygb77V3y3ZN-2al7OSA',
  itinerary: {
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
  days: [
    {
      day: '01',
      title: 'Arrival & Jaipur City Palace',
      route: 'Delhi-Jaipur Drive, City Palace Museum, Jantar Mantar',
      food: 'Laal Maas, Dal Baati',
      cost: 'Est. ₹4,500',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEDKLkhpQu9hOk2elRPRW5TpggtrKHDGAYYQJpUBmohSl-Z1ZzPpu3YZRRGGQrS44oUWrCTM5sor5_qLovPITgIaL87G8T6V9xFP5lrAqT86yfPN3Z7BvPguq0RbfbniNCMdsng4xFCTbbpD9ju0wHlR1CAnUZJkHmO2DXJxsLtEropFeAJUA2bb3QiM3YS7QC8WURuaofbpUuP07ryqg3DXSNKtFNDpzjB8r0WdYqzNzGcGwrvRPjfQifygb77V3y3ZN-2al7OSA',
    },
    {
      day: '02',
      title: 'Amber Fort & Hawa Mahal',
      route: 'Amber Fort (Elephant/Jeep Ride), Panna Meena ka Kund, Hawa Mahal',
      food: 'Ghevar, Pyaz Kachori',
      cost: 'Est. ₹3,200',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV9XkNtyruWDjgEYEdin8BJaZ_9VooPXwuULhZDKCGKspchn0y9q6hLovmR3FoI48emWaKJFa4pQ0nUbiNdGkbmdtk9t15sCpXOawknMX-k4Q5c8wYjeWUs8RDK1bkEE83fthJyMVFTY9RWCQszLOOO7IXGsYCbVjTjXu5WV5q64no5pLTlr9y64ydfD30fepolzwDxnoYfj3OILOhg3TFu4QrGg9qTnXdTP2ADzLKsPUGqlA9lcGPahs4g_ARq_4YiQqsp4uu3vE',
    }
  ]
}

export function TripProvider({ children }) {
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('nomad_trips')
    return saved ? JSON.parse(saved) : [DEFAULT_TRIP]
  })

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('nomad_expenses')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return parsed.map(e => ({ ...e, amount: Number(e.amount || 0) }))
      } catch {
        return []
      }
    }
    return [
      { id: '1', title: 'Street Food in Old Delhi', category: 'Food', amount: 500, date: new Date().toISOString(), icon: 'restaurant' },
      { id: '2', title: 'Heritage Haveli Stay', category: 'Stay', amount: 8500, date: new Date().toISOString(), icon: 'hotel' }
    ]
  })

  const [totalBudget, setTotalBudget] = useState(60000)

  useEffect(() => {
    localStorage.setItem('nomad_trips', JSON.stringify(trips))
  }, [trips])

  useEffect(() => {
    localStorage.setItem('nomad_expenses', JSON.stringify(expenses))
  }, [expenses])

  const addTrip = (trip) => {
    setTrips((prev) => [trip, ...prev])
  }

  const removeTrip = (id) => {
    setTrips((prev) => prev.filter(t => t.id !== id))
  }

  const addExpense = (expense) => {
    setExpenses((prev) => [{ ...expense, id: crypto.randomUUID(), amount: Number(expense.amount || 0) }, ...prev])
  }

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter(e => e.id !== id))
  }

  return (
    <TripContext.Provider value={{
      trips,
      expenses,
      totalBudget,
      addTrip,
      removeTrip,
      addExpense,
      deleteExpense,
      setTotalBudget
    }}>
      {children}
    </TripContext.Provider>
  )
}

export function useTrips() {
  const context = useContext(TripContext)
  if (!context) throw new Error('useTrips must be used within a TripProvider')
  return context
}
