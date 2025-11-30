import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, Image, Text, Button, Badge, Group, TextInput, Select, ActionIcon } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';

export function MonumentsList() {
  const [monuments, setMonuments] = useState([]);
  const [favorites, setFavorites] = useState([]); 
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  
  // Roles
  const userRole = localStorage.getItem('role'); 
  const userId = localStorage.getItem('userId');
  
  // PERMISSIONS LOGIC:
  const isAdmin = userRole === 'Admin';
  // Staff = Admin OR Tour Guide OR Content Creator
  const isStaff = userRole === 'Admin' || userRole === 'Tour Guide' || userRole === 'Content Creator';

  const fetchData = async () => {
    try {
      const res = await axios.get('https://heritagehub-server.onrender.com/api/monuments');
      setMonuments(res.data);

      if (userId) {
        const favRes = await axios.get(`https://heritagehub-server.onrender.com/api/users/${userId}/favorites`);
        setFavorites(favRes.data.map(m => m.id));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleFavorite = async (monumentId) => {
    if (!userId) return alert("Please login to save favorites!");
    try {
      if (favorites.includes(monumentId)) {
        setFavorites(favorites.filter(id => id !== monumentId));
      } else {
        setFavorites([...favorites, monumentId]);
      }
      await axios.post('https://heritagehub-server.onrender.com/api/favorites/toggle', {
        user_id: userId,
        monument_id: monumentId
      });
    } catch (error) {
      console.error(error);
      fetchData();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      try {
        await axios.delete(`https://heritagehub-server.onrender.com/api/monuments/${id}`);
        fetchData();
      } catch (error) {
        alert('Failed to delete.');
      }
    }
  };

  const filteredMonuments = monuments.filter(monument => {
    const matchesSearch = monument.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || monument.category === categoryFilter;
    const matchesState = stateFilter === 'All' || monument.state === stateFilter;
    return matchesSearch && matchesCategory && matchesState;
  });

  return (
    <Container py="xl">
      {/* --- FILTERS BAR --- */}
      <Group mb="xl" grow>
        <TextInput 
          placeholder="Search by name..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.currentTarget.value)} 
        />
        <Select
          placeholder="Category"
          data={[
            { value: 'All', label: 'All Categories' },
            { value: 'Monument', label: 'Monuments' },
            { value: 'Museum', label: 'Museums' },
            { value: 'Sanctuary', label: 'Sanctuaries' },
            { value: 'Temple', label: 'Temples' },
            { value: 'Fort', label: 'Forts' },
            { value: 'Palace', label: 'Palaces' },
          ]}
          value={categoryFilter}
          onChange={setCategoryFilter}
        />
        <Select
          placeholder="State"
          data={[
            { value: 'All', label: 'All States' },
            { value: 'Delhi', label: 'Delhi' },
            { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
            { value: 'Rajasthan', label: 'Rajasthan' },
            { value: 'Kerala', label: 'Kerala' },
            { value: 'Tamil Nadu', label: 'Tamil Nadu' },
            { value: 'Maharashtra', label: 'Maharashtra' },
            { value: 'Karnataka', label: 'Karnataka' },
            { value: 'Gujarat', label: 'Gujarat' },
          ]}
          value={stateFilter}
          onChange={setStateFilter}
        />
      </Group>

      {/* --- MONUMENT GRID --- */}
      <Grid>
        {filteredMonuments.length === 0 && <Text c="dimmed" ta="center" w="100%">No results found.</Text>}

        {filteredMonuments.map((monument) => {
          const isFavorite = favorites.includes(monument.id);

          return (
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={monument.id}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image src={monument.image_url} height={160} alt={monument.name} />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>{monument.name}</Text>
                  <ActionIcon 
                    variant="transparent" 
                    color={isFavorite ? 'red' : 'gray'} 
                    onClick={() => toggleFavorite(monument.id)}
                  >
                    {isFavorite ? <IconHeartFilled /> : <IconHeart />}
                  </ActionIcon>
                </Group>

                <Group gap="xs" mb="sm">
                  <Badge color="pink" variant="light">
                    {monument.category || 'Monument'}
                  </Badge>
                  {monument.state && (
                    <Badge color="cyan" variant="outline">
                      {monument.state}
                    </Badge>
                  )}
                </Group>

                <Text size="sm" c="dimmed" lineClamp={3}>
                  {monument.description}
                </Text>

                <Group mt="md">
                  <Link to={`/monument/${monument.id}`} style={{ textDecoration: 'none', flex: 1 }}>
                    <Button variant="light" color="blue" fullWidth radius="md">View Details</Button>
                  </Link>

                  {/* EDIT BUTTON: Visible to Admin, Guide, Creator */}
                  {isStaff && (
                    <Link to={`/edit-monument/${monument.id}`}>
                       <Button variant="outline" color="yellow" radius="md">Edit</Button>
                    </Link>
                  )}

                  {/* DELETE BUTTON: Visible ONLY to Admin */}
                  {isAdmin && (
                    <Button variant="filled" color="red" radius="md" onClick={() => handleDelete(monument.id)}>Delete</Button>
                  )}
                </Group>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>
    </Container>
  );
}