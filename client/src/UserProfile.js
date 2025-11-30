import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Title, Grid, Card, Image, Text, Button, Badge, Group, Avatar, Paper, Table } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconTicket } from '@tabler/icons-react';

export function UserProfile() {
  const [favorites, setFavorites] = useState([]);
  const [bookings, setBookings] = useState([]); // Store bookings
  
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!userId) return;

    // Fetch Favorites
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`https://heritagehub-server.onrender.com/api/users/${userId}/favorites`);
        setFavorites(res.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    // Fetch Bookings (NEW!)
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`https://heritagehub-server.onrender.com/api/users/${userId}/bookings`);
        setBookings(res.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchFavorites();
    fetchBookings();
  }, [userId]);

  if (!userId) {
    return (
      <Container py="xl" ta="center">
        <Title>Please Log In</Title>
        <Link to="/login"><Button mt="md">Go to Login</Button></Link>
      </Container>
    );
  }

  return (
    <Container py="xl">
      {/* USER INFO HEADER */}
      <Paper shadow="xs" p="xl" withBorder mb="xl" radius="md">
        <Group>
          <Avatar size="xl" radius="xl" color="blue" />
          <div>
            <Title order={2}>Welcome back!</Title>
            <Badge color="grape" size="lg" mt="xs">{role}</Badge>
          </div>
        </Group>
      </Paper>

      {/* --- MY TICKETS SECTION (NEW!) --- */}
      <Title order={3} mb="md">My Upcoming Tours 🎟️</Title>
      
      {bookings.length === 0 ? (
        <Text c="dimmed" mb="xl">No tours booked yet.</Text>
      ) : (
        <Paper shadow="xs" p="md" withBorder mb="xl" radius="md">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Monument</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Time</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {bookings.map((ticket) => (
                <Table.Tr key={ticket.booking_id}>
                  <Table.Td fw={500}>{ticket.monument_name}</Table.Td>
                  <Table.Td>{new Date(ticket.tour_date).toLocaleDateString()}</Table.Td>
                  <Table.Td>{ticket.tour_time}</Table.Td>
                  <Table.Td>
                    <Button 
                      component="a" 
                      href={ticket.meeting_link} 
                      target="_blank" 
                      color="green" 
                      size="xs"
                      leftSection={<IconTicket size={14} />}
                    >
                      Join Meeting
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      )}

      {/* FAVORITES GRID */}
      <Title order={3} mb="lg">My Saved Places ❤️</Title>

      {favorites.length === 0 && (
        <Text c="dimmed">You haven't saved any places yet. Go explore!</Text>
      )}

      <Grid>
        {favorites.map((monument) => (
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
                <Badge color="pink" variant="light">
                  {monument.category || 'Monument'}
                </Badge>
              </Group>

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