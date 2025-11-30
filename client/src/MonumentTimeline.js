import { useState, useEffect } from 'react';
import axios from 'axios';
import { Timeline, Text, Title, Paper, ThemeIcon } from '@mantine/core';

export function MonumentTimeline({ monumentId }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/monuments/${monumentId}/timeline`);
        setEvents(res.data);
      } catch (error) {
        console.error('Error fetching timeline:', error);
      }
    };

    fetchTimeline();
  }, [monumentId]);

  if (events.length === 0) return null; // Don't show anything if no history exists

  return (
    <Paper shadow="xs" radius="md" p="xl" withBorder mt="xl">
      <Title order={3} mb="xl">Key Historical Events</Title>
      
      <Timeline active={events.length} bulletSize={24} lineWidth={2}>
        {events.map((event) => (
          <Timeline.Item key={event.id} title={event.event_year}>
            <Text c="dimmed" size="sm">{event.event_title}</Text>
            <Text size="sm" mt={4}>{event.event_description}</Text>
          </Timeline.Item>
        ))}
      </Timeline>
    </Paper>
  );
}