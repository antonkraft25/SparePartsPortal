import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { Members } from '../features/members/members';
import { SparepartsList } from '../features/spareparts/spareparts-list/spareparts-list';
import { ProductsList } from '../features/products/products-list/products-list';
import { CustomersList } from '../features/customers/customers-list/customers-list';
import { ResetPassword } from '../features/auth/reset-password/reset-password';
import { Login } from '../features/auth/login/login';
import { authGuard } from '../core/guards/auth-guard';
import { Profile } from '../features/profile/profile/profile';
import { OrderNew } from '../features/orders/order-new/order-new';
import { OrdersList } from '../features/orders/orders-list/orders-list';
import { OrderDetail } from '../features/orders/order-detail/order-detail';
import { UsersList } from '../features/users/users-list/users-list';


export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'reset-password', component: ResetPassword },
  { path: '', component: Home, canActivate: [authGuard] },
  { path: 'members', component: Members, canActivate: [authGuard] },
  { path: 'spareparts-list', component: SparepartsList, canActivate: [authGuard]},
  { path: 'products', component: ProductsList, canActivate: [authGuard] },
  { path: 'customers', component: CustomersList, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'order/new', component: OrderNew, canActivate: [authGuard] },
  { path: 'orders', component: OrdersList, canActivate: [authGuard] },
  { path: 'orders/:id', component: OrderDetail, canActivate: [authGuard] },
  { path: 'users', component: UsersList, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
