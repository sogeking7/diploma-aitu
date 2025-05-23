import { Routes } from '@angular/router';
import { ParentsComponent } from './parents.component';
import { ParentsViewComponent } from './parents-view/parents-view.component';

export const PARENTS_ROUTES: Routes = [
  {
    path: '',
    component: ParentsComponent,
  },
  {
    path: ':id',
    component: ParentsViewComponent,
  },
];
