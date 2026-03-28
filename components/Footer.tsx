import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy dark:bg-navy text-gray-300 py-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
          <div className="col-span-2 md:col-span-1 space-y-2">
            <div className="bg-white rounded-md p-2 inline-block">
              <img 
                src="/logo.jpg" 
                alt="Trinity Engineering" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-xs leading-relaxed text-gray-400">
              Engineering detectives using science to determine root causes of property damage.
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold mb-2 text-xs uppercase tracking-wider">
              Services
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link className="hover:text-accent transition-colors" href="/services/structural">
                  Structural Investigations
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent transition-colors" href="/services/storm-damage">
                  Storm Damage
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent transition-colors" href="/services/water-loss">
                  Water Loss
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent transition-colors" href="/services/fortified">
                  FORTIFIED Roof
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-2 text-xs uppercase tracking-wider">
              Company
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link className="hover:text-accent transition-colors" href="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent transition-colors" href="/careers">
                  Careers
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent transition-colors" href="/case-studies">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link className="hover:text-accent transition-colors" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-2 text-xs uppercase tracking-wider">
              Contact
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="material-icons text-accent text-xs">phone</span>
                <a href="tel:+18559295888" className="hover:text-accent transition-colors">
                  (855) 929-5888
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-icons text-accent text-xs">email</span>
                <a href="mailto:claims@trinitypllc.com" className="hover:text-accent transition-colors">
                  claims@trinitypllc.com
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-icons text-accent text-xs">email</span>
                <a href="mailto:fortified@trinitypllc.com" className="hover:text-accent transition-colors">
                  fortified@trinitypllc.com
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-icons text-accent text-xs">schedule</span>
                <span>24/7 Emergency Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] text-gray-500">
          <p>
            © Trinitypllc.com 2022 All rights Reserved.
          </p>
          <div className="flex gap-4">
            <a className="hover:text-accent transition-colors" href="/privacy">
              Privacy Policy
            </a>
            <a className="hover:text-accent transition-colors" href="/terms">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
