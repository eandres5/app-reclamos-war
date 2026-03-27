import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Textarea } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../../../core/services/auth.service';
import { ReclamoService } from '../../services/reclamo.service';
import {
  TipoReclamo,
  TIPO_RECLAMO_LABELS,
  ReclamoRequest,
} from '../../../../core/models/reclamo.model';

interface TipoReclamoOption {
  label: string;
  value: TipoReclamo;
}

@Component({
  selector: 'app-registro-reclamo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    DialogModule,
    ToastModule,
    ToolbarModule,
    Textarea,
  ],
  providers: [MessageService],
  templateUrl: 'registro-reclamo.component.html',
  styleUrls: ['registro-reclamo.component.scss'],
})
export class RegistroReclamoComponent {
  identificacion = '';
  tipoReclamoSeleccionado: TipoReclamo | null = null;
  detalleReclamo = '';
  mostrarModal = false;

  tiposReclamo: TipoReclamoOption[] = Object.values(TipoReclamo).map((tipo) => ({
    label: TIPO_RECLAMO_LABELS[tipo],
    value: tipo,
  }));

  constructor(
    readonly authService: AuthService,
    readonly reclamoService: ReclamoService,
    private readonly messageService: MessageService,
  ) {}

  onConsultar(): void {
    const id = this.identificacion.trim();
    if (!id) return;

    this.reclamoService.consultarCliente(id).subscribe({
      error: (err) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cliente no encontrado',
          detail: err.error?.message || 'No se encontró un cliente con esa identificación.',
          life: 4000,
        });
      },
    });
  }

  onGuardar(): void {
    if (!this.isReclamoFormValid()) return;

    const reclamo: ReclamoRequest = {
      identificacionCliente: this.identificacion.trim(),
      tipoReclamo: this.tipoReclamoSeleccionado!,
      detalleReclamo: this.detalleReclamo.trim(),
    };

    this.reclamoService.guardarReclamo(reclamo).subscribe({
      next: () => {
        this.mostrarModal = true;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.validationErrors.detalleReclamo || err.error?.message || 'No se pudo registrar el reclamo.',
          life: 4000,
        });
      },
    });
  }

  onModalSi(): void {
    this.mostrarModal = false;
    this.limpiarFormulario();
  }

  onModalNo(): void {
    this.mostrarModal = false;
    this.authService.logout();
  }

  onLogout(): void {
    this.authService.logout();
    this.reclamoService.limpiarEstado();
  }

  isReclamoFormValid(): boolean {
    return (
      this.tipoReclamoSeleccionado !== null &&
      this.detalleReclamo.trim().length > 0
    );
  }

  private limpiarFormulario(): void {
    this.identificacion = '';
    this.tipoReclamoSeleccionado = null;
    this.detalleReclamo = '';
    this.reclamoService.limpiarEstado();
  }
}
