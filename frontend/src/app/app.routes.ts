import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './pages/register/register';

import { authGuard } from './guards/auth-guard';
import { Orders } from './pages/orders/orders';
import { CreateOrder } from './pages/create-order/create-order';
import { EditOrder } from './pages/edit-order/edit-order';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'orders',
    component: Orders,
    canActivate: [authGuard],
  },
  {
    path: 'create-order',
    component: CreateOrder,
    canActivate: [authGuard],
  },
  {
    path: 'edit-order/:id',
    component: EditOrder,
    canActivate: [authGuard],
  },
];
