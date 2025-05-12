'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Button,
  Group,
  Card,
  Text,
  Stack,
  ActionIcon,
  TextInput,
  Textarea,
  LoadingOverlay,
  Grid,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconTrash, IconEdit } from '@tabler/icons-react';
import Modal from '../components/Modal/Modal';

interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchNotes();
  }, [router]);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://notes-api.dicoding.dev/v1/notes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        setNotes(data.data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch notes',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setFormData({ title: '', body: '' });
    setIsModalOpen(true);
  };

  const openNote = (note: Note) => {
    setSelectedNote(note);
    setIsViewModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setFormData({ title: note.title, body: note.body });
    setIsModalOpen(true);
    setIsViewModalOpen(false);
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://notes-api.dicoding.dev/v1/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: 'Note deleted successfully',
          color: 'green',
        });
        fetchNotes();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete note',
        color: 'red',
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = editingNote
        ? `https://notes-api.dicoding.dev/v1/notes/${editingNote.id}`
        : 'https://notes-api.dicoding.dev/v1/notes';

      const response = await fetch(url, {
        method: editingNote ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: `Note ${editingNote ? 'updated' : 'created'} successfully`,
          color: 'green',
        });
        setIsModalOpen(false);
        fetchNotes();
      }
    } catch (error) {
      console.error('Error submitting note:', error);
      notifications.show({
        title: 'Error',
        message: `Failed to ${editingNote ? 'update' : 'create'} note`,
        color: 'red',
      });
    }
  };

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>My Notes</Title>
        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleAddNote}
          >
            Add Note
          </Button>
          <Button variant="outline" color="red" onClick={handleLogout}>
            Logout
          </Button>
        </Group>
      </Group>

      <LoadingOverlay visible={isLoading} />

      <Grid>
        {notes.map((note) => (
          <Grid.Col key={note.id} span={4}>
            <Card
              onClick={() => openNote(note)}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ cursor: 'pointer' }}
            >
              <Stack>
                <Group justify="space-between">
                  <Text fw={500} size="lg" lineClamp={1}>
                    {note.title}
                  </Text>
                  <Group gap="xs" onClick={(e) => e.stopPropagation()}>
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => handleEditNote(note)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
                <Text size="sm" c="dimmed" lineClamp={3}>
                  {note.body}
                </Text>
                <Text size="xs" c="dimmed">
                  {new Date(note.createdAt).toLocaleDateString()}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNote ? 'Edit Note' : 'Add New Note'}
        size="lg"
        primaryButton={{
          text: editingNote ? 'Update' : 'Create',
          onClick: handleSubmit,
        }}
        secondaryButton={{
          text: 'Cancel',
          onClick: () => setIsModalOpen(false),
        }}
      >
        <Stack>
          <TextInput
            label="Title"
            placeholder="Note title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Textarea
            label="Content"
            placeholder="Note content"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            minRows={4}
            required
          />
        </Stack>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedNote?.title || ''}
        size="lg"
        primaryButton={{
          text: 'Edit',
          onClick: () => selectedNote && handleEditNote(selectedNote),
        }}
        secondaryButton={{
          text: 'Close',
          onClick: () => setIsViewModalOpen(false),
        }}
      >
        <Stack>
          <Text size="sm" c="dimmed" style={{ textAlign: 'justify', whiteSpace: 'pre-wrap' }}>
            {selectedNote?.body}
          </Text>
          <Text size="xs" c="dimmed">
            Created: {selectedNote && new Date(selectedNote.createdAt).toLocaleString()}
          </Text>
        </Stack>
      </Modal>
    </Container>
  );
}
