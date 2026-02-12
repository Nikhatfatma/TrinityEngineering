export default function Careers() {
  const benefits = [
    {
      icon: "payments",
      title: "Competitive Compensation",
      description: "Industry-leading salary and performance bonuses",
    },
    {
      icon: "trending_up",
      title: "Professional Growth",
      description: "Continuing education and PE license support",
    },
    {
      icon: "health_and_safety",
      title: "Comprehensive Benefits",
      description: "Health, dental, vision, and 401(k) matching",
    },
    {
      icon: "schedule",
      title: "Work-Life Balance",
      description: "Flexible scheduling and remote work options",
    },
  ];

  const positions = [
    {
      title: "Senior Forensic Engineer",
      type: "Full-Time",
      location: "Multiple Locations",
      icon: "engineering",
    },
    {
      title: "Structural Engineer (PE Required)",
      type: "Full-Time",
      location: "Remote/Hybrid",
      icon: "architecture",
    },
    {
      title: "Field Inspector",
      type: "Full-Time",
      location: "Regional",
      icon: "search",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-background-dark" id="careers">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent px-4 py-2 rounded-full mb-6">
              <span className="material-symbols-outlined text-sm">work</span>
              <span className="font-bold text-xs uppercase tracking-wider">
                Join Our Team
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Build Your Career in Forensic Engineering
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Join a team of elite forensic engineers working on challenging investigations nationwide. 
              We invest in our people with competitive compensation, professional development, and a culture of technical excellence.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="p-4 bg-section-light dark:bg-section-dark rounded-lg border border-gray-200 dark:border-gray-800"
                >
                  <span className="material-symbols-outlined text-2xl text-primary dark:text-accent mb-2 block">
                    {benefit.icon}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="/careers"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white px-6 py-3 rounded-lg font-bold transition-all"
            >
              View All Positions
              <span className="material-icons text-sm">arrow_forward</span>
            </a>
          </div>

          {/* Right Content - Open Positions */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Current Openings
            </h3>
            {positions.map((position, index) => (
              <div
                key={index}
                className="group p-6 bg-section-light dark:bg-section-dark rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-accent transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary dark:text-accent text-2xl">
                        {position.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                        {position.title}
                      </h4>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-sm">schedule</span>
                          {position.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-sm">location_on</span>
                          {position.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="material-icons text-gray-400 group-hover:text-primary dark:group-hover:text-accent group-hover:translate-x-1 transition-all">
                    arrow_forward
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
