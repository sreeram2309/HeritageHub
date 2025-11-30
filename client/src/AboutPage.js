import { Container, Title, Text, Grid, Card, Group, Badge, ThemeIcon } from '@mantine/core';
import { IconCode, IconDatabase, IconServer, IconUsers } from '@tabler/icons-react';

export function AboutPage() {
  return (
    <Container size="lg" py="xl">
      
      {/* 1. Project Intro */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <Title order={1} mb="md">About HeritageHub</Title>
        <Text size="lg" c="dimmed" maw={800} mx="auto">
          HeritageHub is a full-stack web application designed to bridge the gap between 
          modern technology and India's rich history. We provide an interactive platform 
          for virtual tourism, cultural education, and community engagement.
        </Text>
      </div>

      {/* 2. Tech Stack Section */}
      <Title order={2} mb="xl">Our Tech Stack</Title>
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group mb="md">
              <ThemeIcon color="blue" variant="light" size="lg"><IconCode /></ThemeIcon>
              <Text fw={700}>Frontend</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Built with **React.js** for a dynamic user interface, styled with **Mantine** for 
              modern aesthetics, and **Leaflet** for interactive maps.
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group mb="md">
              <ThemeIcon color="green" variant="light" size="lg"><IconServer /></ThemeIcon>
              <Text fw={700}>Backend API</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Powered by **Node.js** and **Express**, providing a secure REST API with 
              JWT authentication and role-based access control.
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group mb="md">
              <ThemeIcon color="grape" variant="light" size="lg"><IconDatabase /></ThemeIcon>
              <Text fw={700}>Database</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Data persisted in **PostgreSQL**, managing complex relationships between 
              Users, Monuments, Reviews, and Tours.
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* 3. Team Section */}
      <Title order={2} mb="xl" mt={60}>The Team</Title>
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Group>
          <ThemeIcon size={50} radius="xl" color="gray" variant="light">
            <IconUsers size={30} />
          </ThemeIcon>
          <div>
            <Text fw={700} size="lg">CSE 2nd Year Project Team</Text>
            <Text c="dimmed">
              We are a team of passionate developers building solutions for cultural preservation.
            </Text>
            <Group mt="md">
              <Badge color="gray">Full Stack</Badge>
              <Badge color="gray">Database Design</Badge>
              <Badge color="gray">UI/UX</Badge>
            </Group>
          </div>
        </Group>
      </Card>

    </Container>
  );
}