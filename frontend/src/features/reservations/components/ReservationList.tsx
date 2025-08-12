import React from 'react';
import { useReservations } from '../hooks/useReservations';
import { formatDisplay } from '../../../lib/time';

export default function ReservationList() {
  const { listQuery } = useReservations();

  if (listQuery.isLoading) return <p>Cargando reservas…</p>;
  if (listQuery.isError) return <p>Error al cargar</p>;
  const data = listQuery.data ?? [];

  return (
    <div style={card}>
      <h3 style={{ marginTop: 0 }}>Reservas</h3>
      {data.length === 0 ? <p>Sin reservas</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Inicio</th>
              <th style={th}>Fin</th>
              <th style={th}>Prioridad</th>
              <th style={th}>Projector</th>
              <th style={th}>Capacidad</th>
              <th style={th}>TZ</th>
            </tr>
          </thead>
          <tbody>
            {data.map(r => (
              <tr key={r.id}>
                <td style={td}>{formatDisplay(r.startTime, r.timezone)}</td>
                <td style={td}>{formatDisplay(r.endTime, r.timezone)}</td>
                <td style={td}>{r.priority}</td>
                <td style={td}>{r.resources.projector ? 'Sí' : 'No'}</td>
                <td style={td}>{r.resources.capacity}</td>
                <td style={td}>{r.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = { textAlign: 'left', borderBottom: '1px solid #eee', padding: '6px 4px' };
const td: React.CSSProperties = { borderBottom: '1px solid #f5f5f5', padding: '6px 4px' };

const card: React.CSSProperties = {
  background: '#fff',
  padding: 12,
  borderRadius: 8,
  boxShadow: '0 2px 10px rgba(0,0,0,.06)'
};
