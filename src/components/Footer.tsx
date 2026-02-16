import { Github, Linkedin, Twitter, Heart } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <a href="#" className="text-xl font-bold">
            <span className="text-primary">&lt;</span>
            <span className="text-foreground">MH</span>
            <span className="text-primary">/&gt;</span>
          </a>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Fait avec <Heart className="w-4 h-4 text-destructive fill-destructive" /> 
            {" "}par Mouhamed Houngbo © {currentYear}
          </p>

          {/* Social links */}
          <div className="flex gap-4">
            {[
              { icon: Github, href: "#", label: "GitHub" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Twitter, href: "#", label: "Twitter" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
              
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};