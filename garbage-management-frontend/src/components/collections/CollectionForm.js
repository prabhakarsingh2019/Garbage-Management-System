import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import collectionService from "../../services/collectionService";
import binService from "../../services/binService";
import { toast } from "react-toastify";

const CollectionForm = () => {
  const [formData, setFormData] = useState({
    binId: "",
    notes: "",
    statusBeforeCollection: "",
  });
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const history = useNavigate();

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const data = await binService.getAllBins();
        setBins(data.filter((bin) => bin.status !== "empty"));
      } catch (err) {
        toast.error("Failed to fetch bins");
        console.error(err);
      }
    };

    fetchBins();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await collectionService.createCollection(
        {
          binId: formData.binId,
          notes: formData.notes,
          statusBeforeCollection: formData.statusBeforeCollection,
        },
        token
      );
      toast.success("Collection recorded successfully");
      history("/collections");
    } catch (err) {
      toast.error("Failed to record collection");
      console.error(err);
      setLoading(false);
    }
  };

  const getBinStatus = (binId) => {
    const bin = bins.find((b) => b._id === binId);
    return bin ? bin.status : "";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Record Collection
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="binId"
              className="block text-sm font-medium text-gray-700"
            >
              Select Bin
            </label>
            <select
              id="binId"
              name="binId"
              required
              value={formData.binId}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select a bin</option>
              {bins.map((bin) => (
                <option key={bin._id} value={bin._id}>
                  Bin #{bin._id.slice(-6)} - {bin.zone} (Current: {bin.status})
                </option>
              ))}
            </select>
          </div>

          {formData.binId && (
            <div>
              <label
                htmlFor="statusBeforeCollection"
                className="block text-sm font-medium text-gray-700"
              >
                Bin Status Before Collection
              </label>
              <select
                id="statusBeforeCollection"
                name="statusBeforeCollection"
                required
                value={formData.statusBeforeCollection}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select status</option>
                <option value="empty">empty</option>
                <option value="half-full">Half Full</option>
                <option value="full">Full</option>
                <option value="overflow">Overflow</option>
                <option value="maintenance">Needs Maintenance</option>
              </select>
            </div>
          )}

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => history.push("/collections")}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Recording..." : "Record Collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectionForm;
