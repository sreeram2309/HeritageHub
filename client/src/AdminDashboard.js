import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Title, Table, Select, Button, Group, Badge, Paper } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  
  // Security Check: Kick them out if they aren't an Admin
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'Admin') {
      alert("Access Denied: Admins Only");
      navigate('/');
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://heritagehub-server.onrender.com/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`https://heritagehub-server.onrender.com/api/users/${userId}/role`, { role: newRole });
      fetchUsers(); // Refresh the list
    } catch (error) {
      alert('Failed to update role');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure? This will delete the user and all their content.')) {
      try {
        await axios.delete(`https://heritagehub-server.onrender.com/api/users/${userId}`);
        fetchUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  return (
    <Container size="lg" py="xl">
      <Title align="center" mb="xl">Admin User Management</Title>
      
      <Paper shadow="xs" p="md" withBorder>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Username</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Current Role</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>{user.id}</Table.Td>
                <Table.Td fw={500}>{user.username}</Table.Td>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>
                  {/* Dropdown to Change Role */}
                  <Select 
                    value={user.role}
                    data={['User', 'Tour Guide', 'Content Creator', 'Admin']}
                    onChange={(val) => handleRoleChange(user.id, val)}
                    size="xs"
                    w={150}
                  />
                </Table.Td>
                <Table.Td>
                  <Button color="red" size="xs" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Container>
  );
}