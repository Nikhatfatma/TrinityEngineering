export default function Careers() {
  return (
    <section className="py-24 bg-background-dark" id="careers">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[3rem] border border-white/10 p-1 md:p-2 bg-gradient-to-br from-white/10 to-transparent">
          <div className="bg-section-dark rounded-[2.8rem] px-8 py-20 md:px-20 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-extrabold mb-8 text-white tracking-tight leading-[1.1]">
                Join the Trinity Elite Engineering Team
              </h2>
              <p className="text-gray-400 text-xl leading-relaxed font-light">
                We recruit the finest minds in structural forensics. Elevate your
                career with premium compensation and a culture of radical technical
                excellence.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 items-center w-full lg:w-auto">
              <div className="space-y-4 w-full sm:w-auto">
                <div className="flex items-center gap-4 px-8 py-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    payments
                  </span>
                  <span className="font-bold text-white tracking-wide">
                    Premium Pay
                  </span>
                </div>
                <div className="flex items-center gap-4 px-8 py-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    insights
                  </span>
                  <span className="font-bold text-white tracking-wide">
                    Elite Growth
                  </span>
                </div>
              </div>
              <a
                className="bg-white text-background-dark px-12 py-6 rounded-2xl font-black text-lg hover:bg-primary transition-all shadow-xl w-full sm:w-auto text-center"
                href="#"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
