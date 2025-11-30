import { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Title, Button, Group, Text, TextInput, Modal, Table, Badge, List, ThemeIcon } from '@mantine/core';
import { IconTicket, IconUsers, IconUser } from '@tabler/icons-react';

export function UpcomingTours({ monumentId }) {
  const [tours, setTours] = useState([]);
  const [opened, setOpened] = useState(false); // Add Tour Modal
  const [attendeeModal, setAttendeeModal] = useState(false); // View Attendees Modal
  const [attendees, setAttendees] = useState([]); // List of people for a specific tour
  
  // Form State
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [link, setLink] = useState('');

  // User Info
  const userRole = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const isGuide = userRole === 'Tour Guide' || userRole === 'Admin';

  const fetchTours = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/monuments/${monumentId}/tours`);
      setTours(res.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [monumentId]);

  const handleSchedule = async () => {
    try {
      await axios.post('http://localhost:5001/api/tours', {
        monument_id: monumentId,
        guide_id: userId,
        tour_date: date,
        tour_time: time,
        meeting_link: link
      });
      alert('Tour Scheduled!');
      setOpened(false);
      fetchTours();
    } catch (error) {
      alert('Failed to schedule tour');
    }
  };

  const handleBook = async (tourId) => {
    if (!userId) return alert("Please log in to book a ticket.");
    try {
      await axios.post(`http://localhost:5001/api/tours/${tourId}/book`, { user_id: userId });
      alert('Ticket Booked! See you there.');
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed');
    }
  };

  const viewAttendees = async (tourId) => {
    try {
        const res = await axios.get(`http://localhost:5001/api/tours/${tourId}/attendees`);
        setAttendees(res.data);
        setAttendeeModal(true);
    } catch (error) {
        alert('Could not fetch guest list');
    }
  };

  return (
    <Paper shadow="xs" p="xl" withBorder mt="xl">
      <Group justify="space-between" mb="lg">
        <Title order={3}>Upcoming Live Tours</Title>
        {isGuide && (
          <Button onClick={() => setOpened(true)} color="orange" variant="light">
            + Schedule Tour
          </Button>
        )}
      </Group>

      {tours.length === 0 ? (
        <Text c="dimmed">No live tours scheduled yet.</Text>
      ) : (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date & Time</Table.Th>
              <Table.Th>Guide</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tours.map((tour) => (
              <Table.Tr key={tour.id}>
                <Table.Td>
                    <Text size="sm" fw={500}>{new Date(tour.tour_date).toLocaleDateString()}</Text>
                    <Text size="xs" c="dimmed">{tour.tour_time}</Text>
                </Table.Td>
                <Table.Td>{tour.guide_name}</Table.Td>
                <Table.Td>
                  {isGuide ? (
                    // GUIDE VIEW: See who is coming
                    <Button 
                        color="cyan" 
                        size="xs" 
                        variant="light"
                        leftSection={<IconUsers size={14} />}
                        onClick={() => viewAttendees(tour.id)}
                    >
                        Guest List
                    </Button>
                  ) : (
                    // USER VIEW: Book Ticket
                    <Button 
                        color="blue" 
                        size="xs" 
                        leftSection={<IconTicket size={14} />}
                        onClick={() => handleBook(tour.id)}
                    >
                        Book Ticket
                    </Button>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      {/* --- MODAL: GUIDE SCHEDULES TOUR --- */}
      <Modal opened={opened} onClose={() => setOpened(false)} title="Schedule a Live Tour">
        <TextInput label="Date" type="date" mb="sm" required onChange={(e) => setDate(e.target.value)} />
        <TextInput label="Time" type="time" mb="sm" required onChange={(e) => setTime(e.target.value)} />
        <TextInput label="Meeting Link" placeholder="Google Meet / Zoom URL" mb="lg" required onChange={(e) => setLink(e.target.value)} />
        <Button fullWidth onClick={handleSchedule}>Confirm Schedule</Button>
      </Modal>

      {/* --- MODAL: GUIDE SEES GUEST LIST --- */}
      <Modal opened={attendeeModal} onClose={() => setAttendeeModal(false)} title="Guest List">
        {attendees.length === 0 ? <Text c="dimmed">No bookings yet.</Text> : (
            <List spacing="xs" size="sm" center>
                {attendees.map((person, index) => (
                    <List.Item
                        key={index}
                        icon={
                            <ThemeIcon color="blue" size={24} radius="xl">
                                <IconUser size={16} />
                            </ThemeIcon>
                        }
                    >
                        <Text fw={500}>{person.username}</Text>
                        <Text size="xs" c="dimmed">{person.email}</Text>
                    </List.Item>
                ))}
            </List>
        )}
      </Modal>
    </Paper>
  );
}