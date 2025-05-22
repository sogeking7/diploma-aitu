import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/layout/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full',
      },
      {
        path: 'welcome',
        loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES),
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/admin/users/users.routes').then(m => m.USERS_ROUTES),
      },
      {
        path: 'classes',
        loadChildren: () => import('./pages/admin/classes/classes.routes').then(m => m.CLASSES_ROUTES),
      },
      {
        path: 'profile',
        loadChildren: () => import('./pages/admin/profile/profile.routes').then(m => m.PROFILE_ROUTES),
      },
      {
        path: 'attendances',
        loadChildren: () => import('./pages/admin/attendances/attendances.routes').then(m => m.ATTENDANCES_ROUTES),
      },
      {
        path: 'face',
        loadChildren: () => import('./pages/face/face.routes').then(m => m.FACE_ROUTES),
      },
      {
        path: 'faces',
        loadChildren: () => import('./pages/admin/faces/faces.routes').then(m => m.FACES_ROUTES),
      },
      {
        path: 'take-attendance',
        loadChildren: () => import('./pages/take-attendance/take-attendance.routes').then(m => m.TAKE_ATTENDANCE_ROUTES),
      },
      {
        path: 'parents',
        loadChildren: () => import('./pages/admin/parents/parents.routes').then(m => m.PARENTS_ROUTES),
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
