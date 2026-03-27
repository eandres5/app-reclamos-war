import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly CLIENTE_KEY = 'auth_cliente';

  // ── Signals (estado reactivo) ──
  private readonly _isAuthenticated = signal<boolean>(this.hasValidToken());
  private readonly _clienteNombre = signal<string>(this.getStoredClienteNombre());

  /** Signals públicos de solo lectura */
  readonly isAuthenticated = computed(() => this._isAuthenticated());
  readonly clienteNombre = computed(() => this._clienteNombre());

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  /**
   * Login con identificación (cédula) y password del cliente.
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        this.storeToken(response.token);
        const nombreCompleto = `${response.nombres} ${response.apellidos}`;
        this.storeClienteNombre(nombreCompleto);
        this._isAuthenticated.set(true);
        this._clienteNombre.set(nombreCompleto);
      }),
    );
  }

  /**
   * Cierra sesión, limpia almacenamiento y redirige al login.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.CLIENTE_KEY);
    this._isAuthenticated.set(false);
    this._clienteNombre.set('');
    this.router.navigate(['/login']);
  }

  /**
   * Retorna el token JWT almacenado.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // ── Métodos privados ──

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private storeClienteNombre(nombre: string): void {
    localStorage.setItem(this.CLIENTE_KEY, nombre);
  }

  private getStoredClienteNombre(): string {
    return localStorage.getItem(this.CLIENTE_KEY) ?? '';
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }
}
