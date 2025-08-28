import React, { useEffect, useRef, useState } from 'react';
import { Database } from '../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'] & {
  property_images: Database['public']['Tables']['property_images']['Row'][];
  plots?: Database['public']['Tables']['plots']['Row'][];
};
interface GoogleMapLotsProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
}

const GoogleMapLots: React.FC<GoogleMapLotsProps> = ({ properties, onPropertySelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    // Mock Google Maps implementation
    // In a real application, you would use the Google Maps JavaScript API
    
    if (mapRef.current) {
      // Create a mock map visualization
      const mockMap = document.createElement('div');
      mockMap.className = 'w-full h-96 bg-green-100 rounded-lg relative overflow-hidden';
      mockMap.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200">
          <div class="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg">
            <h4 class="font-semibold mb-2">Légende</h4>
            <div class="space-y-1 text-sm">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span>Disponible</span>
              </div>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                <span>Réservé</span>
              </div>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-red-500 rounded mr-2"></div>
                <span>Vendu</span>
              </div>
            </div>
          </div>
        </div>
      `;

      // Add lot polygons
      properties.forEach((property, index) => {
        if (property.lots) {
          property.lots.forEach((lot, lotIndex) => {
            const lotElement = document.createElement('div');
            lotElement.className = `absolute cursor-pointer transition-all hover:scale-105`;
            lotElement.style.left = `${20 + (index * 150) + (lotIndex * 80)}px`;
            lotElement.style.top = `${100 + (lotIndex * 60)}px`;
            lotElement.style.width = '70px';
            lotElement.style.height = '50px';
            
            const bgColor = lot.status === 'disponible' ? 'bg-green-500' :
                           lot.status === 'réservé' ? 'bg-yellow-500' : 'bg-red-500';
            
            lotElement.innerHTML = `
              <div class="${bgColor} opacity-70 hover:opacity-90 w-full h-full rounded border-2 border-white shadow-lg flex items-center justify-center">
                <div class="text-white text-xs font-bold text-center">
                  <div>${lot.lot_number}</div>
                  <div>${lot.area}m²</div>
                </div>
              </div>
            `;
            
            lotElement.addEventListener('click', () => {
              onPropertySelect(property);
            });
            
            mockMap.appendChild(lotElement);
          });
        }
      });

      mapRef.current.innerHTML = '';
      mapRef.current.appendChild(mockMap);
    }
  }, [properties, onPropertySelect]);

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Carte Interactive des Lots</h3>
        <p className="text-gray-600 text-sm">
          Cliquez sur un lot pour voir les détails. Les couleurs indiquent la disponibilité.
        </p>
      </div>
      <div ref={mapRef} className="w-full h-96 bg-gray-100 rounded-lg"></div>
      
      {/* Property List */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties.map((property) => (
          <div key={property.id} className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">{property.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{property.location}</p>
            {property.lots && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Lots disponibles:</p>
                {property.plots?.map((lot) => (
                  <div key={lot.id} className="flex justify-between items-center text-sm">
                    <span>{lot.plot_number} - {lot.area_sqm}m²</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      lot.status === 'disponible' ? 'bg-green-100 text-green-800' :
                      lot.status === 'réservé' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {lot.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoogleMapLots;