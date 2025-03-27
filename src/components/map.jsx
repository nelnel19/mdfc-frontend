import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../styles/map.module.css";
import Sidebar from "./sidebar";
import axios from "axios";
import L from "leaflet";

// Google Fonts
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

// Custom Icons
const userIcon = L.icon({
  iconUrl: "/images/user-icon.png",
  iconSize: [35, 50],
  iconAnchor: [17, 50],
  popupAnchor: [1, -34],
});

const dermatologistIcon = L.icon({
  iconUrl: "/images/dermatologist-icon.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
});

const searchIcon = L.icon({
  iconUrl: "/images/search-icon.png", // Add a custom icon for searched locations
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
});

const MapComponent = ({ selectedPlace }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      map.flyTo([selectedPlace.lat, selectedPlace.lon], 16, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [selectedPlace, map]);

  return null;
};

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const mapRef = useRef();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearbyPlaces(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    }
  }, []);

  const fetchNearbyPlaces = async (lat, lng) => {
    const query = `
      [out:json];
      (
        node["healthcare"="doctor"]["speciality"="dermatology"](around:3000, ${lat}, ${lng});
        node["shop"="beauty"](around:3000, ${lat}, ${lng});
      );
      out;
    `;

    try {
      const response = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = response.data.elements;

      const mappedPlaces = data.map((place) => ({
        id: place.id,
        lat: place.lat,
        lon: place.lon,
        name: place.tags.name || "Unnamed Place",
      }));

      setPlaces(mappedPlaces);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          `${searchQuery}, Philippines`
        )}`
      );

      const results = response.data.map((result) => ({
        name: result.display_name,
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
      }));

      setSearchResults(results);

      if (results.length > 0) {
        const firstResult = results[0];
        setSelectedPlace({ lat: firstResult.lat, lon: firstResult.lon });
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  return (
    <div className={styles.backgroundWrapper}>
      <div className={styles.container}>
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Map Section */}
        <div className={styles.mapContainer}>
          {userLocation ? (
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={14}
              className={styles.map}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />

              {/* User's Location */}
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>You are here!</Popup>
              </Marker>

              {/* Dermatologists & Beauty Shops */}
              {places.map((place) => (
                <Marker key={place.id} position={[place.lat, place.lon]} icon={dermatologistIcon}>
                  <Popup>{place.name}</Popup>
                  <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent className={styles.tooltip}>
                    <span>{place.name}</span>
                  </Tooltip>
                </Marker>
              ))}

              {/* Searched Locations */}
              {searchResults.map((result, index) => (
                <Marker key={index} position={[result.lat, result.lon]} icon={searchIcon}>
                  <Popup>{result.name}</Popup>
                  <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent className={styles.tooltip}>
                    <span>{result.name}</span>
                  </Tooltip>
                </Marker>
              ))}

              <MapComponent selectedPlace={selectedPlace} />
            </MapContainer>
          ) : (
            <p>Loading map...</p>
          )}
        </div>

        {/* Details Section */}
        <div className={styles.details}>
          <h2 className={styles.title}>Location Details</h2>
          {userLocation ? (
            <div className={styles.info}>
              <p>
                <strong>Current Location:</strong>
              </p>
              <p>Latitude: {userLocation.lat}</p>
              <p>Longitude: {userLocation.lng}</p>
            </div>
          ) : (
            <p>Getting location...</p>
          )}

          <h3 className={styles.subTitle}>Search Locations in the Philippines</h3>

          {/* Search Box */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Enter a location in the Philippines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchBox}
            />
            <button onClick={handleSearch} className={styles.searchButton}>
              Search
            </button>
          </div>

          {/* Search Results */}
          <ul className={styles.list}>
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <li
                  key={index}
                  className={styles.listItem}
                  onClick={() => setSelectedPlace({ lat: result.lat, lon: result.lon })}
                >
                  {result.name}
                </li>
              ))
            ) : (
              <p>No search results found.</p>
            )}
          </ul>

          {/* Nearest Dermatologists */}
          <h3 className={styles.subTitle}>Nearby Dermatologists & Shops</h3>
          <ul className={styles.list}>
            {places.length > 0 ? (
              places.map((place) => (
                <li
                  key={place.id}
                  className={styles.listItem}
                  onClick={() => setSelectedPlace(place)}
                >
                  {place.name}
                </li>
              ))
            ) : (
              <p>No nearby places found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Map;