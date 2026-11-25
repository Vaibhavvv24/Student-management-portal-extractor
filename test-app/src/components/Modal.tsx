import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Save'
}) => {
  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface-card)',
    borderRadius: 'var(--radius-card)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: '480px',
    maxWidth: '90vw',
    overflow: 'hidden',
    border: '1px solid var(--color-border-default)'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-md) var(--space-lg)',
    borderBottom: '1px solid var(--color-border-default)'
  };

  const bodyStyle: React.CSSProperties = {
    padding: 'var(--space-lg)'
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: 'var(--space-md) var(--space-lg)',
    backgroundColor: 'var(--color-surface-muted)',
    borderTop: '1px solid var(--color-border-default)'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        data-design-component="Modal"
        data-design-id="c-modal"
        data-design-hint="modal"
        data-design-name="Modal"
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={headerStyle}>
          <h2 className="text-h2" style={{ margin: 0, fontSize: '18px' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={bodyStyle}>{children}</div>

        <div style={footerStyle}>
          <Button typeVariant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          {onConfirm && (
            <Button typeVariant="primary" size="sm" onClick={onConfirm}>
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

