import { Routes, Route } from 'react-router-dom';
import { Container, Title, Text, Button, Group } from '@mantine/core';
import { Header } from './Header';
import { MonumentsList } from './MonumentsList';
import { MonumentDetailPage } from './MonumentDetailPage'; // 1. Import our new component

// HomePage function stays the same
function HomePage() {
  return (
    <>
      <Container size="lg" style={{ paddingTop: '80px', textAlign: 'center' }}>
        <Title order={1} style={{ fontSize: '60px', fontWeight: 900, letterSpacing: '-1px' }}>
          Welcome to <span style={{ color: '#228be6' }}>HeritageHub</span>
        </Title>
        <Text color="dimmed" size="lg" style={{ marginTop: '20px', maxWidth: '600px', margin: 'auto' }}>
          Explore India's timeless wonders. Discover historical sites, 
          explore rich cultural heritage, and take immersive virtual tours 
          from the comfort of your home.
        </Text>
        <Group position="center" style={{ marginTop: '30px', gap: '20px' }}>
          <Button size="lg" radius="md">Start Exploring</Button>
          <Button size="lg" radius="md" variant="outline">Learn More</Button>
        </Group>
      </Container>
      <MonumentsList />
    </>
  );
}

// 2. We no longer need the placeholder function here!

// App.js main function
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 3. Update the route to use the new component */}
        <Route path="/monument/:id" element={<MonumentDetailPage />} />
      </Routes>
    </>
  );
}

export default App;