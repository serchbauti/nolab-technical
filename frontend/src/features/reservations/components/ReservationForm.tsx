// ...imports arriba iguales
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ReservationFormSchema,
  type ReservationFormValues,
  type TZType
} from '../types';
import { localToUTCLiteral } from '../../../lib/time';
import { useReservations } from '../hooks/useReservations';
import type { HttpError } from '../../../lib/api';

type Props = {
  onConflict: (suggestion: { startTime: string; endTime: string; timezone: TZType }) => void;
};

const TZ_OPTIONS: TZType[] = ['America/New_York','Asia/Tokyo','America/Mexico_City'];

export default function ReservationForm({ onConflict }: Props) {
  const { createMutation } = useReservations();

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(ReservationFormSchema),
    defaultValues: {
      priority: 'normal',
      projector: false,
      capacity: 2,
      timezone: guessTZ(),
      startTime: '',
      endTime: ''
    }
  });

  async function onSubmit(values: ReservationFormValues) {
    try {
      if (!values.startTime || !values.endTime) {
        throw { status: 400, body: { message: 'Falta fecha/hora de inicio o fin' } } as HttpError;
      }

      // Los campos datetime-local se interpretan en la zona horaria seleccionada
      // Los convertimos a UTC literal usando la función correcta
      const startISO = localToUTCLiteral(values.startTime, values.timezone);
      const endISO = localToUTCLiteral(values.endTime, values.timezone);

      await createMutation.mutateAsync({
        startTime: startISO,
        endTime: endISO,
        priority: values.priority,
        resources: { projector: values.projector, capacity: values.capacity },
        timezone: values.timezone
      });

      form.reset({ ...form.getValues(), startTime: '', endTime: '' });
      alert('Reserva creada');
    } catch (e) {
      const err = e as HttpError;
      if (err.status === 409 && err.body?.suggestion) {
        onConflict(err.body.suggestion);
        return;
      }
      const msg = err.body?.message ?? `Error ${err.status}`;
      alert(`No se pudo crear la reserva: ${msg}`);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} style={card}>
      <h3 style={{ marginTop: 0 }}>Crear reserva</h3>

      {/* Fecha/hora de inicio */}
      <label>Start date & time</label>
      <input type="datetime-local" step="900" {...form.register('startTime')} />

      {/* Fecha/hora de fin */}
      <label>End date & time</label>
      <input type="datetime-local" step="900" {...form.register('endTime')} />

      {/* El resto igual */}
      <label>Priority</label>
      <select {...form.register('priority')}>
        <option value="normal">normal</option>
        <option value="high">high</option>
      </select>

      <label>
        <input type="checkbox" {...form.register('projector')} /> Projector
      </label>

      <label>Capacity (1–8)</label>
      <input type="number" min={1} max={8} {...form.register('capacity', { valueAsNumber: true })} />

      <label>Timezone</label>
      <select {...form.register('timezone')}>
        {TZ_OPTIONS.map(tz => <option key={tz} value={tz}>{tz}</option>)}
      </select>

      {form.formState.errors && (
        <div style={{ color: 'crimson' }}>
          {Object.values(form.formState.errors).length > 0 && 'Revisa los campos'}
        </div>
      )}

      <button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creando...' : 'Crear'}
      </button>
    </form>
  );
}

function guessTZ(): TZType {
  const map: Record<string, TZType> = {
    'America/New_York': 'America/New_York',
    'Asia/Tokyo': 'Asia/Tokyo',
    'America/Mexico_City': 'America/Mexico_City'
  };
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return map[tz] ?? 'America/Mexico_City';
}

const card: React.CSSProperties = {
  display: 'grid',
  gap: 8,
  background: '#fff',
  padding: 12,
  borderRadius: 8,
  boxShadow: '0 2px 10px rgba(0,0,0,.06)',
  maxWidth: 420
};
