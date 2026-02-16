import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";

const titles = [
  "Développeur Full Stack",
  "Expert ASP.NET DOTNET",
  "Créateur d'Applications Web",
  "Développeur Web et Mobile Passionné",
  
];

export const Hero = () => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTitle = titles[titleIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentTitle.length) {
          setDisplayText(currentTitle.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % titles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, titleIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(180_100%_50%_/_0.1)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(300_100%_60%_/_0.1)_0%,_transparent_50%)]" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(hsl(180 100% 50% / 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(180 100% 50% / 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Code comment */}
          <motion.p 
            className="font-mono text-muted-foreground mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {"// Bienvenue dans mon univers digital"}
          </motion.p>

          {/* Name */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="text-foreground">Mouhamed </span>
            <span className="text-gradient">HOUNGBO</span>
          </motion.h1>

          {/* Typing effect */}
          <div className="h-12 md:h-16 flex items-center justify-center mb-8">
            <span className="text-xl md:text-3xl font-mono text-primary">
              {displayText}
              <span className="terminal-cursor" />
            </span>
          </div>

          {/* Description */}
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Je transforme des idées en expériences digitales exceptionnelles.
            <br />
            <span className="text-primary">3+ ans</span> d'expertise en développement web et mobile.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <a 
              href="#projects"
              className="px-8 py-4 rounded-lg font-semibold text-primary-foreground glow-primary transition-all duration-300 hover:scale-105"
              style={{ background: 'var(--gradient-primary)' }}
            >
              Voir mes projets
            </a>
            <a 
              href="#contact"
              className="px-8 py-4 rounded-lg font-semibold border-gradient hover-glow transition-all duration-300 hover:scale-105"
            >
              Me contacter
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div 
            className="flex gap-6 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[
              { icon: Github, href: "#", label: "GitHub" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Mail, href: "#contact", label: "Email" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="p-3 rounded-full border border-border hover:border-primary hover:text-primary transition-all duration-300 hover:glow-primary"
                aria-label={social.label}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-8 h-8 text-primary opacity-60" />
      </motion.div>
    </section>
  );
};
