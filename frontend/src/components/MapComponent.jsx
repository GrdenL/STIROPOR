import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix za Leaflet ikone (defaultne ikone ne rade u Vite/React)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ latitude, longitude, location, partnerName }) => {
    // Provjeri da li imamo validne koordinate
    const validLat = latitude && !isNaN(latitude) ? parseFloat(latitude) : null;
    const validLng = longitude && !isNaN(longitude) ? parseFloat(longitude) : null;

    // Ako nemamo koordinate, prikaži poruku
    if (!validLat || !validLng) {
        return (
            <div className="w-full h-64 rounded-xl overflow-hidden border-2 border-vintage-brown/10 bg-vintage-cream/50 flex items-center justify-center">
                <div className="text-center text-vintage-brown/60">
                    <svg
                        className="w-12 h-12 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    <p className="text-sm">Location coordinates not available</p>
                    <p className="text-xs text-vintage-brown/40 mt-1">
                        Contact backend team to add coordinates
                    </p>
                </div>
            </div>
        );
    }

    const coordinates = [validLat, validLng];

    return (
        <div className="w-full h-64 rounded-xl overflow-hidden border-2 border-vintage-brown/10">
            <MapContainer
                center={coordinates}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={coordinates}>
                    <Popup>
                        <div className="text-sm">
                            <strong className="text-vintage-accent">{partnerName}</strong><br />
                            <span className="text-vintage-brown/70">{location || 'Unknown location'}</span>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapComponent;