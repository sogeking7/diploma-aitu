import { Routes } from '@angular/router';
import { ClassesPage } from './classes.page';
import { ClassesEditPage } from './classes-edit/classes-edit.page';

export const CLASSES_ROUTES: Routes = [
  {
    path: '',
    component: ClassesPage,
  },
  {
    path: 'new',
    component: ClassesEditPage,
  },
  {
    path: 'edit/:id',
    component: ClassesEditPage,
  },
];
