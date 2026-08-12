import { Brain } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features", external: false },
    { label: "Architecture", href: "#architecture", external: false },
    { label: "Documentation", href: "/docs", external: false },
  ],
  resources: [
    { label: "GitHub", href: "https://github.com", external: true },
    { label: "Docs", href: "/docs", external: false },
    { label: "Get Started", href: "/get-started", external: false },
  ],
  company: [
    { label: "About", href: "/about", external: false },
    { label: "Contact", href: "/contact", external: false },
  ],
};

const bottomLinks = [
  { label: "GitHub", href: "https://github.com", external: true },
  { label: "Documentation", href: "/docs" },
  { label: "Privacy", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/[0.08]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main content row */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-8">
          {/* Left side - Logo and tagline */}
          <div className="flex flex-col items-start lg:w-[280px] shrink-0">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-[0.4rem] bg-gradient-to-br from-indigo-500 to-purple-500">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">MemOS</span>
            </div>
            <p className="text-[14px] text-[#8892A0] leading-relaxed">
              Persistent memory for AI agents.
            </p>
          </div>

          {/* Right side - Navigation columns */}
          <div className="flex flex-wrap gap-8 lg:gap-12 w-full lg:w-auto">
            {/* Product column */}
            <nav aria-label="Product">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#555] mb-4">
                PRODUCT
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-[14px] text-[#8892A0] hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Resources column */}
            <nav aria-label="Resources">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#555] mb-4">
                RESOURCES
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-[14px] text-[#8892A0] hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Company column */}
            <nav aria-label="Company">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#555] mb-4">
                COMPANY
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[14px] text-[#8892A0] hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 lg:mt-16 pt-8 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-[#555]">
              © 2026 MemOS. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {bottomLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="text-[13px] text-[#555] hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}