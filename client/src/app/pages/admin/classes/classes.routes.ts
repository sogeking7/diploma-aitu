import { Routes } from '@angular/router';
import { ClassesComponent } from './classes.component';
import { ClassesCreateComponent } from './classes-create/classes-create.component';

export const CLASSES_ROUTES: Routes = [
  {
    path: '',
    component: ClassesComponent,
  },
  {
    path: 'new',
    component: ClassesCreateComponent,
  },
];
