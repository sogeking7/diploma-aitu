import { Component } from '@angular/core';
import { NzContentComponent, NzHeaderComponent, NzLayoutComponent, NzSiderComponent } from 'ng-zorro-antd/layout';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent } from 'ng-zorro-antd/menu';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { AuthenticationService } from '../../services/auth.service';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css'],
  standalone: true,
  imports: [
    NzLayoutComponent,
    NzHeaderComponent,
    NzContentComponent,
    NzIconDirective,
    NzMenuDirective,
    NzMenuItemComponent,
    NzSiderComponent,
    NzSubMenuComponent,
    RouterLink,
    RouterOutlet,
    NzAvatarModule,
    NzDropDownModule,
    NzTypographyModule,
  ],
})
export class AppLayoutComponent {
  isCollapsed = false;
  constructor(
    private authenticateService: AuthenticationService,
    private router: Router
  ) {}

  logout(): void {
    this.authenticateService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
    });
  }
}
