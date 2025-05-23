import { Routes } from '@angular/router';
import { ClassesComponent } from './classes.component';
import { ClassesCreateComponent } from './classes-create/classes-create.component';
import { ClassesEditComponent } from './classes-edit/classes-edit.component';
import { ClassesViewComponent } from './classes-view/classes-view.component';

export const CLASSES_ROUTES: Routes = [
  {
    path: '',
    component: ClassesComponent,
  },
  {
    path: 'new',
    component: ClassesCreateComponent,
  },
  {
    path: 'edit/:id',
    component: ClassesEditComponent,
  },
  {
    path: ':id',
    component: ClassesViewComponent,
  },
];
