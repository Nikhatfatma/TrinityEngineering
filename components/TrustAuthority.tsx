export default function TrustAuthority() {
  const credentials = [
    { name: "NSPE", description: "National Society of Professional Engineers" },
    { name: "ASCE", description: "American Society of Civil Engineers" },
    { name: "NAFE", description: "National Academy of Forensic Engineers" },
    { name: "FORTIFIED", description: "Certified Evaluators" },
  ];

  const testimonials = [
    {
      quote: "Trinity Engineering provided the most thorough and defensible report we've ever received. Their expert testimony was instrumental in resolving our case.",
      author: "Sarah Mitchell",
      title: "Senior Claims Adjuster, National Insurance Group",
      rating: 5,
    },
    {
      quote: "The level of technical detail and clarity in their structural analysis reports is unmatched. They've become our go-to forensic engineering firm.",
      author: "Michael Chen, Esq.",
      title: "Partner, Chen & Associates Law Firm",
      rating: 5,
    },
    {
      quote: "Fast response, professional service, and expert analysis. Trinity Engineering has helped us resolve complex large loss claims efficiently.",
      author: "Jennifer Rodriguez",
      title: "Director of Claims, Coastal Property Insurance",
      rating: 5,
    },
  ];

  const stats = [
    { value: "10,000+", label: "Investigations Completed" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "25+", label: "Years Experience" },
    { value: "50", label: "States Covered" },
  ];

  return (
    <section className="py-24 bg-section-light dark:bg-section-dark" id="trust">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent px-4 py-2 rounded-full mb-6">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span className="font-bold text-xs uppercase tracking-wider">
              Trust & Credentials
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            Industry-Recognized Expertise
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Licensed professional engineers with decades of combined experience and the highest industry certifications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white dark:bg-background-dark rounded-lg border-2 border-gray-200 dark:border-gray-800"
            >
              <div className="text-4xl font-black text-primary dark:text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Credentials */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Professional Certifications & Memberships
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {credentials.map((cred, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-8 bg-white dark:bg-background-dark rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-accent transition-all group"
              >
                <div className="text-4xl font-black text-primary dark:text-accent mb-3 group-hover:scale-110 transition-transform">
                  {cred.name}
                </div>
                <div className="text-xs text-center text-gray-600 dark:text-gray-400 font-medium">
                  {cred.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            What Our Clients Say
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-background-dark rounded-lg border-2 border-gray-200 dark:border-gray-800"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="material-icons text-yellow-500 text-lg">
                      star
                    </span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
