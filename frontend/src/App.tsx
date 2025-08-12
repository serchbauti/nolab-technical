import React, { useState } from 'react';
import ReservationForm from './features/reservations/components/ReservationForm';
import ReservationList from './features/reservations/components/ReservationList';
import ConflictModal from './features/reservations/components/ConflictModal';
import type { TZ } from './lib/api';

export default function App() {
  const [suggestion, setSuggestion] = useState<{ startTime: string; endTime: string; timezone: TZ }>();
  const [open, setOpen] = useState(false);

  return (
    <div style={page}>
      <h2>Sala de Reuniones</h2>
      <div style={grid}>
        <ReservationForm
          onConflict={(sug) => { setSuggestion(sug); setOpen(true); }}
        />
        <ReservationList />
      </div>

      <ConflictModal
        open={open}
        suggestion={suggestion}
        onClose={() => setOpen(false)}
        onAccept={() => {
          // Redirects to the /next-available endpoint already suggested: you could auto-populate the form
          // To keep it simple, we just close; the user can retry with the suggested data
          setOpen(false);
        }}
      />
    </div>
  );
}

const page: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f6f7fb',
  color: '#111',
  padding: 16
};
const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '420px 1fr',
  gap: 16,
  alignItems: 'start'
};
