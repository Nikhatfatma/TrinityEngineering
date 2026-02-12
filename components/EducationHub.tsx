export default function EducationHub() {
  const resources = [
    {
      type: "Webinar",
      title: "Advanced Roof System Failure Analysis",
      description: "Learn to identify wind vs. hail damage patterns in modern roofing systems",
      duration: "45 min",
      icon: "play_circle",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    },
    {
      type: "Technical Guide",
      title: "Foundation Settlement: Field Investigation Best Practices",
      description: "Comprehensive guide to differential settlement evaluation and reporting",
      duration: "12 pages",
      icon: "menu_book",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
    },
    {
      type: "Case Study",
      title: "Hurricane Michael: Large Loss Investigation",
      description: "Multi-discipline forensic analysis of catastrophic wind damage",
      duration: "8 min read",
      icon: "article",
      image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&q=80",
    },
  ];

  const certifications = [
    { name: "PE License Training", icon: "workspace_premium" },
    { name: "FORTIFIED Evaluator", icon: "verified" },
    { name: "Expert Witness Prep", icon: "gavel" },
    { name: "Report Writing", icon: "edit_document" },
  ];

  return (
    <section className="py-24 bg-white dark:bg-background-dark" id="education">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent px-4 py-2 rounded-full mb-6">
              <span className="material-symbols-outlined text-sm">school</span>
              <span className="font-bold text-xs uppercase tracking-wider">
                Education & Training
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Industry-Leading Education Hub
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Access our library of technical resources, webinars, and training programs designed for insurance adjusters, attorneys, and engineering professionals.
            </p>
            
            {/* Certifications */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-section-light dark:bg-section-dark rounded-lg border border-gray-200 dark:border-gray-800"
                >
                  <span className="material-symbols-outlined text-2xl text-primary dark:text-accent">
                    {cert.icon}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {cert.name}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="/education"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white px-6 py-3 rounded-lg font-bold transition-all"
            >
              Explore All Resources
              <span className="material-icons text-sm">arrow_forward</span>
            </a>
          </div>

          <div className="space-y-6">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="group flex gap-6 p-6 bg-section-light dark:bg-section-dark rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-accent transition-all cursor-pointer"
              >
                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary dark:text-accent text-xl">
                      {resource.icon}
                    </span>
                    <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider">
                      {resource.type}
                    </span>
                    <span className="text-xs text-gray-500">• {resource.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {resource.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
