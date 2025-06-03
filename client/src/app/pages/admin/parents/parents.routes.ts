import { Routes } from '@angular/router';
import { ParentsPage } from './parents.page';
import { ParentsEditPage } from './parents-edit/parents-edit.page';

export const PARENTS_ROUTES: Routes = [
  {
    path: '',
    component: ParentsPage,
  },
  {
    path: 'edit/:id',
    component: ParentsEditPage,
  },
];
