import { motion } from "framer-motion";
import { TreePine, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    icon: <TreePine className="w-6 h-6" />,
    title: "Eco-Conscious",
    description: "Reclaimed wood sourced from certified industrial streams, reducing waste and carbon footprint."
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Military Grade",
    description: "Built to endure. Our pallets are heat-treated and reinforced for maximum weight capacity."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Modular Design",
    description: "From bed frames to terrace bars. Our pieces adapt to your evolving lifestyle effortlessly."
  }
];

export default function Features() {
  return (
    <section id="about" className="py-24 bg-white px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="w-12 h-12 bg-wood-light flex items-center justify-center rounded-xl text-wood-rich">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-heading font-medium text-charcoal">{feature.title}</h3>
              <p className="font-body text-charcoal/60 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
