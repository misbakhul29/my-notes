'use client';

import { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import classes from './Modal.module.css';

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
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    primaryButton,
    secondaryButton,
}: ModalProps) {
    const { t } = useLanguage();

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={classes.overlay} onClick={handleOverlayClick}>
            <div className={classes.modal}>
                <div className={classes.header}>
                    <h2>{title}</h2>
                    <button onClick={onClose} aria-label={t('common.close')}>
                        ×
                    </button>
                </div>
                <div className={classes.content}>{children}</div>
                {(primaryButton || secondaryButton) && (
                    <div className={classes.footer}>
                        {secondaryButton && (
                            <button
                                className={classes.secondaryButton}
                                onClick={secondaryButton.onClick}
                                type="button"
                            >
                                {secondaryButton.text}
                            </button>
                        )}
                        {primaryButton && (
                            <button
                                className={classes.primaryButton}
                                onClick={primaryButton.onClick}
                                disabled={primaryButton.loading}
                                type="button"
                            >
                                {primaryButton.loading ? t('common.loading') : primaryButton.text}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 