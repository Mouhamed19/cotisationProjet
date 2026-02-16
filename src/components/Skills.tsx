import { motion } from "framer-motion";
import { Code2, Smartphone, Database, Cloud, Palette, Terminal } from "lucide-react";

const skillCategories = [
  {
    icon: Database,
    title: "Backend",
    skills: [
      { name: "C# ", level: 88 },
      { name: "VB.NET", level: 82 },
      { name: "PostgreSQL", level: 85 },
      { name: "ASP.NET", level: 80 },
      { name: "SQL Server", level: 80 },
      { name: "MySQL", level: 80 },
    ],
  },
  {
    icon: Code2,
    title: "Frontend",
    skills: [
      { name: "Razor", level: 85 },
      { name: "HTML", level: 95 },
      { name: "Tailwind CSS", level: 75 },
      { name: "JavaScript/Bootstrap", level: 80 },
    ],
  },
  {
    icon: Smartphone,
    title: "Mobile",
    skills: [
      { name: "Flutter", level: 75 },
    ],
  },
  // {
  //   icon: Cloud,
  //   title: "Cloud & DevOps",
  //   skills: [
  //     { name: "AWS", level: 78 },
  //     { name: "Docker", level: 85 },
  //     { name: "CI/CD", level: 82 },
  //     { name: "Kubernetes", level: 70 },
  //   ],
  // },
];

const technologies = [
  "Jira", "Git", "IIS", "Postman", "Navicat",
  "React", "Node.js",  
  "PostgreSQL","ASP.NET Core", "REST API",
   "Firebase", "Git", "Figma",
  "C#", "VB.NET", "ASP.NET MVC", "SQL Server", "MySQL", "PostgreSQL", "HFSQL", "UML"];

export const Skills = () => {
  return (
    <section id="skills" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(180_100%_50%_/_0.05)_0%,_transparent_60%)]" />
      
      <div className="container px-6 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-mono text-primary mb-2">{"<skills>"}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Mes <span className="text-gradient">Compétences</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Un arsenal technologique moderne pour créer des applications performantes et élégantes.
          </p>
        </motion.div>

        {/* Skill categories grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="card-glass rounded-xl p-6 border border-border hover-glow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">{category.title}</h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, index) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-mono text-sm">{skill.name}</span>
                      <span className="text-primary text-sm font-semibold">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <motion.div
                        className="skill-bar-fill"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technologies cloud */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-xl font-bold mb-6">Technologies</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className="px-4 py-2 rounded-full border border-border bg-muted/50 font-mono text-sm hover:border-primary hover:text-primary transition-all duration-300 cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <p className="font-mono text-primary text-center mt-12">{"</skills>"}</p>
      </div>
    </section>
  );
};