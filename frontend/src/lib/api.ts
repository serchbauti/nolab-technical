export type HttpError = {
    status: number;
    body?: any;
  };
  
  const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
  
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      ...init,
    });
    if (!res.ok) {
      let body: any = undefined;
      try { body = await res.json(); } catch {}
      const err: HttpError = { status: res.status, body };
      throw err;
    }
    return res.json() as Promise<T>;
  }
  
  export const api = {
    getReservations: () => request<ReservationDTO[]>('/reservations'),
    createReservation: (payload: CreateReservationDTO) =>
      request<ReservationDTO>('/reservations', { method: 'POST', body: JSON.stringify(payload) }),
    nextAvailable: (params: { startTime: string; timezone: TZ }) =>
      request<NextAvailableDTO>(`/next-available?startTime=${encodeURIComponent(params.startTime)}&timezone=${encodeURIComponent(params.timezone)}`),
  };
  
  // Tipos compartidos con el feature
  export type TZ = 'America/New_York' | 'Asia/Tokyo' | 'America/Mexico_City';
  
  export type CreateReservationDTO = {
    startTime: string;
    endTime: string;
    priority: 'high' | 'normal';
    resources: { projector: boolean; capacity: number };
    timezone: TZ;
  };
  
  export type ReservationDTO = CreateReservationDTO & { id: string };
  
  export type NextAvailableDTO = {
    startTime: string;
    endTime: string;
    timezone: TZ;
  };
  