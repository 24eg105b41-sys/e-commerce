import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Truck, BookOpen, HeartHandshake } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800 text-slate-300">
          <div className="flex items-center gap-3">
            <Truck className="text-campus-400 flex-shrink-0" size={24} />
            <div>
              <h4 className="text-sm font-semibold text-white">Hostel Delivery</h4>
              <p className="text-xs text-slate-400">Direct delivery to dorm rooms & labs</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="text-campus-400 flex-shrink-0" size={24} />
            <div>
              <h4 className="text-sm font-semibold text-white">Verified Textbooks</h4>
              <p className="text-xs text-slate-400">Prescribed AU-R24 CSE syllabus editions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-campus-400 flex-shrink-0" size={24} />
            <div>
              <h4 className="text-sm font-semibold text-white">Student Pricing</h4>
              <p className="text-xs text-slate-400">Subsidized hardware & campus discounts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <HeartHandshake className="text-campus-400 flex-shrink-0" size={24} />
            <div>
              <h4 className="text-sm font-semibold text-white">7-Day Exchanges</h4>
              <p className="text-xs text-slate-400">Library Desk physical return support</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-campus-600 flex items-center justify-center text-white">
                <GraduationCap size={18} />
              </div>
              <span className="text-base font-bold text-white">ShopSphere Campus</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full-Stack E-Commerce Platform engineered specifically for university students, faculty, and campus life.
            </p>
            <div className="mt-4 text-[11px] text-slate-500">
              AU-R24 Full Stack Development Using Java Capstone
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Campus Catalog</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/catalog?category=laptops-computers" className="hover:text-white transition-colors">Engineering Laptops</Link></li>
              <li><Link to="/catalog?category=computer-accessories" className="hover:text-white transition-colors">Keyboards & Mice</Link></li>
              <li><Link to="/catalog?category=engineering-books" className="hover:text-white transition-colors">Course Textbooks</Link></li>
              <li><Link to="/catalog?category=headphones-audio" className="hover:text-white transition-colors">Study Headphones</Link></li>
              <li><Link to="/catalog?category=smart-campus-devices" className="hover:text-white transition-colors">Calculators & Power Banks</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Customer Service</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/my-orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
              <li><Link to="/compare" className="hover:text-white transition-colors">Product Comparison</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-white transition-colors">AI Shopping Assistant</Link></li>
              <li><span className="text-slate-500">Hostel Desk: Room 204 Library</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Educational Demo Notice</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              This platform demonstrates full-stack software architecture with Spring Boot 3, React 18, MySQL, and JWT stateless authentication.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
              All payment transactions are simulated for academic viva evaluation.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 ShopSphere Campus. Developed by B.Tech CSE Students.</p>
          <p className="text-slate-400 font-medium">AU-R24 Capstone • Java & React Full Stack</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
