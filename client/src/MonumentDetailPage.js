import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Title, Text, Image, Loader, Alert, Paper } from '@mantine/core';
import { Carousel } from '@mantine/carousel'; 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MonumentTimeline } from './MonumentTimeline';
import { Reviews } from './Reviews';
import { UpcomingTours } from './UpcomingTours'; // Don't forget the Tour Schedule!
import { VirtualTour } from './VirtualTour';     // <--- 1. Import Virtual Tour
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for map marker icon
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export function MonumentDetailPage() {
  const { id } = useParams();
  const [monument, setMonument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonument = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5001/api/monuments/${id}`);
        setMonument(res.data);
      } catch (err) {
        setError('Error fetching monument data.');
      } finally {
        setLoading(false);
      }
    };
    fetchMonument();
  }, [id]);

  if (loading) return <Container pt={80} ta="center"><Loader size="xl" /></Container>;
  if (error) return <Container pt={40}><Alert color="red">{error}</Alert></Container>;

  const lat = parseFloat(monument.latitude);
  const lng = parseFloat(monument.longitude);
  const hasLocation = !isNaN(lat) && !isNaN(lng);

  const slides = [monument.image_url, ...(monument.gallery || [])];

  return (
    <Container py={40}>
      <Title order={1} mb="lg">{monument.name}</Title>
      
      {/* CAROUSEL */}
      <Carousel withIndicators height={400} slideGap="md" controlsOffset="xs" loop align="start" mb="md">
        {slides.map((url, index) => (
          <Carousel.Slide key={index}>
            <Image src={url} alt={`Slide ${index}`} height={400} fit="cover" radius="md" />
          </Carousel.Slide>
        ))}
      </Carousel>

      {/* --- 2. VIRTUAL TOUR BUTTON (Restored!) --- */}
      {/* This will only show if there is a pano link in the database */}
      <VirtualTour panoUrl={monument.pano_image_url} name={monument.name} />

      <Title order={3} mb="sm" mt="xl">About this wonder</Title>
      <Text size="lg" lh={1.7} mb="xl">
        {monument.description}
      </Text>

      {/* TIMELINE */}
      <MonumentTimeline monumentId={id} />

      {/* MAP */}
      {hasLocation && (
        <>
          <Title order={3} mb="sm" mt="xl">Location</Title>
          <Paper shadow="xs" p="xs" withBorder>
            <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: '400px', width: '100%', borderRadius: '8px' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]}>
                <Popup>{monument.name}</Popup>
              </Marker>
            </MapContainer>
          </Paper>
        </>
      )}

      {/* UPCOMING TOURS SCHEDULE */}
      <UpcomingTours monumentId={id} />

      {/* REVIEWS */}
      <Reviews monumentId={id} />
    </Container>
  );
}