import { Container, Group, Button, Text, Menu, Avatar, ActionIcon, rem } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { IconLogout, IconUser, IconSettings, IconPlus, IconWriting, IconMapPin } from '@tabler/icons-react';
import classes from './Header.module.css';

export function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const role = localStorage.getItem('role'); 

  // Check permissions
  const isAdmin = role === 'Admin';
  const canAddContent = role === 'Admin' || role === 'Tour Guide' || role === 'Content Creator';
  const canWriteArticle = role === 'Admin' || role === 'Content Creator';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className={classes.header}>
      {/* 1. Changed size to 'fluid' for more space */}
      <Container size="fluid" px="md">
        <div className={classes.inner}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Text size="xl" fw={900} variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
              HeritageHub
            </Text>
          </Link>
          
          <Group gap={5}>
            <Link to="/explore">
              <Button variant="subtle">Explore</Button>
            </Link>

            <Link to="/culture">
              <Button variant="subtle">Cultural Feed</Button>
            </Link>

            {/* --- CREATE MENU (For Staff) --- */}
            {canAddContent && (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button variant="light" color="green" rightSection={<IconPlus size={14} />}>
                    Create
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Contribute</Menu.Label>
                  
                  <Link to="/add-monument" style={{ textDecoration: 'none' }}>
                    <Menu.Item leftSection={<IconMapPin size={14} />}>
                      Add Monument
                    </Menu.Item>
                  </Link>

                  {canWriteArticle && (
                    <Link to="/write-article" style={{ textDecoration: 'none' }}>
                      <Menu.Item leftSection={<IconWriting size={14} />}>
                        Write Article
                      </Menu.Item>
                    </Link>
                  )}
                </Menu.Dropdown>
              </Menu>
            )}

            {/* --- USER MENU (Profile, Admin, Logout) --- */}
            {isLoggedIn ? (
              <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                  {/* The Trigger is now a clickable Avatar instead of big buttons */}
                  <ActionIcon variant="transparent" size="lg" radius="xl" style={{ marginLeft: '10px' }}>
                    <Avatar color="blue" radius="xl" />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Account</Menu.Label>
                  
                  <Link to="/profile" style={{ textDecoration: 'none' }}>
                    <Menu.Item leftSection={<IconUser size={14} />}>
                      My Profile
                    </Menu.Item>
                  </Link>

                  {isAdmin && (
                    <Link to="/admin" style={{ textDecoration: 'none' }}>
                      <Menu.Item leftSection={<IconSettings size={14} />}>
                        Admin Panel
                      </Menu.Item>
                    </Link>
                  )}

                  <Menu.Divider />

                  <Menu.Item 
                    color="red" 
                    leftSection={<IconLogout size={14} />} 
                    onClick={handleLogout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              // Login/Register if not logged in
              <Group>
                <Link to="/login">
                  <Button variant="default">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </Group>
            )}
            
          </Group>
        </div>
      </Container>
    </header>
  );
}