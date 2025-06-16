
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
    { name: 'Blog', href: '/blog', isRoute: true },
  ];

  // Function to navigate to AI workspace page when workspace button is clicked
  const handleWorkspaceClick = () => {
    navigate('/workspace');
  };

  // Function to navigate to admin panel when admin button is clicked
  const handleAdminClick = () => {
    navigate('/admin');
  };

  // Function to handle navigation between sections and routes
  const handleNavigation = (href: string, isRoute?: boolean) => {
    if (isRoute) {
      navigate(href);
    } else if (href.startsWith('#')) {
      // If we're not on the home page, navigate there first
      if (window.location.pathname !== '/') {
        navigate('/');
        // Wait for navigation to complete before scrolling
        setTimeout(() => {
          const element = document.querySelector(href);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        // If we're on the home page, just scroll
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  // Function to navigate to home page when logo is clicked
  const handleLogoClick = () => {
    navigate('/');
  };

  // Function to toggle mobile menu when hamburger button is clicked
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 cursor-pointer" onClick={handleLogoClick}>
            <h1 className="text-xl font-bold text-gradient">MySuite</h1>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href, item.isRoute)}
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-background"
              onClick={handleWorkspaceClick}
            >
              AI Workspace
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleAdminClick}
            >
              Admin
            </Button>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-foreground hover:text-primary"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden glass-effect">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href, item.isRoute)}
                className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                {item.name}
              </button>
            ))}
            <div className="pt-2 space-y-2">
              <Button 
                variant="outline" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-background"
                onClick={handleWorkspaceClick}
              >
                AI Workspace
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={handleAdminClick}
              >
                Admin
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
