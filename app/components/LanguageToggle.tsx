'use client';

import { ActionIcon } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import { useLanguage } from '../context/LanguageContext';
import classes from './LanguageToggle.module.css';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <ActionIcon
      variant="outline"
      color="blue"
      onClick={toggleLanguage}
      title={language === 'en' ? 'Switch to Indonesian' : 'Switch to English'}
      className={classes.languageToggle}
    >
      <IconLanguage size={18} />
      <span className={classes.languageText}>
        {language === 'en' ? 'ID' : 'EN'}
      </span>
    </ActionIcon>
  );
} 