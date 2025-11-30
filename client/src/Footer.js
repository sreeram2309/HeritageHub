import { Container, Group, Text, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <div style={{ marginTop: 'auto', borderTop: '1px solid #eaeaea', backgroundColor: '#f8f9fa' }}>
      <Container size="lg" py="xl">
        <Group justify="space-between">
          
          {/* Left Side: Branding */}
          <div>
            <Text size="lg" fw={700} c="blue" mb={5}>
              HeritageHub
            </Text>
            <Text size="xs" c="dimmed" style={{ maxWidth: '300px' }}>
              A comprehensive digital archive of India's historical monuments, 
              cultural stories, and immersive virtual experiences.
            </Text>
          </div>

          {/* Right Side: Links */}
          <Group gap="xl" align="start">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Text fw={700} mb={5}>Project</Text>
              <Link to="/about" style={{ textDecoration: 'none', color: 'inherit', fontSize: '14px' }}>
                About Us
              </Link>
              <Link to="/explore" style={{ textDecoration: 'none', color: 'inherit', fontSize: '14px' }}>
                Explore
              </Link>
              <Link to="/culture" style={{ textDecoration: 'none', color: 'inherit', fontSize: '14px' }}>
                Cultural Feed
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Text fw={700} mb={5}>Team</Text>
              <Anchor href="#" target="_blank" size="sm" c="dimmed">
                GitHub Repo
              </Anchor>
              <Text size="sm" c="dimmed">CSE 2nd Year</Text>
            </div>
          </Group>

        </Group>
        
        <Text c="dimmed" size="xs" ta="center" mt="lg">
          © 2025 HeritageHub. Built with React & Mantine.
        </Text>
      </Container>
    </div>
  );
}