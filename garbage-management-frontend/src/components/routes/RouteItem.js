import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const RouteItem = ({ route, isAdminView = false, onStatusChange }) => {
  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800",
    };

    return statusClasses[status] || statusClasses.default;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusChange = (e) => {
    if (onStatusChange) {
      onStatusChange(route._id, e.target.value);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            Route #{route._id?.slice(-6).toUpperCase() || "N/A"}
          </h3>
          <p className="text-sm text-gray-500 mt-1 truncate">
            <span className="font-semibold">Driver:</span>{" "}
            {route.driverId?.username || "Unassigned"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-semibold">Date:</span>{" "}
            {formatDate(route.date)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-semibold">Bins:</span>{" "}
            {Array.isArray(route.binIds) ? route.binIds.length : 0}
          </p>
        </div>

        <div className="flex flex-col items-end ml-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
              route.status
            )} mb-2`}
          >
            {route.status?.replace("-", " ") || "unknown"}
          </span>

          {onStatusChange && (
            <select
              value={route.status}
              onChange={handleStatusChange}
              className="mt-1 block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-between items-center">
        <div className="text-sm text-gray-500 space-x-4 mb-2 sm:mb-0">
          {route.estimatedDuration && (
            <span>
              <span className="font-semibold">Est. Duration:</span>{" "}
              {route.estimatedDuration} mins
            </span>
          )}
          {route.distance && (
            <span>
              <span className="font-semibold">Distance:</span>{" "}
              {route.distance.toFixed(2)} km
            </span>
          )}
        </div>

        <Link
          to={`${
            isAdminView ? `/admin/routes/${route._id}` : `/routes/${route._id}`
          }`}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-900 transition-colors"
        >
          View Details
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

RouteItem.propTypes = {
  route: PropTypes.shape({
    _id: PropTypes.string,
    driverId: PropTypes.shape({
      username: PropTypes.string,
    }),
    date: PropTypes.string,
    binIds: PropTypes.array,
    status: PropTypes.string,
    estimatedDuration: PropTypes.number,
    distance: PropTypes.number,
  }).isRequired,
  isAdminView: PropTypes.bool,
  onStatusChange: PropTypes.func,
};

export default RouteItem;
