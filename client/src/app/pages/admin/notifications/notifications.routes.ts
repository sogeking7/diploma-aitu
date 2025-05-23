import { Routes } from '@angular/router';
import { NotificationsComponent } from './notifications.component';
import { NotificationsCreateComponent } from './notifications-create/notifications-create.component';

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    component: NotificationsComponent,
  },
  {
    path: 'new',
    component: NotificationsCreateComponent,
  },
];
