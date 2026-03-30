import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { Members } from '../features/members/members';
import { SparepartsList } from '../features/spareparts/spareparts-list/spareparts-list';
import { ProductsList } from '../features/products/products-list/products-list';
import { CustomersList } from '../features/customers/customers-list/customers-list';
import { ResetPassword } from '../features/auth/reset-password/reset-password';
import { Login } from '../features/auth/login/login';
import { authGuard } from '../core/guards/core/guards/auth-guard';


export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'reset-password', component: ResetPassword },
  { path: '', component: Home, canActivate: [authGuard] },
  { path: 'members', component: Members, canActivate: [authGuard] },
  {path: 'spareparts-list', component: SparepartsList, canActivate: [authGuard]},
  { path: 'products', component: ProductsList, canActivate: [authGuard] },
  { path: 'customers', component: CustomersList, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
