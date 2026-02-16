import { motion } from "framer-motion";
import { MapPin, Briefcase, GraduationCap, Coffee } from "lucide-react";

const stats = [
  { value: "3+", label: "Années d'expérience" },
  { value: "20+", label: "Projets réalisés" },
  { value: "10+", label: "Clients satisfaits" },
  { value: "∞", label: "Lignes de code" },
];

export const About = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_hsl(150_100%_50%_/_0.05)_0%,_transparent_60%)]" />
      
      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-mono text-accent mb-2">{"<about>"}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            À <span className="text-gradient">Propos</span>
            
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Code block style */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-glass rounded-xl p-6 border border-border"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="ml-2 font-mono text-sm text-muted-foreground">about.tsx</span>
            </div>
            
            <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
              <code>
                <span className="text-secondary">const</span>{" "}
                <span className="text-accent">developer</span> = {`{`}
                {"\n"}  <span className="text-muted-foreground">name:</span>{" "}
                <span className="text-primary">"Mouhamed HOUNGBO"</span>,
                {"\n"}  <span className="text-muted-foreground">role:</span>{" "}
                <span className="text-primary">"Full Stack Developer"</span>,
                {"\n"}  <span className="text-muted-foreground">location:</span>{" "}
                <span className="text-primary">"Abidjan, Cote d'Ivoire"</span>,
                {"\n"}  <span className="text-muted-foreground">passion:</span>{" "}
                <span className="text-primary">"Créer des expériences digitales"</span>,
                {"\n"}  <span className="text-muted-foreground">coffee:</span>{" "}
                <span className="text-secondary">true</span>,
                {"\n"}  <span className="text-muted-foreground">available:</span>{" "}
                <span className="text-secondary">true</span>,
                {"\n"}{`}`};
              </code>
            </pre>
          </motion.div>

          {/* Right side - Description */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              Passionné par le développement depuis plus de <span className="text-primary font-semibold">3 ans</span>, 
              je crée des applications web et mobiles qui allient performance, 
              design moderne et expérience utilisateur exceptionnelle.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Mon approche ? Transformer des idées complexes en solutions élégantes 
              et intuitives. Chaque projet est une opportunité de repousser les limites 
              du possible.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: MapPin, text: "Abidjan, Cote d'Ivoire" },
                { icon: Briefcase, text: "Freelance & CDI" },
                { icon: GraduationCap, text: "Licence Informatique" },
                { icon: Coffee, text: "Powered by tea" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 card-glass rounded-xl border border-border hover-glow"
            >
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <p className="font-mono text-accent text-center mt-12">{"</about>"}</p>
      </div>
    </section>
  );
};