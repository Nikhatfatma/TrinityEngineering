export default function Hero() {
  return (
    <header className="relative h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          alt="Engineer examining a structural site with cinematic lighting"
          className="w-full h-full object-cover grayscale brightness-75 contrast-125"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRtuksymkLtx__r84njg_kdgsiB8rhyvpybb8qgtNo8KmyNS0DHznOKZjdF_eYbq7ykmBqS23KB2HoSATzhQNm5D9ZI70XK5qER-w-9azv7QRgJQyrXXzDHy7X0hM-BE2tlf-PA_gjCId3lvnuASUkOjInFrvMeqP44YT2W1WbA8BqGaZC4LyoAc2RQsfOqZRf4ruy8IpgWypjBQdhXsf5cVe06ZhVH5G-FIGPwdPMKi--Xkr-ejj-Lk986-mxZmFI6mlKXaUbSH1W"
        />
        <div className="absolute inset-0 hero-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 w-full">
        <div className="max-w-3xl">
          <span className="inline-block py-1 px-3 bg-primary/10 text-primary border border-primary/30 rounded font-bold text-xs uppercase tracking-[0.3em] mb-8">
            Premium Forensic Intelligence
          </span>
          <h1 className="text-7xl lg:text-8xl font-extrabold text-white leading-[0.95] mb-8 tracking-tighter">
            Engineering <br />
            <span className="text-primary italic">Detectives</span>
            <br />
            Uncovering Truth.
          </h1>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-xl font-light">
            Meticulous investigation meet technical excellence. We provide
            high-resolution clarity for the world&apos;s most complex structural
            failures.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <a
              className="bg-primary hover:bg-primary-dark text-background-dark px-10 py-5 rounded-lg font-bold text-lg transition-all shadow-[0_0_30px_rgba(0,242,255,0.4)] text-center"
              href="#request"
            >
              Submit Investigation
            </a>
            <a
              className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-lg font-bold text-lg transition-all text-center"
              href="#services"
            >
              Our Capabilities
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 flex flex-col items-start text-white/40">
        <div className="h-1 w-24 bg-primary/30 mb-4"></div>
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold">
          Editorial Issue 2024.01
        </span>
      </div>
    </header>
  );
}
