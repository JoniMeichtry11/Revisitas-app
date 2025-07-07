import { Routes, provideRouter } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent),
  },
];

export const appRouter = provideRouter(routes);
