import { Component, OnInit } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CommonModule, NgForOf } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getRoleTagColor } from '../../../../lib/common';
import { UserOut, UserUpdate, UsersService } from '../../../../lib/open-api';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  imports: [
    CommonModule,
    NzTableModule,
    NgForOf,
    NzButtonModule,
    NzTagModule,
    RouterModule,
    NzIconModule,
    NzDrawerModule,
    NzPopconfirmModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDescriptionsModule,
  ],
  styleUrls: ['./users.component.css'],
  standalone: true,
})
export class UsersComponent implements OnInit {
  users: UserOut[] = [];
  selectedUser: UserOut | null = null;
  editForm: FormGroup | null = null;

  loading = true;
  page = 1;
  count = 10;
  total = 0;

  // Drawer properties
  drawerVisible = false;
  isSubmitting = false;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const pageFromUrl = params['page'];
      const countFromUrl = params['count'];

      this.page = pageFromUrl ? +pageFromUrl : 1;
      this.count = countFromUrl ? +countFromUrl : 10;

      this.loadUsers();
    });
  }

  searchData(reset: boolean = false): void {
    let targetPage = this.page;
    if (reset) {
      targetPage = 1;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: targetPage,
        count: this.count,
      },
      queryParamsHandling: 'merge',
    });
  }

  private loadUsers(): void {
    this.loading = true;
    this.usersService.readUsers(undefined, this.page, this.count).subscribe({
      next: list => {
        this.loading = false;
        this.total = Number(list.total);
        this.users = list.items;
      },
      error: error => {
        this.loading = false;
        this.notification.error('Error', error.error?.detail || 'Failed to load users. Please try again.');
      },
    });
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

  // Add to the UsersComponent class
  drawerMode: 'view' | 'edit' = 'edit';
  drawerTitle = '';

  // Modify the existing openEditDrawer method
  openEditDrawer(user: UserOut): void {
    this.selectedUser = user;
    this.drawerMode = 'edit';
    this.drawerTitle = `Edit User: ${user.first_name} ${user.last_name}`;
    this.editForm = this.fb.group({
      first_name: [user.first_name, [Validators.required]],
      last_name: [user.last_name, [Validators.required]],
      email: [user.email, [Validators.required, Validators.email]],
      role: [user.role, [Validators.required]],
    });
    this.drawerVisible = true;
  }

  // Add a new method for opening the view mode
  openViewDrawer(user: UserOut): void {
    this.selectedUser = user;
    this.drawerMode = 'view';
    this.drawerTitle = `View User: ${user.first_name} ${user.last_name}`;
    this.drawerVisible = true;
  }

  // Close the drawer
  closeDrawer(): void {
    this.drawerVisible = false;
    this.selectedUser = null;
    this.editForm = null;
  }

  // Update user
  updateUser(): void {
    if (!this.editForm || !this.selectedUser) {
      return;
    }

    if (this.editForm.valid) {
      this.isSubmitting = true;
      const userData: UserUpdate = this.editForm.value;

      this.usersService.updateUser(this.selectedUser.id, userData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.notification.success('Success', 'User has been updated successfully!');
          this.closeDrawer();
          this.loadUsers(); // Reload the user list
        },
        error: err => {
          this.isSubmitting = false;
          this.notification.error('Error', err.error?.detail || 'Failed to update user. Please try again.');
        },
      });
    } else {
      Object.values(this.editForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // Delete user
  deleteUser(userId: number): void {
    this.usersService.deleteUser(userId).subscribe({
      next: () => {
        this.notification.success('Success', 'User has been deleted successfully!');
        this.loadUsers(); // Reload the user list
      },
      error: err => {
        this.notification.error('Error', err.error?.detail || 'Failed to delete user. Please try again.');
      },
    });
  }

  public getRoleTagColor = getRoleTagColor;
}
