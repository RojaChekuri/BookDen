import React from 'react';
import {
    Banner,
    BannerCloseButton,
    BannerContent,
    BannerIcon,
    Typography,
} from '@visa/nova-react';
import { BannerToastProps } from '../types/libraryTypes';

export const BannerToast: React.FC<BannerToastProps> = ({ message, type, onClose }) => (
    <Banner messageType={type} style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, maxWidth: 600 }}>
        <BannerIcon />
        <BannerContent className="v-pl-2 v-pb-2">
            <Typography>{message}</Typography>
        </BannerContent>
        <BannerCloseButton onClick={onClose} />
    </Banner>
);