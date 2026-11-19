import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = '500px' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="pos-modal-overlay" onClick={onClose}>
      <div
        className="pos-modal-container"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pos-modal-header">
          <h3 className="pos-modal-title">{title}</h3>
          <button className="pos-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="pos-modal-body">{children}</div>

        {footer && <div className="pos-modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
