import { Link } from 'wouter';

export default function SacredNavBar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-[#f8f7f4]/90 shadow-md backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-white text-xl">💗</span>
            </div>
            <span className="font-serif text-xl text-[#2f5d5d] font-bold">The Genuine Love Project</span>
          </div>
        </Link>
        <div className="space-x-6 hidden md:flex text-[#333] font-sans">
          <Link href="/tools">
            <span className="hover:text-[#2f5d5d] cursor-pointer transition-colors" data-testid="nav-wellness-tools">
              Wellness Tools
            </span>
          </Link>
          <a 
            href="#testimonials" 
            className="hover:text-[#2f5d5d] transition-colors"
            data-testid="nav-testimonials"
          >
            Testimonials
          </a>
          <a href="/login" className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer" data-testid="nav-get-started">
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
