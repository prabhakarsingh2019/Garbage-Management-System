import React from "react";
import { Link } from "react-router-dom";

const CollectionItem = ({ collection }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Collection #{collection._id.slice(-6)}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Collected by: {collection.driverId?.username || "Unknown"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Bin: {collection.binId?.zone || "Unknown"} (Status:{" "}
            {collection.statusBeforeCollection})
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Collected at: {new Date(collection.collectedAt).toLocaleString()}
          </p>
          {collection.notes && (
            <p className="text-sm text-gray-500 mt-1">
              Notes: {collection.notes}
            </p>
          )}
        </div>
        <Link
          to={`/bins/${collection.binId?._id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-900"
        >
          View Bin
        </Link>
      </div>
    </div>
  );
};

export default CollectionItem;
