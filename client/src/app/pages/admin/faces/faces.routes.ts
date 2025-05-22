import { Routes } from '@angular/router';
import { FacesComponent } from './faces.component';
import { FacesCreateComponent } from './faces-create/faces-create.component';

export const FACES_ROUTES: Routes = [
  {
    path: '',
    component: FacesComponent,
  },
  {
    path: 'new',
    component: FacesCreateComponent,
  },
];
