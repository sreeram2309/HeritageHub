import { Container, Title } from '@mantine/core';
import { MonumentsList } from './MonumentsList';

export function ExplorePage() {
  return (
    <Container size="lg" py="xl">
      <Title align="center" mb="xl">Explore Our Heritage</Title>
      {/* We are reusing the smart list component here */}
      <MonumentsList />
    </Container>
  );
}