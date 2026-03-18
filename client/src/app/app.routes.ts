import { Routes } from '@angular/router';
import { Home } from './home';
import { Members } from './members';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'members', component: Members },
  { path: '**', redirectTo: '' },
];
