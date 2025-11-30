import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, Image, Text, Button, Group, Title, Avatar } from '@mantine/core';
import { Link } from 'react-router-dom';

export function CulturePage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('https://heritagehub-server.onrender.com/api/articles');
        setArticles(res.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, []);

  return (
    <Container py="xl" size="lg">
      {/* UPDATED TITLE HERE */}
      <Title align="center" mb="xl">Cultural Feed</Title>
      
      {articles.length === 0 && (
        <Text align="center" c="dimmed">No stories yet. Be the first to write one!</Text>
      )}

      <Grid>
        {articles.map((article) => (
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={article.id}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section>
                <Image
                  src={article.image_url}
                  height={200}
                  alt={article.title}
                />
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={700} lineClamp={1}>{article.title}</Text>
              </Group>

              <Group gap="xs" mb="md">
                <Avatar size="sm" radius="xl" color="blue" />
                <Text size="xs" c="dimmed">By {article.author_name || 'Contributor'}</Text>
                <Text size="xs" c="dimmed">•</Text>
                <Text size="xs" c="dimmed">{new Date(article.created_at).toLocaleDateString()}</Text>
              </Group>

              <Text size="sm" c="dimmed" lineClamp={3} mb="md">
                {article.content}
              </Text>

              <Link to={`/article/${article.id}`} style={{ textDecoration: 'none' }}>
                <Button variant="light" color="grape" fullWidth radius="md">
                  Read Story
                </Button>
              </Link>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}