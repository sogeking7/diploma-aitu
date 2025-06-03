import { Routes } from '@angular/router';
import { ParentsPage } from './parents.page';
import { ParentsEditPage } from './parents-view/parents-edit.page';

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
