import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UsersCreateComponent } from './users-create/users-create.component';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { UsersViewComponent } from './users-view/users-view.component';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersComponent,
  },
  {
    path: 'new',
    component: UsersCreateComponent,
  },
  {
    path: 'edit/:id',
    component: UsersEditComponent,
  },
  {
    path: ':id',
    component: UsersViewComponent,
  },
];
