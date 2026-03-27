import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent {
  credentials: LoginRequest = { identificacion: '', password: '' };

  loading = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly messageService: MessageService,
  ) {}

  isFormValid(): boolean {
    return this.credentials.identificacion.trim().length > 0
      && this.credentials.password.trim().length > 0;
  }

  onPasswordKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onLogin();
    }
  }

  onLogin(): void {
    if (!this.isFormValid()) return;

    this.loading.set(true);

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/reclamos']);
      },
      error: (err) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error de autenticación',
          detail: err.error?.message || 'Identificación o contraseña incorrecta.',
          life: 4000,
        });
      },
    });
  }

  protected readonly event = event;
}
