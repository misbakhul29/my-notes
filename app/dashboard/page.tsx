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
import { useLanguage } from '../context/LanguageContext';
import { useSession, signOut } from 'next-auth/react'; // Pastikan useSession diimpor

interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Dapatkan status sesi juga
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
  const { t } = useLanguage();

  // Panggil fetchNotes hanya jika sesi sudah dimuat dan ada token
  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchNotes();
    } else if (status === 'unauthenticated') {
      // Jika tidak terotentikasi, arahkan ke halaman login
      console.log('tidak terotentikasi');
      router.push('/login');
    }
  }, [status, session, router]); // Tambahkan session dan status sebagai dependency

  const fetchNotes = async () => {
    if (!session?.accessToken) {
      // Jika tidak ada token, jangan lanjutkan
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://notes-api.dicoding.dev/v1/notes', {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`, // Gunakan session.accessToken
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        setNotes(data.data);
      } else {
        notifications.show({
          title: t('auth.error'),
          message: data.message || t('notes.fetchError'),
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      notifications.show({
        title: t('auth.error'),
        message: t('notes.fetchError'),
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
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
    if (!session?.accessToken) {
      notifications.show({
        title: t('auth.error'),
        message: t('notes.noAuthToken'),
        color: 'red',
      });
      return;
    }

    try {
      const response = await fetch(`https://notes-api.dicoding.dev/v1/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`, // Gunakan session.accessToken
        },
      });

      const responseData = await response.json(); // Parse respons untuk pesan kesalahan
      if (response.ok && responseData.status === 'success') {
        notifications.show({
          title: t('auth.success'),
          message: t('notes.deleteSuccess'),
          color: 'green',
        });
        fetchNotes();
      } else {
        notifications.show({
          title: t('auth.error'),
          message: responseData.message || t('notes.deleteError'),
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      notifications.show({
        title: t('auth.error'),
        message: t('notes.deleteError'),
        color: 'red',
      });
    }
  };

  const handleSubmit = async () => {
    if (!session?.accessToken) {
      notifications.show({
        title: t('auth.error'),
        message: t('notes.noAuthToken'),
        color: 'red',
      });
      return;
    }

    try {
      const url = editingNote
        ? `https://notes-api.dicoding.dev/v1/notes/${editingNote.id}`
        : 'https://notes-api.dicoding.dev/v1/notes';

      const response = await fetch(url, {
        method: editingNote ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`, // Gunakan session.accessToken
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json(); // Parse respons untuk pesan kesalahan
      if (response.ok && responseData.status === 'success') {
        notifications.show({
          title: t('auth.success'),
          message: editingNote ? t('notes.updateSuccess') : t('notes.createSuccess'),
          color: 'green',
        });
        setIsModalOpen(false);
        fetchNotes();
      } else {
        notifications.show({
          title: t('auth.error'),
          message: responseData.message || (editingNote ? t('notes.updateError') : t('notes.createError')),
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Error submitting note:', error);
      notifications.show({
        title: t('auth.error'),
        message: editingNote ? t('notes.updateError') : t('notes.createError'),
        color: 'red',
      });
    }
  };

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>{t('app.title')}</Title>
        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleAddNote}
          >
            {t('notes.add')}
          </Button>
          <Button variant="outline" color="red" onClick={handleLogout}>
            {t('auth.logout')}
          </Button>
        </Group>
      </Group>

      {/* Tampilkan LoadingOverlay sampai sesi dimuat */}
      <LoadingOverlay visible={isLoading || status === 'loading'} />

      <Grid>
        {notes.map((note) => (
          <Grid.Col key={note.id} span={{ base: 12, sm: 6, md: 4 }}> {/* Sesuaikan ukuran kolom untuk responsif */}
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
                      title={t('notes.edit')}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDeleteNote(note.id)}
                      title={t('notes.delete')}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
                <Text size="sm" c="dimmed" lineClamp={3}>
                  {note.body}
                </Text>
                <Text size="xs" c="dimmed">
                  {t('notes.created')}: {new Date(note.createdAt).toLocaleDateString()}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Modal Add/Edit Note */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNote ? t('notes.edit') : t('notes.add')}
        primaryButton={{
          text: editingNote ? t('notes.update') : t('notes.create'),
          onClick: handleSubmit,
        }}
        secondaryButton={{
          text: t('notes.cancel'),
          onClick: () => setIsModalOpen(false),
        }}
      >
        <Stack>
          <TextInput
            label={t('notes.title')}
            placeholder={t('notes.title')}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Textarea
            label={t('notes.content')}
            placeholder={t('notes.content')}
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            minRows={4}
            required
          />
        </Stack>
      </Modal>

      {/* Modal View Note */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedNote?.title || ''}
        primaryButton={{
          text: t('notes.edit'),
          onClick: () => selectedNote && handleEditNote(selectedNote),
        }}
        secondaryButton={{
          text: t('notes.close'),
          onClick: () => setIsViewModalOpen(false),
        }}
      >
        <Stack>
          <Text size="sm" c="dimmed" style={{ textAlign: 'justify', whiteSpace: 'pre-wrap' }}>
            {selectedNote?.body}
          </Text>
          <Text size="xs" c="dimmed">
            {t('notes.created')}: {selectedNote && new Date(selectedNote.createdAt).toLocaleString()}
          </Text>
        </Stack>
      </Modal>
    </Container>
  );
}