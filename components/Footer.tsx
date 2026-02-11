export default function Footer() {
  return (
    <footer className="bg-background-dark text-gray-500 py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          <div className="space-y-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                <span className="text-background-dark font-extrabold text-xl italic">
                  T
                </span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                TRINITY<span className="text-primary">ENGINEERING</span>
              </span>
            </div>
            <p className="text-base leading-relaxed text-gray-400 font-light">
              The global standard for forensic engineering. Meticulous
              investigation, evidence-based analysis, and absolute structural
              clarity.
            </p>
            <div className="flex gap-6">
              <a
                className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all text-gray-400"
                href="#"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
              <a
                className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all text-gray-400"
                href="#"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold mb-10 uppercase tracking-[0.2em] text-xs">
              Capabilities
            </h5>
            <ul className="space-y-6 text-sm font-medium">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Residential Forensics
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Commercial Performance
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Litigation Advisory
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Advanced Roof Systems
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-10 uppercase tracking-[0.2em] text-xs">
              Corporate
            </h5>
            <ul className="space-y-6 text-sm font-medium">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Our Philosophy
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Technical Board
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#careers">
                  Careers
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Contact Central
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-10 uppercase tracking-[0.2em] text-xs">
              Accreditations
            </h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center p-3 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 hover:border-primary/30 transition-all cursor-default">
                <span className="text-[10px] font-black text-white">NSPE</span>
              </div>
              <div className="h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center p-3 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 hover:border-primary/30 transition-all cursor-default">
                <span className="text-[10px] font-black text-white">ASCE</span>
              </div>
              <div className="h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center p-3 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 hover:border-primary/30 transition-all cursor-default">
                <span className="text-[10px] font-black text-white">NACE</span>
              </div>
              <div className="h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center p-3 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 hover:border-primary/30 transition-all cursor-default">
                <span className="text-[10px] font-black text-white">IIHS</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 text-[11px] uppercase tracking-[0.3em] font-black text-white/30">
          <p>
            ©️ 2024 Trinity Engineering Group, LLC. Professional Excellence
            Guaranteed.
          </p>
          <div className="flex gap-12">
            <a className="hover:text-white transition-colors" href="#">
              Privacy Protocol
            </a>
            <a className="hover:text-white transition-colors" href="#">
              Service Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
