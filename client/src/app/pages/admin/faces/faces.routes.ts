import { Routes } from '@angular/router';
import { FacesPage } from './faces.page';
import { FacesEditPage } from './faces-edit/faces-edit.page';

export const FACES_ROUTES: Routes = [
  {
    path: '',
    component: FacesPage,
  },
  {
    path: 'new',
    component: FacesEditPage,
  },
  {
    path: 'edit/:id',
    component: FacesEditPage,
  },
];
