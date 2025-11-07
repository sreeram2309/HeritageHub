import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, Image, Text, Button, Badge, Group } from '@mantine/core';
import { Link } from 'react-router-dom'; // 1. Import Link

export function MonumentsList() {
  const [monuments, setMonuments] = useState([]);

  useEffect(() => {
    const fetchMonuments = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/monuments');
        setMonuments(res.data);
      } catch (error) {
        console.error('Error fetching monuments:', error);
      }
    };
    fetchMonuments();
  }, []);

  return (
    <Container py="xl">
      <Grid>
        {monuments.map((monument) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={monument.id}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section>
                <Image
                  src={monument.image_url}
                  height={160}
                  alt={monument.name}
                />
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{monument.name}</Text>
                <Badge color="blue" variant="light">
                  Agra
                </Badge>
              </Group>

              <Text size="sm" c="dimmed" lineClamp={3}>
                {monument.description}
              </Text>

              {/* 2. Wrap the Button in a Link component. */}
              {/* This links to /monument/1, /monument/2, etc. */}
              <Link to={`/monument/${monument.id}`} style={{ textDecoration: 'none' }}>
                <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                  View Details
                </Button>
              </Link>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}