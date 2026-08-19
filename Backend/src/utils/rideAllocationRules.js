const axios = require('axios');

const POLICE_STATIONS = {
  Kolhapur: [
    { name: 'Kolhapur City Police', phone: '100', location: { lat: 16.704987, lng: 74.243257 } },
    { name: 'Shahupuri Police Station', phone: '0231-2644444', location: { lat: 16.698298, lng: 74.21489 } },
    { name: 'Rajaram Police Station', phone: '0231-2652000', location: { lat: 16.690816, lng: 74.226187 } },
  ],
  Ichalkaranji: [
    { name: 'Ichalkaranji Police Station', phone: '100', location: { lat: 16.69134, lng: 74.46514 } },
    { name: 'Gandhinagar Police Station', phone: '0230-2425333', location: { lat: 16.68458, lng: 74.46873 } },
  ],
  Sangli: [
    { name: 'Sangli City Police', phone: '100', location: { lat: 16.8524, lng: 74.5815 } },
    { name: 'Maharashtra Police Outpost', phone: '0233-2323456', location: { lat: 16.8552, lng: 74.5701 } },
  ],
};

function normalizeGender(value) {
  const gender = String(value || '').trim().toLowerCase();
  if ([ 'male', 'female', 'other' ].includes(gender)) return gender;
  return null;
}

function userNeedsFemaleDriver(userGender, vehicleType) {
  return normalizeGender(userGender) === 'female' && String(vehicleType || '').trim().toUpperCase() === 'BIKE';
}

function buildDriverGenderFilter(userGender, vehicleType) {
  return userNeedsFemaleDriver(userGender, vehicleType) ? { gender: 'female' } : {};
}

function haversineKm(a, b) {
  if (!a || !b) return Number.POSITIVE_INFINITY;
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const lat1 = toRadians(Number(a.lat));
  const lat2 = toRadians(Number(b.lat));
  const deltaLat = toRadians(Number(b.lat) - Number(a.lat));
  const deltaLng = toRadians(Number(b.lng) - Number(a.lng));
  const h = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

function getNearestPoliceStation(currentLocation, stations = []) {
  if (!currentLocation || !Array.isArray(stations) || stations.length === 0) return null;
  return stations.reduce((nearest, station) => {
    const currentDist = haversineKm(currentLocation, station.location || {});
    if (!Number.isFinite(currentDist)) return nearest;
    if (!nearest) return { ...station, _distanceKm: currentDist };
    return currentDist < nearest._distanceKm ? { ...station, _distanceKm: currentDist } : nearest;
  }, null);
}

async function fetchNearbyPoliceStations(currentLocation, radiusMeters = 5000) {
  if (!currentLocation || !Number.isFinite(Number(currentLocation.lat)) || !Number.isFinite(Number(currentLocation.lng))) {
    return [];
  }

  try {
    const query = `[out:json];(
      node["amenity"="police"](around:${radiusMeters},${Number(currentLocation.lat)},${Number(currentLocation.lng)});
      way["amenity"="police"](around:${radiusMeters},${Number(currentLocation.lat)},${Number(currentLocation.lng)});
      relation["amenity"="police"](around:${radiusMeters},${Number(currentLocation.lat)},${Number(currentLocation.lng)});
    );out center 10;`;
    const response = await axios.get('https://overpass-api.de/api/interpreter', {
      params: { data: query },
      timeout: 7000,
    });

    const elements = Array.isArray(response?.data?.elements) ? response.data.elements : [];
    return elements
      .map((item) => {
        const lat = Number(item?.lat ?? item?.center?.lat);
        const lng = Number(item?.lon ?? item?.center?.lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        const name = String(item?.tags?.name || item?.tags?.operator || 'Police station').trim();
        const phone = String(item?.tags?.phone || '100').trim() || '100';
        return { name, phone, location: { lat, lng } };
      })
      .filter(Boolean);
  } catch (error) {
    return [];
  }
}

module.exports = {
  POLICE_STATIONS,
  normalizeGender,
  userNeedsFemaleDriver,
  buildDriverGenderFilter,
  haversineKm,
  getNearestPoliceStation,
  fetchNearbyPoliceStations,
};
