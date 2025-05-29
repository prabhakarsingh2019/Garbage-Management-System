import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import binService from "../../services/binService";
import { toast } from "react-toastify";

const BinList = () => {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, token, hasRole } = useAuth();

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const data = await binService.getAllBins(token);
        setBins(data);
      } catch (err) {
        toast.error("Failed to fetch bins");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBins();
  }, [token]);

  const filteredBins = bins.filter((bin) => {
    const term = searchTerm.toLowerCase();
    return (
      bin.zone?.toLowerCase().includes(term) ||
      bin.status?.toLowerCase().includes(term) ||
      bin.type?.toLowerCase().includes(term)
    );
  });

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
          <h1 className="text-xl font-semibold text-gray-900">Garbage Bins</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all garbage bins in the system with their current status.
          </p>
        </div>
        {hasRole("admin") && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/admin/bins/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add new bin
            </Link>
          </div>
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search bins by zone, status, or type..."
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
                ID
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Zone
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Last Collected
              </th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredBins.length > 0 ? (
              filteredBins.map((bin) => (
                <tr key={bin._id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {bin._id?.slice(-6)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {bin.zone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        bin.status
                      )}`}
                    >
                      {bin.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {bin.type}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {bin.lastCollectedAt
                      ? new Date(bin.lastCollectedAt).toLocaleString()
                      : "Never"}
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
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-sm text-gray-500"
                >
                  No bins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BinList;
