import React, { useState } from 'react';
import { Search, Sparkles, Command, Menu, X, ArrowRight } from 'lucide-react';
import './Header.css';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="lookup-header">
      <div className="lookup-container">
        
        {/* Logo Section (LookUp AI) */}
        <div className="lookup-logo-section">
          <a href="#" className="lookup-logo">
            <div className="lookup-logo-icon-wrapper">
              <div className="lookup-logo-icon-inner">
                <Sparkles style={{ width: '16px', height: '16px' }} />
              </div>
            </div>
            <span className="lookup-logo-text">
              LookUp<span>.AI</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="lookup-nav-desktop">
            <a href="#features" className="lookup-nav-link">Features</a>
            <a href="#models" className="lookup-nav-link">Models</a>
            <a href="#docs" className="lookup-nav-link">Docs</a>
            <a href="#pricing" className="lookup-nav-link">Pricing</a>
          </nav>
        </div>

        {/* Command Search Shortcut & Action Buttons */}
        <div className="lookup-actions-desktop">
          {/* Quick Search Bar */}
          <div className="lookup-search-box">
            <Search className="lookup-search-icon" />
            <input
              type="text"
              placeholder="Search anything..."
              className="lookup-search-input"
            />
            <div className="lookup-kbd">
              <Command style={{ width: '12px', height: '12px' }} /> K
            </div>
          </div>

          {/* Action Buttons */}
          <a href="#login" className="lookup-login-btn">
            Log in
          </a>
          
          <a href="#get-started" className="lookup-primary-btn">
            Get Started
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="lookup-mobile-toggle-wrapper">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lookup-mobile-toggle-btn"
          >
            {isMobileMenuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lookup-mobile-drawer">
          <nav className="lookup-mobile-nav">
            <a href="#features" className="lookup-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#models" className="lookup-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
              Models
            </a>
            <a href="#docs" className="lookup-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
              Docs
            </a>
            <a href="#pricing" className="lookup-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
              Pricing
            </a>
            
            <hr className="lookup-mobile-divider" />
            
            <div className="lookup-mobile-actions">
              <a href="#login" className="lookup-mobile-login">
                Log in
              </a>
              <a href="#get-started" className="lookup-mobile-start">
                Get Started
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};