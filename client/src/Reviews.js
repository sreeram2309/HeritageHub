import { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Text, Group, Avatar, Textarea, Button, Rating, Title, Divider } from '@mantine/core';

export function Reviews({ monumentId }) {
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  
  // Get user info from storage
  const userId = localStorage.getItem('userId');
  const isLoggedIn = !!userId;

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/monuments/${monumentId}/reviews`);
      setReviews(res.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [monumentId]);

  const handleSubmit = async () => {
    if (!newRating) return alert('Please select a rating');
    
    try {
      await axios.post(`http://localhost:5001/api/monuments/${monumentId}/reviews`, {
        rating: newRating,
        comment: newComment,
        user_id: userId
      });
      
      // Reset form and reload reviews
      setNewRating(0);
      setNewComment('');
      fetchReviews();
    } catch (error) {
      console.error(error);
      alert('Failed to post review');
    }
  };

  return (
    <Paper shadow="xs" radius="md" p="xl" withBorder mt="xl">
      <Title order={3} mb="md">Visitor Reviews</Title>

      {/* Review Submission Form */}
      {isLoggedIn ? (
        <div style={{ marginBottom: '30px' }}>
          <Text fw={500} mb="xs">Leave a review</Text>
          <Rating value={newRating} onChange={setNewRating} size="lg" mb="sm" />
          <Textarea
            placeholder="Share your experience..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            minRows={3}
            mb="sm"
          />
          <Button onClick={handleSubmit}>Post Review</Button>
        </div>
      ) : (
        <Text c="dimmed" mb="xl">Please log in to leave a review.</Text>
      )}

      <Divider my="lg" />

      {/* List of Reviews */}
      {reviews.length === 0 && <Text c="dimmed">No reviews yet. Be the first!</Text>}
      
      {reviews.map((review) => (
        <div key={review.id} style={{ marginBottom: '20px' }}>
          <Group>
            <Avatar radius="xl" color="blue">{review.username?.[0]?.toUpperCase()}</Avatar>
            <div>
              <Text size="sm" fw={500}>{review.username}</Text>
              <Rating value={review.rating} readOnly size="sm" />
            </div>
          </Group>
          <Text pl={54} pt="sm" size="sm">
            {review.comment}
          </Text>
        </div>
      ))}
    </Paper>
  );
}