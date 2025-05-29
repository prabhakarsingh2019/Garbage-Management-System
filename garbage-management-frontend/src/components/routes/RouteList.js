import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import routeService from "../../services/routeService";
import { toast } from "react-toastify";

const RouteList = ({ isAdminView = false }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await routeService.getAllRoutes();
        setRoutes(data);
      } catch (err) {
        toast.error("Failed to fetch routes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRoutes = routes.filter((route) => {
    const term = searchTerm.toLowerCase();
    const driver = route.driverId?.username?.toLowerCase() || "";
    const date = new Date(route.date).toLocaleDateString().toLowerCase();
    return (
      driver.includes(term) ||
      route.status.toLowerCase().includes(term) ||
      date.includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-4">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Routes List</h2>
          <p className="mt-2 text-sm text-gray-700">
            Overview of all garbage collection routes and their current status.
          </p>
        </div>
        {isAdminView && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/admin/routes/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Add new route
            </Link>
          </div>
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by driver, status, or date..."
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Route ID
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Driver
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Estimated Duration
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Distance (km)
              </th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((route) => (
                <tr key={route._id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {route._id.slice(-6)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(route.date).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    {route.driverId?.username || "Unassigned"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                        route.status
                      )}`}
                    >
                      {route.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {route.estimatedDuration
                      ? `${route.estimatedDuration} min`
                      : "N/A"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {route.distance ? route.distance.toFixed(2) : "N/A"}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link
                      to={
                        isAdminView
                          ? `/admin/routes/${route._id}`
                          : `/routes/${route._id}`
                      }
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View<span className="sr-only">, {route._id}</span>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-sm text-gray-500"
                >
                  No routes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteList;
