import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";

export const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted:", formState);
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(180_100%_50%_/_0.08)_0%,_transparent_60%)]" />
      
      
      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-mono text-primary mb-2">{"<contact>"}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Travaillons <span className="text-gradient">Ensemble</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vous avez un projet en tête ? N'hésitez pas à me contacter pour en discuter.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Restons connectés</h3>
              <p className="text-muted-foreground mb-8">
                Je suis toujours ouvert aux nouvelles opportunités et collaborations. 
                Que ce soit pour un projet freelance ou une opportunité à temps plein, 
                je serais ravi d'en discuter.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: "mouhamedhoungbo@gmail.com" },
                { icon: Phone, label: "Téléphone", value: "+225 05 76 44 82 37" },
                { icon: MapPin, label: "Localisation", value: "Abidjan, Cote d'Ivoire" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 p-4 card-glass rounded-lg border border-border hover-glow cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-semibold">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-4 pt-4">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Twitter, href: "#", label: "Twitter" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-3 rounded-full border border-border hover:border-primary hover:text-primary transition-all duration-300 hover:glow-primary"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="card-glass rounded-xl p-8 border border-border"
          >
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                  placeholder="Votre nom"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono resize-none"
                  placeholder="Décrivez votre projet..."
                  required
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-lg font-semibold text-primary-foreground flex items-center justify-center gap-2 glow-primary transition-all duration-300"
                style={{ background: 'var(--gradient-primary)' }}
              >
                Envoyer le message
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.form>
        </div>

        <p className="font-mono text-primary text-center mt-16">{"</contact>"}</p>
      </div>
    </section>
  );
};