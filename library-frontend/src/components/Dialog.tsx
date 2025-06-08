import React from 'react';
import {
  Button,
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  Typography,
  useFocusTrap,
  Utility,
} from '@visa/nova-react';
import { ConfirmDialogProps } from '../types/libraryTypes';

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  id,
  title,
  description,
  open,
  onConfirm,
  onCancel,
}) => {
  const { onKeyNavigation, ref } = useFocusTrap();

  React.useEffect(() => {
    if (open) {
      if (ref.current?.showModal) {
        ref.current.showModal();
      }
    } else {
      if (ref.current?.close) {
        ref.current.close();
      }
    }
  }, [open, ref]);

  return (
    <Dialog
      aria-describedby={`${id}-description`}
      aria-labelledby={`${id}-title`}
      id={id}
      ref={ref}
      onKeyDown={(e) => onKeyNavigation(e, ref.current?.open)}
    >
      <DialogContent className="confirm-dialog__content">
        <DialogHeader id={`${id}-title`} className="confirm-dialog__header">
          {title}
        </DialogHeader>
        <Typography id={`${id}-description`} className="confirm-dialog__description">
          {description}
        </Typography>
        <Utility vFlex vFlexRow vGap={12} className="confirm-dialog__button-row">
          <Button onClick={onConfirm} className="confirm-dialog__button">
            Yes, delete
          </Button>
          <Button colorScheme="secondary" onClick={onCancel} className="confirm-dialog__button">
            Cancel
          </Button>
        </Utility>
      </DialogContent>
      <DialogCloseButton onClick={onCancel} />
    </Dialog>
  );
};