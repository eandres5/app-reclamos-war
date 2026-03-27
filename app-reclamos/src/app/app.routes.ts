// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/**
 * Rutas con Lazy Loading para optimización de bundle size.
 * Principio SRP: Cada ruta carga solo lo necesario.
 * Guard aplicado a rutas protegidas (DIP).
 */
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'reclamos',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/reclamos/pages/registro-reclamo/registro-reclamo.component'
        ).then((m) => m.RegistroReclamoComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
