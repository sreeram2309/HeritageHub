import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Title, Text, Image, Loader, Alert } from '@mantine/core';

export function MonumentDetailPage() {
  const { id } = useParams(); // Get the "id" from the URL (e.g., "1")
  const [monument, setMonument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonument = async () => {
      try {
        setLoading(true);
        // Call our new API route using the id from the URL
        const res = await axios.get(`http://localhost:5001/api/monuments/${id}`);
        setMonument(res.data); // Store the monument's data in state
      } catch (err) {
        setError('Error fetching monument data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonument();
  }, [id]); // This hook re-runs if the 'id' in the URL ever changes

  // 1. Show a loading spinner
  if (loading) {
    return (
      <Container style={{ paddingTop: '80px', textAlign: 'center' }}>
        <Loader size="xl" />
      </Container>
    );
  }

  // 2. Show an error message
  if (error) {
    return (
      <Container style={{ paddingTop: '40px' }}>
        <Alert color="red" title="Error">
          {error}
        </Alert>
      </Container>
    );
  }

  // 3. Show the content once it's loaded
  return (
    <Container style={{ paddingTop: '40px' }}>
      <Title order={1} mb="lg">
        {monument.name}
      </Title>
      
      <Image
        src={monument.image_url}
        alt={monument.name}
        radius="md"
        mb="xl"
      />

      <Title order={3} mb="sm">
        About this wonder
      </Title>
      
      <Text style={{ fontSize: '18px', lineHeight: 1.7 }}>
        {monument.description}
      </Text>
    </Container>
  );
}