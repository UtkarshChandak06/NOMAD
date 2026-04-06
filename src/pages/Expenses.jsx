import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Icon from '../components/Icon'
import { useTrips } from '../lib/TripContext'

export default function Expenses() {
  const { expenses, addExpense, totalBudget, deleteExpense } = useTrips()
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food & Dining')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')

  const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
  const remaining = totalBudget - totalSpent
  const spentPercent = Math.min(100, Math.round((totalSpent / totalBudget) * 100))

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!amount || isNaN(amount)) return
    
    const iconMap = {
      'Food & Dining': 'restaurant',
      'Transport': 'commute',
      'Stay': 'hotel',
      'Heritage Shopping': 'shopping_bag'
    }

    addExpense({
      title: notes || category,
      category,
      amount: parseFloat(amount),
      date,
      icon: iconMap[category] || 'payments'
    })

    setAmount('')
    setNotes('')
  }

  return (
    <div className="bg-[#fdf9f3] min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-4 lg:p-12 transition-all">
        <header className="max-w-6xl mx-auto mb-16 pt-10">
            <h1 className="text-6xl font-['Noto_Serif'] font-black text-[#0033A0] tracking-tighter">Financial Ledger</h1>
            <p className="text-lg text-[#00257b]/40 font-medium mt-2 uppercase tracking-[0.3em] flex items-center gap-2">
                <Icon name="account_balance_wallet" className="text-sm" />
                Travel Budget Tracker
            </p>
        </header>

        <section className="max-w-6xl mx-auto space-y-12">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white rounded-[3rem] p-12 border border-[#00257b]/5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9933]/5 rounded-bl-[10rem] -mr-20 -mt-20 group-hover:bg-[#FF9933]/10 transition-colors" />
                    <div className="relative z-10 space-y-12">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00257b]/30 mb-2">Total Amount Disbursed</p>
                            <h3 className="text-7xl font-['Noto_Serif'] font-black text-[#0033A0]">₹{totalSpent.toLocaleString()}</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#0033A0]">Budget Depletion</span>
                                <span className="text-2xl font-black text-[#FF9933]">{spentPercent}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-[#00257b]/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#FF9933] transition-all duration-1000 ease-out" style={{ width: `${spentPercent}%` }} />
                            </div>
                            <p className="text-[10px] font-bold text-[#00257b]/40 uppercase tracking-widest text-right">
                                ₹{remaining.toLocaleString()} remaining of ₹{totalBudget.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0033A0] rounded-[3rem] p-12 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-[#0033A0]/30">
                    <div className="absolute bottom-0 right-0 opacity-10">
                        <Icon name="payments" className="text-9xl translate-x-12 translate-y-12" />
                    </div>
                    <Icon name="token" className="text-[#FF9933] text-5xl mb-8" filled />
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Diurnal Average</p>
                    <h3 className="text-4xl font-['Noto_Serif'] font-black mt-2">₹{(totalSpent / (expenses.length || 1)).toFixed(0)}</h3>
                    <p className="text-white/40 text-[10px] font-bold mt-6 leading-relaxed uppercase tracking-widest">
                        Consistent cadence for <br /> immersive travel.
                    </p>
                </div>
            </div>

            {/* Quick Log Form */}
            <div className="bg-white rounded-[3rem] p-12 border border-[#00257b]/5 shadow-sm">
                <header className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 bg-[#FF9933]/10 text-[#FF9933] rounded-2xl flex items-center justify-center">
                        <Icon name="add_shopping_cart" />
                    </div>
                    <h4 className="text-2xl font-['Noto_Serif'] font-black text-[#0033A0]">Disbursement Log</h4>
                </header>

                <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-4 gap-10 items-end">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00257b]/40">Amount (₹)</label>
                        <input
                            type="number"
                            className="w-full bg-[#fdf9f3] border-b-2 border-transparent focus:border-[#0033A0] py-4 px-2 text-2xl font-bold text-[#0033A0] outline-none transition-all placeholder:text-[#00257b]/10 rounded-t-xl"
                            placeholder="e.g. 1200"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00257b]/40">Category</label>
                        <select 
                            className="w-full bg-[#fdf9f3] border-b-2 border-transparent focus:border-[#0033A0] py-4 px-2 text-sm font-bold text-[#0033A0] outline-none transition-all rounded-t-xl appearance-none"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option>Food & Dining</option>
                            <option>Transport</option>
                            <option>Stay</option>
                            <option>Heritage Shopping</option>
                        </select>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00257b]/40">Chronicle Date</label>
                        <input
                            type="date"
                            className="w-full bg-[#fdf9f3] border-b-2 border-transparent focus:border-[#0033A0] py-4 px-2 text-sm font-bold text-[#0033A0] outline-none transition-all rounded-t-xl"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="bg-[#0033A0] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#0033A0]/10 hover:scale-105 active:scale-95 transition-all">
                        Validate Archive
                    </button>
                    <div className="md:col-span-4 space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00257b]/40">Detailed Context (Notes)</label>
                        <input
                            type="text"
                            className="w-full bg-[#fdf9f3] border-b-2 border-transparent focus:border-[#0033A0] py-4 px-4 text-sm font-bold text-[#0033A0] outline-none transition-all rounded-t-2xl placeholder:text-[#00257b]/20"
                            placeholder="e.g. Traditional Fine Dining at The Oberoi"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </form>
            </div>

            {/* Recent Archives */}
            <div className="space-y-8">
                <h4 className="text-2xl font-['Noto_Serif'] font-black text-[#0033A0] flex items-center justify-between">
                    Recent Logs
                    <span className="text-[10px] text-[#00257b]/30 font-bold uppercase tracking-widest">Chronological View</span>
                </h4>
                <div className="grid grid-cols-1 gap-4">
                    {expenses.map((log) => (
                        <div key={log.id} className="group bg-white rounded-[2rem] p-6 flex items-center justify-between border border-[#00257b]/5 hover:shadow-xl transition-all duration-500">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-[#fdf9f3] rounded-2xl flex items-center justify-center text-[#0033A0] group-hover:bg-[#0033A0] group-hover:text-white transition-all duration-500">
                                    <Icon name={log.icon || 'receipt'} className="text-2xl" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-[#0033A0] text-lg group-hover:text-[#FF9933] transition-colors">{log.title}</h5>
                                    <p className="text-[10px] font-bold text-[#00257b]/40 uppercase tracking-widest">{log.category} • {log.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-[#0033A0]">₹{log.amount.toLocaleString()}</p>
                                <button 
                                    onClick={() => deleteExpense(log.id)}
                                    className="text-[10px] font-black text-[#d00000]/40 uppercase tracking-tighter hover:text-[#d00000] opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    Evict Log
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <footer className="mt-32 py-12 text-center border-t border-[#00257b]/5">
             <p className="text-[#00257b]/10 text-[10px] font-black uppercase tracking-[0.6em]">NOMAD — AI Trip Planner</p>
        </footer>
      </main>
    </div>
  )
}
