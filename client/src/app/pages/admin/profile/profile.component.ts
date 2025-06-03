import { Component, inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/auth.service';
import { UserOut } from '../../../../lib/open-api';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzAvatarModule, NzDescriptionsModule, NzButtonModule, NzIconModule, NzTypographyComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user?: UserOut | null;

  private authenticateService = inject(AuthenticationService);

  ngOnInit() {
    this.user = this.authenticateService.user;
  }
}
