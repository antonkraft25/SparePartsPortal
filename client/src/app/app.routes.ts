import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { Members } from '../features/members/members';
import { SparepartsList } from '../features/spareparts/spareparts-list/spareparts-list';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'members', component: Members },
  { path: '**', redirectTo: '' },
  {path: 'spareparts-list', component: SparepartsList}
];
