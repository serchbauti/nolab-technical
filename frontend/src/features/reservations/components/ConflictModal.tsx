import React from 'react';
import { formatDisplay } from '../../../lib/time';
import type { NextAvailableDTO } from '../../../lib/api';

type Props = {
  open: boolean;
  suggestion?: NextAvailableDTO;
  onAccept: () => void;
  onClose: () => void;
};

export default function ConflictModal({ open, suggestion, onAccept, onClose }: Props) {
  if (!open || !suggestion) return null;
  return (
    <div style={backdrop}>
      <div style={modal}>
        <h3 style={{ marginTop: 0 }}>Horario no disponible</h3>
        <p>
          Sugerencia del sistema:<br />
          <b>{formatDisplay(suggestion.startTime, suggestion.timezone)}</b> → <b>{formatDisplay(suggestion.endTime, suggestion.timezone)}</b><br />
          <small>{suggestion.timezone}</small>
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={onAccept}>Usar sugerencia</button>
        </div>
      </div>
    </div>
  );
}

const backdrop: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000
};

const modal: React.CSSProperties = {
  background: '#fff', padding: 16, borderRadius: 8, minWidth: 320, boxShadow: '0 10px 30px rgba(0,0,0,.2)'
};
