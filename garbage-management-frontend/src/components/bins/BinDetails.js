import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import binService from "../../services/binService";
import collectionService from "../../services/collectionService";
import { toast } from "react-toastify";

const BinDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // renamed from history
  const { user, hasRole, token } = useAuth();
  const [bin, setBin] = useState(null);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const binData = await binService.getBin(id);
        setBin(binData);

        const collectionsData = await collectionService.getAllCollections(
          token
        );
        setCollections(collectionsData);

        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch bin details");
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this bin?")) {
      try {
        await binService.deleteBin(id, token);
        toast.success("Bin deleted successfully");
        navigate("/bins"); // fixed from history.push
      } catch (err) {
        toast.error("Failed to delete bin");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!bin) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Bin not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to="/bins"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          &larr; Back to bins
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Bin Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Information about this garbage bin
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Bin ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{bin._id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Zone</dt>
              <dd className="mt-1 text-sm text-gray-900">{bin.zone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    bin.status
                  )}`}
                >
                  {bin.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">
                {bin.type}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Capacity</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {bin.capacity} liters
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Current Level
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {bin.currentLevel}%
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {bin.location?.coordinates?.length === 2
                  ? `${bin.location.coordinates[1].toFixed(
                      6
                    )}, ${bin.location.coordinates[0].toFixed(6)}`
                  : "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Last Collected
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {bin.lastCollectedAt
                  ? new Date(bin.lastCollectedAt).toLocaleString()
                  : "Never"}
              </dd>
            </div>
          </div>
        </div>
        {hasRole?.("admin") && (
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <Link
              to={`/bins/${bin._id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Collection History
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Records of when this bin was collected
          </p>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {collections.length > 0 ? (
              collections.map((collection) => (
                <li key={collection._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        Collection #{collection._id.slice(-6)}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {new Date(
                            collection.collectedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Collected by:{" "}
                          {collection.driverId?.username || "Unknown"}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Status before: {collection.statusBeforeCollection}
                        </p>
                      </div>
                    </div>
                    {collection.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Notes: {collection.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 text-center text-gray-500">
                No collection records found
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BinDetails;
