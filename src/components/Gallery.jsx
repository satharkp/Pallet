import { motion } from "framer-motion";
import { useState } from "react";

const items = [
  {
    title: "The Sanctuary Bed",
    image: "/assets/bed-finished.png",
    category: "Bedroom"
  },
  {
    title: "Urban Loft Sofa",
    image: "/assets/sofa-finished.png",
    category: "Living Room"
  }
];

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleInteraction = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="gallery" className="py-24 bg-premium-gray px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <span className="text-wood-rich font-medium tracking-widest uppercase text-xs">Curated Collections</span>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-charcoal mt-2">Designed for <span className="font-semibold">living.</span></h2>
          </div>
          <p className="text-charcoal/60 max-w-sm font-body">
            Each piece is custom-built to fit your space and style, ensuring a perfect match for your home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative h-[400px] md:h-[600px] overflow-hidden rounded-2xl cursor-pointer"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => handleInteraction(index)}
            >
              <motion.img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover"
                animate={{ scale: activeIndex === index ? 1.1 : 1 }}
                transition={{ duration: 0.7 }}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent flex flex-col justify-end p-10"
                animate={{ opacity: activeIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-white/60 text-sm mb-2">{item.category}</span>
                <h3 className="text-3xl font-heading text-white font-medium">{item.title}</h3>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
