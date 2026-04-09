import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Origins", href: "#about" },
    { name: "Gallery", href: "#gallery" },
    { name: "Process", href: "#process" },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 backdrop-blur-md bg-white/30 border-b border-white/20"
      >
        <div className="flex items-center gap-3">
          <img src="/assets/logo.jpeg" alt="Woodnest Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-wood-rich/20" onError={(e) => { e.target.onerror = null; e.target.src = '/assets/logo.jpeg' }} />
          <span className="text-lg md:text-xl font-heading font-bold tracking-tight text-charcoal">WOOD<span className="text-accent-green">NEST</span></span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-charcoal/70 hover:text-wood-rich transition-colors">
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block bg-charcoal text-white px-5 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium hover:bg-accent-green transition-all transform hover:scale-105 active:scale-95">
            Get a Quote
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-charcoal hover:text-accent-green transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden bg-white pt-24 px-8"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-4xl font-heading font-light text-charcoal hover:text-accent-green transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-8 border-t border-charcoal/5">
                <button className="w-full bg-charcoal text-white py-4 rounded-xl text-lg font-medium">
                  Get a Quote
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
