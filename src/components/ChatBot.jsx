import { useState, useRef, useEffect } from 'react'
import Icon from './Icon'
import { chatWithNomad } from '../lib/ai'
import { useTrips } from '../lib/TripContext'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am Nomad, your AI travel companion. Need help planning or packing?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  
  const { trips } = useTrips()

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    // Build context snippet about user's trips
    const latestTrip = trips[0]
    let systemContext = `You are Nomad, a friendly AI travel assistant for India. Keep answers short and practical. Respond in plain text, no markdown.`
    if (latestTrip && latestTrip.region) {
      systemContext += `\nThe user recently planned a trip to: ${latestTrip.region}.`
    }

    try {
      const payloadMessages = [...messages.filter(m => m.role !== 'system'), { role: 'user', content: userMsg }].slice(-6)
      
      const response = await chatWithNomad({
        system: systemContext,
        messages: payloadMessages,
        temperature: 0.7,
        max_tokens: 500
      })

      setMessages(prev => [...prev, { role: 'assistant', content: response.message }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Oops! I am having trouble connecting right now.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-[#FF9933] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : 'block'}`}
      >
        <Icon name="chat" className="text-2xl" filled />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] bg-white rounded-[2rem] shadow-2xl border border-[#0033A0]/10 flex flex-col z-50 overflow-hidden font-['Inter'] animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#0033A0] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="explore" className="text-[18px]" />
              </div>
              <div>
                <h4 className="font-bold font-['Noto_Serif'] leading-tight">Nomad AI</h4>
                <p className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <Icon name="close" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 bg-[#fdf9f3] space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-[#FF9933] text-white rounded-br-sm' : 'bg-white border border-[#0033A0]/10 text-[#001a4d] rounded-bl-sm shadow-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-white border border-[#0033A0]/10 text-[#001a4d] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                   <div className="w-2 h-2 bg-[#0033A0]/40 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-[#0033A0]/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                   <div className="w-2 h-2 bg-[#0033A0]/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#0033A0]/5 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-[#f4f0e8] rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#0033A0]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-[#0033A0] text-white flex items-center justify-center disabled:opacity-50 hover:bg-[#00257b] transition-colors"
            >
              <Icon name="send" className="text-[18px]" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
