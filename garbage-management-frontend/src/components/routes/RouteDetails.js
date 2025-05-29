import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import routeService from "../../services/routeService";
import { toast } from "react-toastify";

const RouteDetails = ({ isAdminView = false }) => {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, hasRole } = useAuth();

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const routeData = await routeService.getRoute(id);
        setRoute(routeData);

        // Directly use bin objects from the route data
        if (routeData.binIds && routeData.binIds.length > 0) {
          setBins(routeData.binIds);
        }

        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch route details");
        console.error(err);
        setLoading(false);
      }
    };

    fetchRoute();
  }, [id]);

  const updateRouteStatus = async (status) => {
    try {
      const updatedRoute = await routeService.updateRouteStatus(
        id,
        { status },
        user.token
      );
      setRoute(updatedRoute);
      toast.success(`Route status updated to ${status}`);
    } catch (err) {
      toast.error("Failed to update route status");
      console.error(err);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Route not found</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to={isAdminView ? "/admin/routes" : "/admin/routes"}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          &larr; Back to routes
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Route Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Information about this collection route
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Route ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{route._id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(route.date).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Driver</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {route.driverId?.username || "Unassigned"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                    route.status
                  )}`}
                >
                  {route.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Estimated Duration
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {route.estimatedDuration
                  ? `${route.estimatedDuration} minutes`
                  : "Not specified"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Distance</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {route.distance ? `${route.distance} km` : "Not specified"}
              </dd>
            </div>
          </div>
        </div>

        {hasRole("driver") && route.status !== "completed" && (
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            {route.status === "pending" && (
              <button
                onClick={() => updateRouteStatus("in-progress")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Route
              </button>
            )}
            {route.status === "in-progress" && (
              <button
                onClick={() => updateRouteStatus("completed")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Complete Route
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Bins in this route ({bins.length})
        </h3>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Type
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {bins.map((bin) => (
                <tr key={bin._id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {bin._id.slice(-6)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {bin.location?.coordinates?.[1]?.toFixed(4)},{" "}
                    {bin.location?.coordinates?.[0]?.toFixed(4)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bin.status === "full" || bin.status === "overflow"
                          ? "bg-red-100 text-red-800"
                          : bin.status === "half-full"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {bin.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {bin.type || "N/A"}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link
                      to={`/bins/${bin._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View<span className="sr-only">, {bin._id}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RouteDetails;
