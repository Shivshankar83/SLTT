import React from 'react';
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-8 pb-4 w-full mt-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company Section */}
          <div>
            <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-4">COMPANY</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">ABOUT SLTT</a></li>
              <li><a href="/contact" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">CONTACT US</a></li>
              <li><a href="/blog" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">CAREERS</a></li>
              <li><a href="blogs" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">BLOG / NEWS</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-4">Contact</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">CORPORATE</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">FRANCHISE</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">SUPPLIER</a></li>
            </ul>
          </div>

          {/* Explore Section */}
          <div>
            <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-4">EXPLORE</h3>
            <ul className="space-y-2">
              <li><a href="/user" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">BOOK A RIDE</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">ACTIVITIES</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">HOLIDAYS</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">STAYCATION</a></li>
            </ul>
          </div>

          {/* More Section */}
          <div>
            <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-4">MORE</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">LEGACY POLICY</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">LOCATE US</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">DATA PRIVACY POLICY</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">TERMS</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">LOCATION</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright and Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-4 md:mb-0 text-gray-700 dark:text-gray-400 text-sm">
            © 2025 by SLTT
          </div>
          <div className="flex space-x-3">
            <a href="#" className="bg-teal-100 dark:bg-teal-900 p-2 rounded-md text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors">
              <FacebookIcon size={18} />
            </a>
            <a href="#" className="bg-teal-100 dark:bg-teal-900 p-2 rounded-md text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors">
              <TwitterIcon size={18} />
            </a>
            <a href="#" className="bg-teal-100 dark:bg-teal-900 p-2 rounded-md text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors">
              <InstagramIcon size={18} />
            </a>
            <a href="#" className="bg-teal-100 dark:bg-teal-900 p-2 rounded-md text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors">
              <LinkedinIcon size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;