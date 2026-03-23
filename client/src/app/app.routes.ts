import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { Members } from '../features/members/members';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'members', component: Members },
  { path: '**', redirectTo: '' },
];
