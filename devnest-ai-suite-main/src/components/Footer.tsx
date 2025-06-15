import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/Hamza1610', icon: '🐙' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammad-hamza-7239b9237', icon: '💼' },
    { name: 'X', href: 'https://twitter.com/Muhamma90584326', icon: '🐦' },
    { name: 'Email', href: 'mailto:hamza.00dev1@gmail.com', icon: '📧' },
  ];

  return (
    <footer className="glass-effect border-t border-primary/20 mt-12 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl md:text-2xl font-bold text-gradient mb-4">Muhammad Hamza</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-md">
              Full Stack Developer passionate about creating innovative web applications 
              and exploring the latest in AI technology. Always learning, always building.
            </p>
            <div className="flex gap-3 md:gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 md:w-10 md:h-10 glass-effect rounded-full flex items-center justify-center hover:glow-effect transition-all duration-300"
                  title={link.name}
                >
                  <span className="text-base md:text-lg">{link.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base md:text-lg font-semibold text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base md:text-lg font-semibold text-primary mb-4">Get In Touch</h4>
            <div className="space-y-3 text-sm md:text-base text-muted-foreground">
              <div>
                <p className="text-xs md:text-sm">Email</p>
                <a 
                  href="mailto:hamza.00dev1@gmail.com"
                  className="hover:text-primary transition-colors duration-200 break-all"
                >
                  hamza.00dev1@gmail.com
                </a>
              </div>
              <div>
                <p className="text-xs md:text-sm">Location</p>
                <p>Kaduna, Nigeria</p>
              </div>
              <div>
                <p className="text-xs md:text-sm">Phone</p>
                <p>+2349026880099</p>
              </div>
              <div>
                <p className="text-xs md:text-sm">Status</p>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-xs md:text-sm">Available for projects</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary/20 pt-6 md:pt-8 mt-6 md:mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} built by Muhammad Hamza using React, Next.js, and Tailwind CSS.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors duration-200">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
