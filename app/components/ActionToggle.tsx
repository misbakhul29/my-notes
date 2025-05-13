'use client';

import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { useTheme } from '../context/ThemeContext';
import classes from './ActionToggle.module.css';

export function ActionToggle() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { toggleTheme } = useTheme();

    const handleToggle = () => {
        toggleColorScheme();
        toggleTheme();
    };

    return (
        <ActionIcon
            variant="outline"
            color={colorScheme === 'dark' ? 'yellow' : 'blue'}
            onClick={handleToggle}
            title="Toggle color scheme"
            className={classes.actionToggle}
        >
            {colorScheme === 'dark' ? (
                <IconSun size={18} />
            ) : (
                <IconMoonStars size={18} />
            )}
        </ActionIcon>
    );
}