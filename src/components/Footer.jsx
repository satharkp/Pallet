export default function Footer() {
  return (
    <footer className="bg-charcoal text-white py-20 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <img src="/assets/logo.jpeg" alt="Woodnest Logo" className="w-10 h-10 rounded-full object-cover border-2 border-white/10" onError={(e) => { e.target.onerror = null; e.target.src = '/assets/logo.png' }} />
            <span className="text-xl font-heading font-bold tracking-tight text-white">WOOD<span className="text-accent-green">NEST</span></span>
          </div>
          <p className="text-white/50 max-w-sm mb-8 font-body">
            Crafting sustainable furniture from reclaimed industrial materials. 
            Join the movement towards a more conscious home.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-wood-rich transition-colors">In</a>
            <a href="https://www.instagram.com/woodnest.in?igsh=b3VqMDYwM2R0eTlo" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-wood-rich transition-colors">Ig</a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-wood-rich transition-colors">Tw</a>
          </div>
        </div>
        
        <div>
          <h4 className="font-heading font-medium mb-6">Explore</h4>
          <ul className="flex flex-col gap-4 text-white/40 text-sm font-body">
            <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Custom Orders</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Locations</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-medium mb-6">Contact</h4>
          <ul className="flex flex-col gap-4 text-white/40 text-sm font-body">
            <li>hello@woodnest.com</li>
            <li>+91 8921825652</li>
            <li>Delivery Across Kerala <br />
              📍 Kochi</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between text-white/20 text-xs font-body uppercase tracking-widest">
        <p>© 2026 WOODNEST. All rights reserved.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
