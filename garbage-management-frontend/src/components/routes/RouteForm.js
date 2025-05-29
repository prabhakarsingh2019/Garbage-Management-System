import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import routeService from "../../services/routeService";
import userService from "../../services/userService";
import binService from "../../services/binService";
import { toast } from "react-toastify";

const RouteForm = () => {
  const { id } = useParams();
  const history = useNavigate();
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    driverId: "",
    date: new Date().toISOString().split("T")[0],
    binIds: [],
    estimatedDuration: "",
    distance: "",
  });
  const [drivers, setDrivers] = useState([]);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch drivers
        const driversData = await userService.getAllUsers(token);
        setDrivers(driversData.filter((u) => u.role === "driver"));

        // Fetch bins
        const binsData = await binService.getAllBins();
        setBins(binsData);

        if (id) {
          setIsEditMode(true);
          const routeData = await routeService.getRoute(id, token);
          setFormData({
            driverId: routeData.driverId?._id || "",
            date: new Date(routeData.date).toISOString().split("T")[0],
            binIds: routeData.binIds?.map((b) => b._id) || [],
            estimatedDuration: routeData.estimatedDuration || "",
            distance: routeData.distance || "",
          });
        }
      } catch (err) {
        toast.error("Failed to fetch data");
        console.error(err);
      }
    };

    fetchData();
  }, [id, user.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBinSelection = (binId) => {
    setFormData((prev) => {
      if (prev.binIds.includes(binId)) {
        return { ...prev, binIds: prev.binIds.filter((id) => id !== binId) };
      } else {
        return { ...prev, binIds: [...prev.binIds, binId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const routeData = {
        driverId: formData.driverId,
        date: formData.date,
        binIds: formData.binIds,
        estimatedDuration: formData.estimatedDuration
          ? parseInt(formData.estimatedDuration)
          : undefined,
        distance: formData.distance ? parseFloat(formData.distance) : undefined,
      };

      if (isEditMode) {
        await routeService.updateRoute(id, routeData, token);
        toast.success("Route updated successfully");
      } else {
        await routeService.createRoute(routeData, token);
        toast.success("Route created successfully");
      }
      history(isEditMode ? `/routes/${id}` : "/admin/routes");
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? "Edit Route" : "Create New Route"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="driverId"
                className="block text-sm font-medium text-gray-700"
              >
                Driver
              </label>
              <select
                id="driverId"
                name="driverId"
                required
                value={formData.driverId}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select a driver</option>
                {drivers.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.username} ({driver.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Collection Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="estimatedDuration"
                className="block text-sm font-medium text-gray-700"
              >
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                name="estimatedDuration"
                id="estimatedDuration"
                min="1"
                value={formData.estimatedDuration}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="distance"
                className="block text-sm font-medium text-gray-700"
              >
                Distance (km)
              </label>
              <input
                type="number"
                step="0.1"
                name="distance"
                id="distance"
                min="0.1"
                value={formData.distance}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Bins for this Route
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {bins.map((bin) => (
                  <div key={bin._id} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={`bin-${bin._id}`}
                        name={`bin-${bin._id}`}
                        type="checkbox"
                        checked={formData.binIds.includes(bin._id)}
                        onChange={() => handleBinSelection(bin._id)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor={`bin-${bin._id}`}
                        className="font-medium text-gray-700"
                      >
                        Bin #{bin._id.slice(-6)} - {bin.zone}
                      </label>
                      <p className="text-gray-500">
                        {bin.location.coordinates[1].toFixed(4)},{" "}
                        {bin.location.coordinates[0].toFixed(4)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() =>
                history.push(isEditMode ? `/routes/${id}` : "/admin/routes")
              }
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : isEditMode ? (
                "Update Route"
              ) : (
                "Create Route"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RouteForm;
