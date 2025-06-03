import { Component, inject, OnInit } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getRoleTagColor } from '../../../../lib/common';
import { UserOut, UsersService } from '../../../../lib/open-api';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  imports: [CommonModule, NzTableModule, NzButtonModule, NzTagModule, RouterModule, NzIconModule, NzTypographyComponent],
  standalone: true,
})
export class UsersPage implements OnInit {
  users: UserOut[] = [];
  loading = true;
  page = 1;
  count = 20;
  total = 0;

  private usersService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notification = inject(NzNotificationService);

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.page = params['page'] ? +params['page'] : 1;
      this.count = params['count'] ? +params['count'] : 20;
    });
    await this.loadUsers();
  }

  private async loadUsers() {
    this.loading = true;
    try {
      const res = await firstValueFrom(this.usersService.readUsers(undefined, undefined, this.page, this.count));
      this.total = Number(res.total);
      this.users = res.items;
    } catch (e) {
      const error = e as HttpErrorResponse;
      this.notification.error('Error', error.error?.message() || 'Failed to load users. Please try again.');
    } finally {
      this.loading = false;
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex, pageSize } = params;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: pageIndex,
        count: pageSize,
      },
      queryParamsHandling: 'merge',
    });
  }

  public getRoleTagColor = getRoleTagColor;
}
