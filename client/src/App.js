import { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom';
import { Container, Title, Text, Button, Group, Grid, Card, Image, Badge, Avatar } from '@mantine/core';
import { Header } from './Header';
import { Footer } from './Footer';       // <--- NEW IMPORT
import { AboutPage } from './AboutPage'; // <--- NEW IMPORT
import { ExplorePage } from './ExplorePage';
import { MonumentDetailPage } from './MonumentDetailPage';
import { AddMonument } from './AddMonument';
import { EditMonument } from './EditMonument';
import { Login } from './Login';
import Register from './Register';
import { WriteArticle } from './WriteArticle';
import { CulturePage } from './CulturePage';
import { ArticleDetailPage } from './ArticleDetailPage';
import { UserProfile } from './UserProfile';
import { AdminDashboard } from './AdminDashboard';

function HomePage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/articles');
        setArticles(res.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, []);

  return (
    <>
      {/* HERO SECTION - CLEAN VERSION (No Learn More) */}
      <Container size="lg" style={{ paddingTop: '120px', paddingBottom: '80px', textAlign: 'center' }}>
        <Title
          order={1}
          style={{
            fontSize: '60px',
            fontWeight: 900,
            letterSpacing: '-1px',
          }}
        >
          Welcome to <span style={{ color: '#228be6' }}>HeritageHub</span>
        </Title>
        
        <Text color="dimmed" size="lg" style={{ marginTop: '20px', maxWidth: '600px', margin: 'auto' }}>
          Explore India's timeless wonders. Discover historical sites, 
          explore rich cultural heritage, and take immersive virtual tours 
          from the comfort of your home.
        </Text>

        <Group justify="center" align="center" style={{ marginTop: '30px' }}>
          <Button 
            component={Link} 
            to="/explore" 
            size="xl" 
            radius="md"
          >
            Start Exploring
          </Button>
        </Group>
      </Container>

      {/* LATEST STORIES SECTION */}
      {articles.length > 0 && (
        <Container size="lg" py="xl" style={{ borderTop: '1px solid #eee' }}>
          <Group justify="space-between" mb="xl">
            <Title order={2}>Latest Stories</Title>
            <Link to="/culture" style={{ textDecoration: 'none' }}>
              <Button variant="subtle">View All Stories →</Button>
            </Link>
          </Group>

          <Grid>
            {articles.slice(0, 3).map((article) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={article.id}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    <Image
                      src={article.image_url}
                      height={160}
                      alt={article.title}
                    />
                  </Card.Section>

                  <Text fw={700} mt="md" lineClamp={1}>
                    {article.title}
                  </Text>

                  <Group gap="xs" mb="xs" mt="xs">
                    <Text size="xs" c="dimmed">By {article.author_name || 'Contributor'}</Text>
                    <Text size="xs" c="dimmed">•</Text>
                    <Text size="xs" c="dimmed">{new Date(article.created_at).toLocaleDateString()}</Text>
                  </Group>

                  <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                    {article.content}
                  </Text>

                  <Link to={`/article/${article.id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="light" color="grape" fullWidth radius="md" size="xs">
                      Read Story
                    </Button>
                  </Link>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      )}
    </>
  );
}

function App() {
  return (
    // FLEX LAYOUT: Keeps the Footer at the bottom
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} /> {/* <--- NEW ROUTE */}
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/monument/:id" element={<MonumentDetailPage />} />
          <Route path="/add-monument" element={<AddMonument />} />
          <Route path="/edit-monument/:id" element={<EditMonument />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/write-article" element={<WriteArticle />} />
          <Route path="/culture" element={<CulturePage />} />
          <Route path="/article/:id" element={<ArticleDetailPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>

      <Footer /> {/* <--- FOOTER ADDED HERE */}
    </div>
  );
}

export default App;