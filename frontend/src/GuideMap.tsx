import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import type { Guide } from './types';

export function GuideMap({ guides, onSelect }: { guides: Guide[]; onSelect: (guide: Guide) => void }) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!token) {
    return (
      <div className="map-placeholder">
        <strong>Interactive guide map</strong>
        <span>Add VITE_MAPBOX_TOKEN to enable Mapbox.</span>
      </div>
    );
  }
  return (
    <Map
      mapboxAccessToken={token}
      initialViewState={{ longitude: -71.0589, latitude: 42.3601, zoom: 11 }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      style={{ width: '100%', height: '100%' }}
    >
      <NavigationControl position="top-right" />
      {guides.map((guide) => (
        <Marker
          key={guide._id}
          longitude={guide.location.coordinates[0]}
          latitude={guide.location.coordinates[1]}
          onClick={() => onSelect(guide)}
        >
          <button className="marker" title={guide.name}>●</button>
        </Marker>
      ))}
    </Map>
  );
}
