export default function Hero() {
  return (
    <header className="relative h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:bg-background-dark">
      <div className="absolute inset-0 z-0">
        <img
          alt="Engineer examining a structural site with cinematic lighting"
          className="w-full h-full object-cover brightness-100 dark:brightness-75 contrast-110 dark:contrast-125 opacity-40 dark:opacity-100"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRtuksymkLtx__r84njg_kdgsiB8rhyvpybb8qgtNo8KmyNS0DHznOKZjdF_eYbq7ykmBqS23KB2HoSATzhQNm5D9ZI70XK5qER-w-9azv7QRgJQyrXXzDHy7X0hM-BE2tlf-PA_gjCId3lvnuASUkOjInFrvMeqP44YT2W1WbA8BqGaZC4LyoAc2RQsfOqZRf4ruy8IpgWypjBQdhXsf5cVe06ZhVH5G-FIGPwdPMKi--Xkr-ejj-Lk986-mxZmFI6mlKXaUbSH1W"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-white/90 to-blue-50/70 dark:from-background-dark dark:via-background-dark/90 dark:to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 w-full">
        <div className="max-w-3xl">
          <span className="inline-block py-2 px-4 bg-gradient-to-r from-primary/10 to-blue-500/10 dark:bg-primary/10 text-primary border border-primary/30 rounded-full font-bold text-xs uppercase tracking-[0.3em] mb-8 shadow-sm">
            Premium Forensic Intelligence
          </span>
          <h1 className="text-7xl lg:text-8xl font-extrabold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-white dark:to-white bg-clip-text text-transparent leading-[0.95] mb-8 tracking-tighter">
            Engineering <br />
            <span className="bg-gradient-to-r from-primary via-cyan-500 to-blue-500 dark:from-primary dark:via-primary dark:to-primary bg-clip-text text-transparent italic">Detectives</span>
            <br />
            Uncovering Truth.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-xl font-medium">
            Meticulous investigation meet technical excellence. We provide
            high-resolution clarity for the world&apos;s most complex structural
            failures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              className="bg-gradient-to-r from-primary to-cyan-400 hover:from-cyan-400 hover:to-primary dark:from-primary dark:to-primary-dark text-background-dark px-10 py-5 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:shadow-primary/50 text-center group"
              href="#request"
            >
              <span className="flex items-center justify-center gap-2">
                Submit Investigation
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </span>
            </a>
            <a
              className="bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-white/20 px-10 py-5 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg text-center"
              href="#services"
            >
              Our Capabilities
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 flex flex-col items-start text-gray-500 dark:text-white/40">
        <div className="h-1 w-24 bg-gradient-to-r from-primary to-blue-500 dark:from-primary dark:to-primary/30 mb-4 rounded-full"></div>
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold">
          Editorial Issue 2024.01
        </span>
      </div>
    </header>
  );
}
