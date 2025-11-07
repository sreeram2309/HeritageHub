import { Container, Group, Button, Text } from '@mantine/core';
import classes from './Header.module.css';

export function Header() {
  return (
    <header className={classes.header}>
      {/* This Container component just provides the padding and max-width */}
      <Container size="md">
        {/* This div *inside* the container handles the flex layout */}
        <div className={classes.inner}>
          <Text size="xl" fw={700} c="blue">
            HeritageHub
          </Text>
          <Group gap={5}>
            <Button variant="default">Log in</Button>
            <Button>Register</Button>
          </Group>
        </div>
      </Container>
    </header>
  );
}