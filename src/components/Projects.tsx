import { motion } from "framer-motion";
import { ExternalLink, Github, Smartphone, Globe } from "lucide-react";

const projects = [
  {
    title: "CloudPaie",
    description: "Application incontournable de gestion de paie et des Ressources Humaines",
    image: "/cloudpaie.jpg",
    tags: ["Asp.net", "C#", "MySQL" ],
    type: "web",
    github: "#",
    live: "#",
    color: "primary",
  },
  {
    title: "CHK HÉBERGEMENT",
    description: "Application web de location de hébergement et de location de voiture.",
    image: "/placeholder.svg",
    tags: ["Asp.net", "C#", "SQLSERVER", "API rest","Bootstrap"],
    type: "web",
    github: "#",
    live: "#",
    color: "secondary",
  },
  {
    title: "CHK SCHOOL",
    description: "Application web de gestion scolaire pour les établissements éducatifs, offrant des fonctionnalités complètes pour la gestion des étudiants, des enseignants et des cours.",
    image: "/placeholder.svg",
    tags: ["Asp.net", "C#", "SQLSERVER", "API rest","Bootstrap"],
    type: "web",
    github: "#",
    live: "#",
    color: "accent",
  },
  {
    title: "CHK CONGE",
    description: "Application web de gestion des congés pour les entreprises, permettant aux employés de soumettre des demandes de congé et aux gestionnaires de les approuver ou de les rejeter.",
    image: "/placeholder.svg",
    tags: ["Asp.net", "C#", "SQLSERVER", "API rest","Bootstrap"],
    type: "web",
    github: "#",
    live: "#",
    color: "primary",
  },
];

export const Projects = () => {
  return (
    <section id="projects" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(300_100%_60%_/_0.05)_0%,_transparent_60%)]" />
      
      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-mono text-secondary mb-2">{"<projects>"}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Mes <span className="text-gradient">Projets</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une sélection de projets qui démontrent ma capacité à créer des solutions digitales innovantes.
          </p>
        </motion.div>


        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative card-glass rounded-xl overflow-hidden border border-border hover-glow"
            >
              {/* Project image */}
              <div className="relative h-48 overflow-hidden bg-muted">
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{ 
                    background: project.color === 'secondary' 
                      ? 'linear-gradient(135deg, hsl(300 100% 60% / 0.3), transparent)'
                      : project.color === 'accent'
                      ? 'linear-gradient(135deg, hsl(150 100% 50% / 0.3), transparent)'
                      : 'linear-gradient(135deg, hsl(180 100% 50% / 0.3), transparent)'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  {project.type === 'mobile' ? (
                    <Smartphone className="w-16 h-16 text-muted-foreground/50" />
                  ) : (
                    <Globe className="w-16 h-16 text-muted-foreground/50" />
                  )}
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a 
                    href={project.github}
                    className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="View code"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a 
                    href={project.live}
                    className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="View live"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-mono rounded ${
                    project.type === 'mobile' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'
                  }`}>
                    {project.type === 'mobile' ? 'Mobile' : 'Web'}
                  </span>
                </div>

                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-xs font-mono px-2 py-1 rounded bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a 
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:border-primary hover:text-primary transition-all duration-300 font-semibold"
          >
            Voir plus de projets
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

        <p className="font-mono text-secondary text-center mt-12">{"</projects>"}</p>
      </div>
    </section>
  );
};
