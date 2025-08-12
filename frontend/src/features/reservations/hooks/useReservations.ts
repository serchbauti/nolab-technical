import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, type CreateReservationDTO, type ReservationDTO } from '../../../lib/api';

export function useReservations() {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['reservations'],
    queryFn: api.getReservations,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateReservationDTO) => api.createReservation(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  });

  return { listQuery, createMutation };
}
