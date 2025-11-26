/* eslint-disable simple-import-sort/imports, import/order */
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet';
import styled from 'styled-components';

import { AddressLocation } from '@/models/warehouse.model';

type MapViewProps = {
  location?: AddressLocation; // Only destination needed
  height?: string;
  zoom?: number;
};

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -28],
  shadowSize: [41, 41],
});

const MapWrapper = styled.div<{ $height: string }>`
  width: 100%;
  height: ${(p) => p.$height};
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
`;

const ExternalLink = styled.a`
  display: inline-block;
  margin-top: 8px;
  font-size: 13px;
  color: #6d28d9;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export const MapView = ({ location, height = '300px', zoom = 14 }: MapViewProps) => {
  if (!location) {
    return <EmptyState>Không có vị trí để hiển thị</EmptyState>;
  }

  const { lat, lng } = location;
  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;

  return (
    <div>
      <MapWrapper $height={height}>
        <LeafletMap center={{ lat, lng }} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} zoom={zoom}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker icon={defaultIcon} position={{ lat, lng }}>
            <Popup>Đích đến</Popup>
          </Marker>
        </LeafletMap>
      </MapWrapper>
      <ExternalLink href={osmLink} rel="noopener noreferrer" target="_blank">
        Xem bản đồ chi tiết trên OpenStreetMap
      </ExternalLink>
    </div>
  );
};

const EmptyState = styled.div`
  padding: 32px;
  text-align: center;
  font-size: 14px;
  color: #64748b;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
`;

