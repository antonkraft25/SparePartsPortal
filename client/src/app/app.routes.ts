import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { Members } from '../features/members/members';
import { SparepartsList } from '../features/spareparts/spareparts-list/spareparts-list';
import { ProductsList } from '../features/products/products-list/products-list';
import { CustomersList } from '../features/customers/customers-list/customers-list';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'members', component: Members },
  {path: 'spareparts-list', component: SparepartsList},
  { path: 'products', component: ProductsList },
  { path: 'customers', component: CustomersList },
  { path: '**', redirectTo: 'Home' }
];
