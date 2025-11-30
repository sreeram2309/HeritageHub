import { useState, useEffect } from 'react';
import { TextInput, Textarea, Button, Container, Title, NumberInput, Paper, Select, Loader, Group } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export function EditMonument() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    panoUrl: '',
    category: 'Monument',
    state: '', // Added State
    latitude: 0,
    longitude: 0,
  });

  // State for the gallery text area
  const [galleryText, setGalleryText] = useState('');

  // 1. Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://heritagehub-server.onrender.com/api/monuments/${id}`);
        
        setFormData({
            name: res.data.name,
            description: res.data.description,
            imageUrl: res.data.image_url,
            panoUrl: res.data.pano_image_url,
            category: res.data.category || 'Monument',
            state: res.data.state || '', // Fetch existing state
            latitude: parseFloat(res.data.latitude),
            longitude: parseFloat(res.data.longitude),
        });

        // Convert the gallery array back into a string (one URL per line)
        if (res.data.gallery && res.data.gallery.length > 0) {
            setGalleryText(res.data.gallery.join('\n'));
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        alert('Error fetching monument details');
        navigate('/explore');
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, category: value });
  };

  const handleNumberChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // 2. Submit Updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Process Gallery Text back into Array
    const galleryArray = galleryText.split('\n').filter(url => url.trim() !== '');

    const finalData = {
        ...formData,
        gallery: galleryArray
    };

    try {
      await axios.put(`https://heritagehub-server.onrender.com/api/monuments/${id}`, finalData);
      alert('Monument Updated Successfully!');
      navigate('/explore');
    } catch (error) {
      console.error(error);
      alert('Error updating monument');
    }
  };

  if (loading) return <Container pt={80} ta="center"><Loader size="xl" /></Container>;

  return (
    <Container size={600} my={40}>
      <Title align="center" mb="lg">Edit Monument</Title>
      
      <Paper withBorder shadow="md" p={30} radius="md">
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <Select
                label="Category"
                placeholder="Pick one"
                data={[
                { value: 'Monument', label: 'Monument' },
                { value: 'Museum', label: 'Museum' },
                { value: 'Sanctuary', label: 'Wildlife Sanctuary' },
                { value: 'Temple', label: 'Temple/Religious Site' },
                { value: 'Fort', label: 'Fort' },
                { value: 'Palace', label: 'Palace' },
                ]}
                value={formData.category}
                onChange={handleSelectChange}
                mb="md"
                style={{ flex: 1 }}
                required
            />

            {/* STATE DROPDOWN */}
            <Select
                label="State/Region"
                placeholder="Select State"
                data={[
                'Delhi', 'Uttar Pradesh', 'Rajasthan', 'Kerala', 'Tamil Nadu', 
                'Maharashtra', 'Karnataka', 'Gujarat', 'Punjab', 'West Bengal',
                'Madhya Pradesh', 'Telangana', 'Andhra Pradesh'
                ]}
                value={formData.state}
                onChange={(val) => setFormData({ ...formData, state: val })}
                mb="md"
                style={{ flex: 1 }}
                required
            />
          </div>

          <TextInput
            label="Site Name"
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            mb="md"
          />
          
          <Textarea
            label="Description"
            required
            name="description"
            minRows={4}
            value={formData.description}
            onChange={handleChange}
            mb="md"
          />

          <TextInput
            label="Cover Image URL"
            required
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            mb="md"
          />

          <Textarea
            label="Gallery Images"
            placeholder="Paste extra image links here (One per line)"
            minRows={3}
            value={galleryText}
            onChange={(e) => setGalleryText(e.target.value)}
            mb="md"
          />

          <TextInput
            label="360° Panorama URL"
            name="panoUrl"
            value={formData.panoUrl}
            onChange={handleChange}
            mb="md"
          />

          <Title order={5} mb="xs" mt="lg">Map Coordinates</Title>
          <div style={{ display: 'flex', gap: '20px' }}>
            <NumberInput
              label="Latitude"
              decimalScale={6}
              value={formData.latitude}
              onChange={(val) => handleNumberChange('latitude', val)}
              required
              style={{ flex: 1 }}
            />
            <NumberInput
              label="Longitude"
              decimalScale={6}
              value={formData.longitude}
              onChange={(val) => handleNumberChange('longitude', val)}
              required
              style={{ flex: 1 }}
            />
          </div>

          <Group grow mt="xl">
            <Button variant="default" onClick={() => navigate('/explore')}>Cancel</Button>
            <Button type="submit" color="blue">Save Changes</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}