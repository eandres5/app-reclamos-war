export enum TipoReclamo {
  TARJETAS_CREDITO = 'TARJETAS_CREDITO',
  TRANSFERENCIAS = 'TRANSFERENCIAS',
  PAGO_SERVICIOS = 'PAGO_SERVICIOS',
}

export const TIPO_RECLAMO_LABELS: Record<TipoReclamo, string> = {
  [TipoReclamo.TARJETAS_CREDITO]: 'Tarjetas de Crédito',
  [TipoReclamo.TRANSFERENCIAS]: 'Transferencias',
  [TipoReclamo.PAGO_SERVICIOS]: 'Pago de Servicios',
};

export interface ReclamoRequest {
  identificacionCliente: string;
  tipoReclamo: TipoReclamo;
  detalleReclamo: string;
}

export interface ReclamoResponse {
  id: number;
  identificacionCliente: string;
  nombresCliente: string;
  apellidosCliente: string;
  tipoReclamo: TipoReclamo;
  detalleReclamo: string;
  fechaCreacion: string;
}