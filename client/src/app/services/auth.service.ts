import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService, RoleEnum, UserOut, UsersService } from '../../lib/open-api';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  user: UserOut | null = null;

  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {}

  login(username: string, password: string) {
    return this.authService.login(username, password).pipe();
  }

  logout() {
    return this.authService.logout().pipe();
  }

  async isAuthenticated() {
    try {
      this.user = await lastValueFrom(this.userService.readCurrentUser());
      return this.user.role === RoleEnum.admin;
    } catch {
      this.user = null;
      return false;
    }
  }
}
