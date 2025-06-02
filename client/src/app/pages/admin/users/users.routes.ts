import { Routes } from '@angular/router';
import { UsersPage } from './users.page';
import { UsersEditPage } from './users-edit/users-edit.page';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersPage,
  },
  {
    path: 'new',
    component: UsersEditPage,
  },
  {
    path: 'edit/:id',
    component: UsersEditPage,
  },
];
