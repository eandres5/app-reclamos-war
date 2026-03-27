import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cliente } from '../../../core/models/cliente.model';
import { ReclamoRequest, ReclamoResponse } from '../../../core/models/reclamo.model';

@Injectable({ providedIn: 'root' })
export class ReclamoService {
  private readonly API_URL = `${environment.apiUrl}`;

  private readonly _clienteConsultado = signal<Cliente | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly clienteConsultado = computed(() => this._clienteConsultado());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());

  readonly clienteEncontrado = computed(() => this._clienteConsultado() !== null);

  constructor(private readonly http: HttpClient) {}

  consultarCliente(identificacion: string): Observable<Cliente> {
    this._loading.set(true);
    this._error.set(null);
    this._clienteConsultado.set(null);

    return this.http.get<Cliente>(`${this.API_URL}/clientes/${identificacion}`).pipe(
      tap((cliente) => {
        this._clienteConsultado.set(cliente);
      }),
      finalize(() => this._loading.set(false)),
    );
  }

  guardarReclamo(reclamo: ReclamoRequest): Observable<ReclamoResponse> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<ReclamoResponse>(`${this.API_URL}/reclamos`, reclamo).pipe(
      finalize(() => this._loading.set(false)),
    );
  }

  limpiarEstado(): void {
    this._clienteConsultado.set(null);
    this._error.set(null);
  }
}
