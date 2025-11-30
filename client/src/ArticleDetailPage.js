import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Title, Text, Image, Loader, Alert, Group, Avatar, Button } from '@mantine/core';

export function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/articles/${id}`);
        setArticle(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <Container pt={80} ta="center"><Loader size="xl" /></Container>;
  if (!article) return <Container pt={40}><Alert color="red">Article not found</Alert></Container>;

  return (
    <Container size="md" py="xl">
      <Link to="/culture" style={{ textDecoration: 'none' }}>
        <Button variant="subtle" color="gray" mb="lg">← Back to Cultural Feed</Button>
      </Link>

      <Title order={1} mb="md" style={{ fontSize: '3rem' }}>{article.title}</Title>

      <Group mb="xl">
        <Avatar size="md" radius="xl" color="blue" />
        <div>
            <Text size="sm" fw={500}>By {article.author_name || 'Contributor'}</Text>
            <Text size="xs" c="dimmed">Posted on {new Date(article.created_at).toLocaleDateString()}</Text>
        </div>
      </Group>
      
      <Image
        src={article.image_url}
        alt={article.title}
        radius="md"
        mb="xl"
        height={400}
        fit="cover"
      />

      <Text size="lg" lh={1.8} style={{ whiteSpace: 'pre-line' }}>
        {article.content}
      </Text>
    </Container>
  );
}