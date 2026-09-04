import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// Fix Leaflet marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const pickupIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:16px;
      height:16px;
      background:#ffb000;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 2px 8px rgba(0,0,0,.4);
    "></div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const destinationIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:16px;
      height:16px;
      background:#ef4444;
      border:3px solid white;
      border-radius:4px;
      box-shadow:0 2px 8px rgba(0,0,0,.4);
    "></div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const RecenterMap = ({ pickup, destination }) => {
  const map = useMap();

  React.useEffect(() => {
    const bounds = L.latLngBounds([
      pickup,
      destination,
    ]);

    map.fitBounds(bounds, {
      padding: [40, 40],
    });
  }, [map, pickup, destination]);

  return null;
};

const RideMap = ({
  pickup,
  destination,
  height = "280px",
}) => {
  // Demo route
  const route = [
    pickup,
    [
      (pickup[0] + destination[0]) / 2 + 0.002,
      (pickup[1] + destination[1]) / 2 - 0.002,
    ],
    destination,
  ];

  return (
    <div
      className="overflow-hidden rounded-[15px] border border-[#242424]"
      style={{ height }}
    >
      <MapContainer
        center={pickup}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap
          pickup={pickup}
          destination={destination}
        />

        <Marker
          position={pickup}
          icon={pickupIcon}
        >
          <Popup>
            <strong>Pickup</strong>
          </Popup>
        </Marker>

        <Marker
          position={destination}
          icon={destinationIcon}
        >
          <Popup>
            <strong>Destination</strong>
          </Popup>
        </Marker>

        <Polyline
          positions={route}
          pathOptions={{
            color: "#ffb000",
            weight: 5,
            opacity: 0.9,
          }}
        />
      </MapContainer>
    </div>
  );
};

export default RideMap;