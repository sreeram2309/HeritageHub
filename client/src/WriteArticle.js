import { useState } from 'react';
import { TextInput, Textarea, Button, Container, Title, Paper } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function WriteArticle() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Get the logged-in user's ID
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://heritagehub-server.onrender.com/api/articles', {
        ...formData,
        author_id: userId // Attach the author ID
      });
      alert('Story Published Successfully!');
      navigate('/culture'); // Redirect to the feed
    } catch (error) {
      console.error(error);
      alert('Error publishing story');
    }
  };

  return (
    <Container size={800} my={40}>
      <Title align="center" mb="lg">Write a New Story</Title>
      
      <Paper withBorder shadow="md" p={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Story Title"
            placeholder="e.g. The Spices of Kerala"
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            mb="md"
          />
          
          <TextInput
            label="Cover Image URL"
            placeholder="Link to a nice photo"
            required
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            mb="md"
          />

          <Textarea
            label="Content"
            placeholder="Write your story here..."
            required
            name="content"
            minRows={15}
            value={formData.content}
            onChange={handleChange}
            mb="xl"
          />

          <Button fullWidth size="md" type="submit" color="grape">
            Publish Story
          </Button>
        </form>
      </Paper>
    </Container>
  );
}