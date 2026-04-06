import { Link } from 'react-router-dom'

export default function NomadFooter({ extraClass = '' }) {
  return (
    <footer
      className={`w-full py-12 px-8 bg-[#fdf9f3] border-t border-[#00257b]/5 ${extraClass}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <span className="font-['Noto_Serif'] italic text-2xl text-[#3456c1]">
            NOMAD
          </span>
          <p className="font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-widest text-[#00257b]/60">
            © 2026 NOMAD. Celebrating Indian Heritage through AI.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 justify-center">
          <Link
            className="font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-widest text-[#00257b]/60 hover:text-[#3456c1] transition-colors"
            to="/"
          >
            About Us
          </Link>
          <Link
            className="font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-widest text-[#00257b]/60 hover:text-[#3456c1] transition-colors"
            to="/itinerary"
          >
            Heritage Sites
          </Link>
          <a
            className="font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-widest text-[#00257b]/60 hover:text-[#3456c1] transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-widest text-[#00257b]/60 hover:text-[#3456c1] transition-colors"
            href="#"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
