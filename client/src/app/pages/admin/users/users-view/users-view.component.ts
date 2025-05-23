import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { UserOut, UsersService } from '../../../../../lib/open-api';
import { getRoleTagColor } from '../../../../../lib/common';
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrl: './users-view.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule, NzSpinModule, NzButtonModule, NzIconModule, NzTagModule, NzDescriptionsModule, NzPopconfirmDirective],
})
export class UsersViewComponent implements OnInit {
  userId: number | null = null;
  user: UserOut | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    // Get the user ID from the route params
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.userId = +idParam;
        this.loadUserData();
      } else {
        this.notification.error('Error', 'User ID is missing');
        this.router.navigate(['/users']);
      }
    });
  }

  private loadUserData(): void {
    if (!this.userId) {
      return;
    }

    this.usersService.readUser(this.userId).subscribe({
      next: user => {
        this.user = user;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.notification.error('Error', error.error?.detail || 'Failed to load user data');
        this.router.navigate(['/users']);
      },
    });
  }

  deleteUser(): void {
    this.usersService.deleteUser(this.userId!).subscribe({
      next: () => {
        this.notification.success('Success', 'User has been deleted successfully!');
        this.router.navigate(['/users']);
      },
      error: err => {
        this.notification.error('Error', err.error?.detail || 'Failed to delete user. Please try again.');
      },
    });
  }

  public getRoleTagColor = getRoleTagColor;

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
