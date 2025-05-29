import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1 text-center xl:text-left">
            <h3 className="text-white text-xl font-bold">
              Garbage Management System
            </h3>
            <p className="text-gray-300 text-base">
              Efficient waste collection and management for smart cities.
            </p>
          </div>

          <div className="mt-12 xl:mt-0 xl:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="px-4 sm:px-0">
                <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 text-center md:text-left">
                  Navigation
                </h4>
                <ul className="space-y-3 text-center md:text-left">
                  <li>
                    <a href="/" className="text-gray-300 hover:text-white">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/bins" className="text-gray-300 hover:text-white">
                      Bins
                    </a>
                  </li>
                </ul>
              </div>

              <div className="px-4 sm:px-0">
                <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 text-center md:text-left">
                  Support
                </h4>
                <ul className="space-y-3 text-center md:text-left">
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-gray-400 text-base text-center">
            &copy; {new Date().getFullYear()} Garbage Management System. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
