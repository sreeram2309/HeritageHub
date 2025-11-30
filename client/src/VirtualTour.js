import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { Modal, Button, Group } from '@mantine/core';
import { useState } from 'react';
import { Icon360 } from '@tabler/icons-react';

export function VirtualTour({ panoUrl, name }) {
  const [opened, setOpened] = useState(false);

  // If there is no panorama link in the database, don't show the button
  if (!panoUrl) return null; 

  return (
    <>
      <Group justify="center" mt="md" mb="xl">
        <Button 
          size="lg" 
          color="grape" 
          radius="md" 
          leftSection={<Icon360 size={20} />}
          onClick={() => setOpened(true)}
          fullWidth
        >
          Start 360° Virtual Tour
        </Button>
      </Group>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`Virtual Tour: ${name}`}
        size="100%"
        fullScreen
        padding={0}
      >
        <div style={{ height: '100vh', width: '100%' }}>
          <ReactPhotoSphereViewer
            src={panoUrl}
            height={'100%'}
            width={"100%"}
            container={""}
          />
        </div>
      </Modal>
    </>
  );
}