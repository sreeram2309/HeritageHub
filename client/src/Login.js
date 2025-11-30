import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Paper, Title, TextInput, PasswordInput, Button, Text, Anchor } from '@mantine/core';

export function Login() {
  // We renamed 'email' to 'identifier' since it can be either
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', {
        identifier, // Send 'identifier' instead of 'email'
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userId', res.data.userId);

      alert('Login Successful!');
      navigate('/');
      window.location.reload();

    } catch (error) {
      console.error(error);
      alert('Invalid Credentials');
    }
  };

  return (
    <Container size={420} my={40}>
      <Title align="center">Welcome back!</Title>
      
      <Text c="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{' '}
        <Link to="/register" style={{ textDecoration: 'none' }}>
            <Anchor size="sm" component="button">
            Create account
            </Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={onSubmit}>
          <TextInput 
            label="Username or Email" 
            placeholder="heritage_fan OR user@email.com" 
            required 
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <PasswordInput 
            label="Password" 
            placeholder="Your password" 
            required 
            mt="md" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}