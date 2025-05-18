import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UsersCreateComponent } from './users-create/users-create.component';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersComponent,
  },
  {
    path: 'new',
    component: UsersCreateComponent,
  },
];
