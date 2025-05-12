'use client';

import { Modal as MantineModal, Stack, Group, Button, Text } from '@mantine/core';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    primaryButton?: {
        text: string;
        onClick: () => void;
        loading?: boolean;
    };
    secondaryButton?: {
        text: string;
        onClick: () => void;
    };
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    primaryButton,
    secondaryButton,
    size = 'md',
}: ModalProps) {
    return (
        <MantineModal
            opened={isOpen}
            onClose={onClose}
            title={<Text fw={500}>{title}</Text>}
            size={size}
            centered
        >
            <Stack>
                {children}
                {(primaryButton || secondaryButton) && (
                    <Group justify="flex-end" mt="md">
                        {secondaryButton && (
                            <Button variant="outline" onClick={secondaryButton.onClick}>
                                {secondaryButton.text}
                            </Button>
                        )}
                        {primaryButton && (
                            <Button
                                onClick={primaryButton.onClick}
                                loading={primaryButton.loading}
                            >
                                {primaryButton.text}
                            </Button>
                        )}
                    </Group>
                )}
            </Stack>
        </MantineModal>
    );
} 