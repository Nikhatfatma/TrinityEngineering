export default function TechnicalJournal() {
  const articles = [
    {
      category: "Structural Engineering",
      title: "The Mechanics of Roof Failure in High-Velocity Zones",
      description:
        "A deep dive into dynamic pressure coefficients and catastrophic uplift mechanics in coastal construction.",
      readTime: "8 min read",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBn0VnrTTMHp5_BzcBpBI6mBYa7TySwoIDsh-gZGh-5woHphFqNIcM4eKeemorGJ5O__FYRN6DaXqnWsSoWmMWWhRBRjIeVZk4PCkCMQwg77IdeYWlquwLm4IcCu2duAtxvCVEZpv9jhKIIclZtdKbe_22ClptqPcvRAZd3gZMT4RfBbMz1D2SD7m4V0UakPYktBEMnnnZH69mQdCjqYnMTMcI1lbSQH3Ma13YsWNbm29U7i2oTZwcxm1R5-SUgyh-D7gpVSlUkHODa",
    },
    {
      category: "Geotechnical Guide",
      title: "Identifying Differential Settlement in Foundations",
      description:
        "Distinguishing between standard concrete shrinkage and active structural movement for insurance adjusters.",
      readTime: "12 min read",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAasCQXsOuNnJY_29f5mljQzqzE3n_eW3tOsFkEGXrN6WgQZVR1nn-wIp2wY73a8smLc3Oigd51GS3KY19DZloW9ByX44YEZAWFeN_8T_utxkH5vsVjtzBSNP9bAhi81L0HTkXECjuatOJRuOtsf0BWfPWIIW-zcJS2lNhOD1Fiv3ybjnuhjrT98I-oTssNi4uwoTQjQ_JcVflDiZ3qviRb2cTdx8hNRUmuwInl0THQRcDcbJyMOBuhajov6K6IujAJFXF03TS2MNTY",
    },
  ];

  return (
    <section className="py-32 bg-section-dark overflow-hidden" id="blog">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-stretch">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-16">
              <div>
                <h2 className="text-sm font-bold text-primary uppercase tracking-[0.4em] mb-4">
                  Technical Journal
                </h2>
                <h3 className="text-4xl font-extrabold text-white tracking-tight">
                  Latest Forensic Insights
                </h3>
              </div>
              <a
                className="text-xs font-bold text-primary flex items-center gap-2 border-b border-primary/20 pb-1 hover:border-primary transition-all"
                href="#"
              >
                VIEW JOURNAL{" "}
                <span className="material-icons text-sm">open_in_new</span>
              </a>
            </div>

            <div className="space-y-12">
              {articles.map((article, index) => (
                <div
                  key={index}
                  className="group flex flex-col sm:flex-row gap-10 items-center"
                >
                  <div className="w-full sm:w-64 h-44 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5 shadow-2xl">
                    <img
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700 brightness-75"
                      src={article.image}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 block">
                      {article.category}
                    </span>
                    <h4 className="text-2xl font-bold mb-4 text-white group-hover:text-primary transition-colors leading-tight">
                      {article.title}
                    </h4>
                    <p className="text-gray-400 leading-relaxed mb-4">
                      {article.description}
                    </p>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      {article.readTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-[450px] relative group overflow-hidden rounded-3xl border border-white/5 shadow-2xl">
            <img
              alt="Professional workshop"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.3] group-hover:scale-105 transition-transform duration-1000"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFNEwrRvOBn-yqDF_aSxrIIcFGdCvRdYyRVjDuPi7V1tHdymp5HMCzdriAiMkeXKaVF7-Visa57OyqfczLNcF_eToFHHdVA9q1kMPQ-xeGAZQyaJ3dGxzM-bI9jgDgxEtYA1TtpskuLiB8K3UUKulkKaspRA0kW6BlbxP_fa-FJEetduH_9NovP6PC7FXKlSNqSsOm6v1QNIZJcSUAQ1SQuN__zR5QyVnt9g1i9X8Z2BwlsIbxLKj08rqGZYEzSAWXAWYYxu2jitkU"
            />
            <div className="relative z-10 p-12 h-full flex flex-col justify-center">
              <h3 className="text-4xl font-extrabold mb-6 text-white leading-tight">
                Elite Coaching <br />
                &amp; Training
              </h3>
              <p className="text-gray-300 mb-12 leading-relaxed text-lg">
                Elevate your team&apos;s expertise with our specialized clinical
                coaching for adjusters, attorneys, and lead engineers.
              </p>
              <ul className="space-y-6 mb-12">
                <li className="flex items-center gap-4 text-sm font-semibold text-white">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    verified
                  </span>
                  Field Observation Mastery
                </li>
                <li className="flex items-center gap-4 text-sm font-semibold text-white">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    verified
                  </span>
                  Forensic Report Excellence
                </li>
                <li className="flex items-center gap-4 text-sm font-semibold text-white">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    verified
                  </span>
                  Litigation Support Strategy
                </li>
              </ul>
              <button className="w-full bg-primary hover:bg-primary-dark text-background-dark font-extrabold py-5 rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,242,255,0.3)] group/btn">
                REQUEST CURRICULUM{" "}
                <span className="material-icons group-hover/btn:translate-x-2 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
