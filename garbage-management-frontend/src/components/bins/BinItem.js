import React from "react";
import { Link } from "react-router-dom";

const BinItem = ({ bin }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "full":
      case "overflow":
        return "bg-red-100 text-red-800";
      case "half-full":
        return "bg-yellow-100 text-yellow-800";
      case "empty":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Bin #{bin._id.slice(-6)}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Zone: {bin.zone} | Type: {bin.type}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Last Collected:{" "}
            {bin.lastCollectedAt
              ? new Date(bin.lastCollectedAt).toLocaleString()
              : "Never"}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            bin.status
          )}`}
        >
          {bin.status}
        </span>
      </div>
      <div className="mt-4 flex justify-end">
        <Link
          to={`/bins/${bin._id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-900"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BinItem;
