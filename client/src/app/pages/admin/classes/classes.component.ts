import { Component, OnInit } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getRoleTagColor } from '../../../../lib/common';
import { ClassesService, ClassOut, ClassUpdate, UsersService, UserOut, RoleEnum } from '../../../../lib/open-api';
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
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  imports: [
    CommonModule,
    NzTableModule,
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
  styleUrls: ['./classes.component.css'],
  standalone: true,
})
export class ClassesComponent implements OnInit {
  classes: ClassOut[] = [];
  selectedClass: ClassOut | null = null;
  editForm: FormGroup | null = null;
  teachers: UserOut[] = [];

  // Properties for teacher search
  teacherSearchResults: UserOut[] = [];
  isSearchingTeachers = false;
  readonly nzFilterOption = (): boolean => true; // Always return true to let the server handle filtering

  loading = true;
  page = 1;
  count = 10;
  total = 0;

  // Drawer properties
  drawerVisible = false;
  isSubmitting = false;
  drawerMode: 'view' | 'edit' = 'edit';
  drawerTitle = '';
  teachersLoading = false;

  constructor(
    private classesService: ClassesService,
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

      this.loadClasses();
      this.loadTeachers();
    });
  }

  private loadClasses(): void {
    this.loading = true;
    this.classesService.readClasses(this.page, this.count).subscribe({
      next: list => {
        this.loading = false;
        this.total = Number(list.total);
        this.classes = list.items;
      },
      error: error => {
        this.loading = false;
        this.notification.error('Error', error.error?.detail || 'Failed to load classes. Please try again.');
      },
    });
  }

  loadTeachers(): void {
    this.teachersLoading = true;
    this.usersService.readUsers(RoleEnum.teacher, 1, 100).subscribe({
      next: response => {
        this.teachersLoading = false;
        this.teachers = response.items;
      },
      error: err => {
        this.teachersLoading = false;
        this.notification.error('Error', err.error?.message || 'Failed to load teachers. Please try again.');
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

  openEditDrawer(classItem: ClassOut): void {
    this.selectedClass = classItem;
    this.drawerMode = 'edit';
    this.drawerTitle = `Edit Class: ${classItem.name}`;

    this.editForm = this.fb.group({
      name: [classItem.name, [Validators.required]],
      teacher_user_id: [classItem.teacher_user_id, [Validators.required]],
    });

    // Pre-fill teacherSearchResults with the current teacher so it's displayed in select
    const selectedTeacher = this.teachers.find(t => t.id === classItem.teacher_user_id);
    if (selectedTeacher) {
      this.teacherSearchResults = [selectedTeacher, ...this.teachers.filter(t => t.id !== selectedTeacher.id)];
    } else {
      // fallback: just use all teachers
      this.teacherSearchResults = this.teachers;
    }

    this.drawerVisible = true;
  }

  // Open view drawer
  openViewDrawer(classItem: ClassOut): void {
    this.selectedClass = classItem;
    this.drawerMode = 'view';
    this.drawerTitle = `View Class: ${classItem.name}`;
    this.drawerVisible = true;
  }

  // Close the drawer
  closeDrawer(): void {
    this.drawerVisible = false;
    this.selectedClass = null;
    this.editForm = null;
  }

  // Update class
  updateClass(): void {
    if (!this.editForm || !this.selectedClass) {
      return;
    }

    if (this.editForm.valid) {
      this.isSubmitting = true;
      const classData: ClassUpdate = this.editForm.value;

      this.classesService.updateClass(this.selectedClass.id, classData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.notification.success('Success', 'Class has been updated successfully!');
          this.closeDrawer();
          this.loadClasses(); // Reload the class list
        },
        error: err => {
          this.isSubmitting = false;
          this.notification.error('Error', err.error?.detail || 'Failed to update class. Please try again.');
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

  // Delete class
  deleteClass(classId: number): void {
    this.classesService.deleteClass(classId).subscribe({
      next: () => {
        this.notification.success('Success', 'Class has been deleted successfully!');
        this.loadClasses(); // Reload the class list
      },
      error: err => {
        this.notification.error('Error', err.error?.detail || 'Failed to delete class. Please try again.');
      },
    });
  }

  // Get teacher name by ID
  getTeacherName(teacherId: number): string {
    const teacher = this.teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : `Teacher ID: ${teacherId}`;
  }

  searchTeachers(searchText: string): void {
    if (!searchText || searchText.trim() === '') {
      this.teacherSearchResults = this.teachers;
      return;
    }

    const lowerSearchText = searchText.toLowerCase();
    this.teacherSearchResults = this.teachers.filter(teacher => {
      const fullName = `${teacher.first_name} ${teacher.last_name}`.toLowerCase();
      return fullName.includes(lowerSearchText);
    });
  }

  getTeacherDisplayName(teacher: UserOut): string {
    return `${teacher.first_name} ${teacher.last_name}`;
  }

  public getRoleTagColor = getRoleTagColor;
}
