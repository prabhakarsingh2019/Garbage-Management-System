import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import binService from "../../services/binService";
import { toast } from "react-toastify";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const LocationPicker = ({ position, onChange }) => {
  useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const BinForm = () => {
  const { id } = useParams();
  const history = useNavigate();
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    longitude: "",
    latitude: "",
    zone: "",
    capacity: "",
    type: "general",
    status: "empty",
  });
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchBin = async () => {
        try {
          const bin = await binService.getBin(id);
          const lng = bin.location.coordinates[0];
          const lat = bin.location.coordinates[1];
          setFormData({
            longitude: lng,
            latitude: lat,
            zone: bin.zone,
            capacity: bin.capacity,
            type: bin.type,
            status: bin.status,
          });
          setMarkerPosition([lat, lng]);
        } catch (err) {
          toast.error("Failed to fetch bin details");
          console.error(err);
        }
      };
      fetchBin();
    }
  }, [id]);

  // Sync marker if user edits longitude/latitude manually
  useEffect(() => {
    const lng = parseFloat(formData.longitude);
    const lat = parseFloat(formData.latitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setMarkerPosition([lat, lng]);
    }
  }, [formData.longitude, formData.latitude]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMapClick = (latlng) => {
    setMarkerPosition([latlng.lat, latlng.lng]);
    setFormData({
      ...formData,
      longitude: latlng.lng,
      latitude: latlng.lat,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const longitude = parseFloat(formData.longitude);
    const latitude = parseFloat(formData.latitude);
    const capacity = parseInt(formData.capacity);

    // Validation: check all required and numeric
    if (
      isNaN(longitude) ||
      isNaN(latitude) ||
      formData.zone.trim() === "" ||
      isNaN(capacity) ||
      capacity <= 0
    ) {
      toast.error("Please enter valid location, zone, and capacity");
      setLoading(false);
      return;
    }

    try {
      const binData = {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        zone: formData.zone,
        capacity: capacity,
        type: formData.type,
        status: formData.status,
      };

      if (isEditMode) {
        await binService.updateBin(id, binData, token);
        toast.success("Bin updated successfully");
      } else {
        await binService.createBin(binData, token);
        toast.success("Bin created successfully");
      }
      history("/bins");
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
          {isEditMode ? "Edit Bin" : "Create New Bin"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Location on Map
            </label>
            <MapContainer
              center={markerPosition || [51.505, -0.09]}
              zoom={13}
              style={{ height: 300, width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker
                position={markerPosition}
                onChange={handleMapClick}
              />
            </MapContainer>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="longitude"
                className="block text-sm font-medium text-gray-700"
              >
                Longitude
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                id="longitude"
                required
                value={formData.longitude}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="latitude"
                className="block text-sm font-medium text-gray-700"
              >
                Latitude
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                id="latitude"
                required
                value={formData.latitude}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="zone"
                className="block text-sm font-medium text-gray-700"
              >
                Zone
              </label>
              <input
                type="text"
                name="zone"
                id="zone"
                required
                value={formData.zone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700"
              >
                Capacity (Liters)
              </label>
              <input
                type="number"
                name="capacity"
                id="capacity"
                required
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Bin Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="general">General Waste</option>
                <option value="recyclable">Recyclable</option>
                <option value="organic">Organic</option>
                <option value="hazardous">Hazardous</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="empty">Empty</option>
                <option value="half-full">Half Full</option>
                <option value="full">Full</option>
                <option value="overflow">Overflow</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => history("/bins")}
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
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Bin"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BinForm;
