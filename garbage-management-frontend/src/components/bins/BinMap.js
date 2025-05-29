import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import binService from "../../services/binService";
import { toast } from "react-toastify";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const BinMap = () => {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const data = await binService.getAllBins();
        setBins(data);
      } catch (error) {
        toast.error("Failed to load bins on map.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBins();
  }, []);

  const getColor = (status) => {
    switch (status) {
      case "full":
      case "overflow":
        return "red";
      case "half-full":
        return "orange";
      case "empty":
        return "green";
      case "maintenance":
        return "blue";
      default:
        return "gray";
    }
  };

  const getCustomIcon = (status) => {
    return new L.Icon({
      iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${getColor(
        status
      )}`,
      iconSize: [21, 34],
      iconAnchor: [10, 34],
      popupAnchor: [1, -34],
    });
  };

  return (
    <div className="h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <MapContainer
          center={[20.5937, 78.9629]} // Default to India center, update as needed
          zoom={5}
          className="w-full h-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {bins
            .filter((bin) => bin.location?.coordinates?.length === 2)
            .map((bin) => (
              <Marker
                key={bin._id}
                position={[
                  bin.location.coordinates[1],
                  bin.location.coordinates[0],
                ]}
                icon={getCustomIcon(bin.status)}
              >
                <Popup>
                  <strong>ID:</strong> {bin._id.slice(-6)} <br />
                  <strong>Zone:</strong> {bin.zone} <br />
                  <strong>Status:</strong> {bin.status} <br />
                  <strong>Type:</strong> {bin.type}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      )}
    </div>
  );
};

export default BinMap;
