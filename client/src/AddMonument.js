import { useState } from 'react';
import { TextInput, Textarea, Button, Container, Title, NumberInput, Paper, Select } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function AddMonument() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    panoUrl: '',
    category: 'Monument',
    state: '', // New State Field
    latitude: 28.6129, 
    longitude: 77.2295,
  });

  // Separate state for the gallery text box
  const [galleryText, setGalleryText] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert the textarea string into an Array of URLs
    const galleryArray = galleryText.split('\n').filter(url => url.trim() !== '');

    const finalData = {
        ...formData,
        gallery: galleryArray
    };

    try {
      await axios.post('http://localhost:5001/api/monuments', finalData);
      alert('Site Added Successfully!');
      navigate('/explore');
    } catch (error) {
      console.error(error);
      alert('Error adding site');
    }
  };

  return (
    <Container size={600} my={40}>
      <Title align="center" mb="lg">Add a New Heritage Site</Title>
      
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
            placeholder="e.g. National Museum"
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            mb="md"
          />
          
          <Textarea
            label="Description"
            placeholder="Tell us the history..."
            required
            name="description"
            minRows={4}
            value={formData.description}
            onChange={handleChange}
            mb="md"
          />

          <TextInput
            label="Cover Image URL"
            placeholder="Link to the main photo"
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
            placeholder="Link to a 360 image (Optional)"
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

          <Button fullWidth mt="xl" type="submit" color="blue">
            Add to Database
          </Button>
        </form>
      </Paper>
    </Container>
  );
}