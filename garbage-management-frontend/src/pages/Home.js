import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Home = () => {
  const { isAuthenticated, hasRole } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Garbage Management</span>
            <span className="block text-blue-600">System</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl md:mt-8 md:text-2xl">
            Efficient, reliable, and sustainable waste collection and disposal
            system designed to keep our cities clean and green. Our platform
            helps coordinate waste collection schedules, optimize routes for
            drivers, and provide real-time updates to ensure timely garbage
            pickup.
          </p>

          <p className="mt-4 text-gray-500 max-w-3xl mx-auto">
            By leveraging technology and data-driven insights, we empower
            municipalities, waste management companies, and drivers to reduce
            operational costs, minimize environmental impact, and enhance
            community health. Join us in building smarter cities with cleaner
            environments!
          </p>

          <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
            {!isAuthenticated ? (
              <>
                <div className="rounded-md shadow">
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get started
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Login
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-x-3">
                {hasRole("admin") && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {hasRole("driver") && (
                  <Link
                    to="/driver"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    Driver Dashboard
                  </Link>
                )}
                <Link
                  to="/bins"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  View Bins
                </Link>
              </div>
            )}
          </div>

          {/* Environmental Section */}
          <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                alt="Clean city park"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                Building a Greener Future Together
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Waste management is a vital part of maintaining a healthy
                environment. Proper garbage collection and disposal prevent
                pollution, reduce landfill overflow, and conserve natural
                resources.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our system encourages eco-friendly practices across cities.
                Cleaner cities mean healthier citizens and a sustainable planet
                for future generations.
              </p>
            </div>
          </div>

          {/* Community Section */}
          <div className="mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                Community Engagement & Awareness
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Residents can report overflowing bins, stay informed about
                schedules, and participate in clean-up drives.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Empower your neighborhood with knowledge and tools for cleaner,
                greener living.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1527766833261-b09c3163a791?auto=format&fit=crop&w=600&q=80"
                alt="Community cleaning event"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* New Section: Importance of Cleanliness */}
          <div className="mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="w-full h-80 md:h-full">
              <img
                src="https://i.pinimg.com/736x/2b/66/aa/2b66aab5ec51ac85348b9df904b47e6d.jpg"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                Why Cleanliness Matters
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Uncollected garbage attracts rodents, mosquitoes, and bacteria,
                becoming a breeding ground for infections and diseases. Poor
                waste disposal leads to contaminated water and air pollution,
                severely impacting health.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Diseases like **cholera, dengue, typhoid**, and **respiratory
                infections** are directly linked to unmanaged waste and poor
                sanitation. Maintaining clean surroundings is essential for
                preventing disease outbreaks and protecting family health.
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="mt-20 text-left text-gray-700 max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Why Choose Our Garbage Management System?
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Smart Scheduling:</strong> Automated collection
                schedules reduce missed pickups and improve efficiency.
              </li>
              <li>
                <strong>Route Optimization:</strong> Drivers receive the most
                efficient routes, saving fuel and time.
              </li>
              <li>
                <strong>Real-Time Tracking:</strong> Monitor garbage trucks and
                bins to quickly identify and address issues.
              </li>
              <li>
                <strong>Eco-Friendly:</strong> Reduces carbon footprint by
                minimizing unnecessary trips.
              </li>
              <li>
                <strong>Community Engagement:</strong> Residents can report
                issues, request pickups, and stay informed.
              </li>
              <li>
                <strong>Disease Prevention:</strong> Timely garbage disposal
                limits the spread of illness and improves public health.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
