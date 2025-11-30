import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Paper, Title, TextInput, PasswordInput, Button, Text, Anchor, Select } from '@mantine/core';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'User', // Default role
  });

  const { username, email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Special handler for the Mantine Select component
  const onRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send role along with other data
      await axios.post('https://heritagehub-server.onrender.com/api/auth/register', {
        username,
        email,
        password,
        role 
      });

      alert('Registration Successful! Please log in.');
      navigate('/login');

    } catch (error) {
      // FIX: Safely check for error.response existence
      console.error(error.response?.data || error.message);
      alert('Error: ' + (error.response?.data?.message || 'Server is offline or blocked connection.'));
    }
  };

  return (
    <Container size={420} my={40}>
      <Title align="center">Join HeritageHub</Title>
      
      <Text c="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{' '}
        <Link to="/login" style={{ textDecoration: 'none' }}>
            <Anchor size="sm" component="button">
            Login
            </Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={onSubmit}>
          
          <Select
            label="I want to join as a..."
            placeholder="Pick one"
            data={[
              { value: 'User', label: 'Cultural Enthusiast (Explorer)' },
              { value: 'Tour Guide', label: 'Tour Guide (Contributor)' },
              { value: 'Content Creator', label: 'Content Creator (Writer/Blogger)' },
            ]}
            value={role}
            onChange={onRoleChange}
            mb="md"
            required
          />

          <TextInput
            label="Username"
            placeholder="Choose a username"
            name="username"
            value={username}
            onChange={onChange}
            required
            mb="md"
          />
          
          <TextInput
            label="Email"
            placeholder="you@email.com"
            name="email"
            value={email}
            onChange={onChange}
            required
            mb="md"
          />

          <PasswordInput
            label="Password"
            placeholder="Create a secure password"
            name="password"
            value={password}
            onChange={onChange}
            minLength={6}
            required
            mb="xl"
          />

          <Button fullWidth type="submit">
            Register Account
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;