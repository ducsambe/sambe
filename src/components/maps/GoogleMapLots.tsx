import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Property, Lot } from '../../types';
import toast from 'react-hot-toast';

interface GoogleMapLotsProps {
  property: Property;
  onLotSelect: (lot: Lot) => void;
  selectedLot?: Lot;
}

const GoogleMapLots: React.FC<GoogleMapLotsProps> = ({ 
  property, 
  onLotSelect, 
  selectedLot 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your actual API key
        version: 'weekly',
      });

      try {
        await loader.load();
        
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: property.coordinates,
            zoom: 18,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          setMap(mapInstance);
          
          // Add property marker
          new google.maps.Marker({
            position: property.coordinates,
            map: mapInstance,
            title: property.title,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#10B981" stroke="#ffffff" stroke-width="2"/>
                  <text x="20" y="25" text-anchor="middle" fill="white" font-size="12" font-weight="bold">🏡</text>
                </svg>
              `),
              scaledSize: new google.maps.Size(40, 40)
            }
          });
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        toast.error('Erreur lors du chargement de la carte');
      }
    };

    initMap();
  }, [property]);

  useEffect(() => {
    if (map && property.lots) {
      // Clear existing polygons
      polygons.forEach(polygon => polygon.setMap(null));
      
      const newPolygons: google.maps.Polygon[] = [];

      property.lots.forEach((lot) => {
        const getPolygonColor = (status: string) => {
          switch (status) {
            case 'disponible':
              return { fillColor: '#10B981', strokeColor: '#059669' };
            case 'réservé':
              return { fillColor: '#F59E0B', strokeColor: '#D97706' };
            case 'vendu':
              return { fillColor: '#EF4444', strokeColor: '#DC2626' };
            default:
              return { fillColor: '#6B7280', strokeColor: '#4B5563' };
          }
        };

        const colors = getPolygonColor(lot.status);
        
        const polygon = new google.maps.Polygon({
          paths: lot.polygon_coordinates,
          strokeColor: colors.strokeColor,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: colors.fillColor,
          fillOpacity: lot.id === selectedLot?.id ? 0.6 : 0.35,
          clickable: lot.status === 'disponible'
        });

        polygon.setMap(map);
        newPolygons.push(polygon);

        // Add lot label
        const bounds = new google.maps.LatLngBounds();
        lot.polygon_coordinates.forEach(coord => bounds.extend(coord));
        const center = bounds.getCenter();

        const marker = new google.maps.Marker({
          position: center,
          map: map,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="60" height="30" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="56" height="26" rx="4" fill="white" stroke="${colors.strokeColor}" stroke-width="2"/>
                <text x="30" y="12" text-anchor="middle" fill="${colors.strokeColor}" font-size="8" font-weight="bold">${lot.lot_number}</text>
                <text x="30" y="22" text-anchor="middle" fill="${colors.strokeColor}" font-size="6">${lot.area}m²</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(60, 30)
          }
        });

        if (lot.status === 'disponible') {
          polygon.addListener('click', () => {
            onLotSelect(lot);
          });
          
          marker.addListener('click', () => {
            onLotSelect(lot);
          });
        }
      });

      setPolygons(newPolygons);
    }
  }, [map, property.lots, selectedLot, onLotSelect]);

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-200">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
        <h4 className="text-sm font-semibold mb-2">Légende</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-emerald-500 rounded mr-2"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span>Réservé</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span>Vendu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapLots;