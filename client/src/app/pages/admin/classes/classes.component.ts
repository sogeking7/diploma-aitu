import { Component, OnInit } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getRoleTagColor } from '../../../../lib/common';
import {
  ClassesService,
  ClassOut,
  ClassUpdate,
  UsersService,
  UserOut,
  RoleEnum,
  ClassStudentsService,
  ClassStudentOut,
  ClassStudentCreate,
} from '../../../../lib/open-api';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule } from 'ng-zorro-antd/modal';

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
    NzDividerModule,
    NzSpinModule,
    NzEmptyModule,
    NzModalModule,
    FormsModule,
  ],
  styleUrls: ['./classes.component.css'],
  standalone: true,
})
export class ClassesComponent implements OnInit {
  // Existing properties
  classes: ClassOut[] = [];
  selectedClass: ClassOut | null = null;
  editForm: FormGroup | null = null;
  teachers: UserOut[] = [];

  // Properties for student management
  enrolledStudents: ClassStudentOut[] = [];
  loadingStudents = false;
  isAddingStudent = false;

  // Property for available students to add to class
  availableStudents: UserOut[] = [];
  selectedStudentId: number | null = null;
  loadingAvailableStudents = false;

  // Properties for student search
  studentSearchResults: UserOut[] = [];
  isSearchingStudents = false;

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
    private classStudentsService: ClassStudentsService,
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

  // Load available students (students with role=student)
  loadAvailableStudents(): void {
    this.loadingAvailableStudents = true;
    this.usersService.readUsers(RoleEnum.student, 1, 100).subscribe({
      next: response => {
        this.loadingAvailableStudents = false;
        this.availableStudents = response.items;
        this.studentSearchResults = this.availableStudents;
      },
      error: err => {
        this.loadingAvailableStudents = false;
        this.notification.error('Error', err.error?.detail || 'Failed to load students. Please try again.');
      },
    });
  }

  // Search students method for the dropdown
  searchStudents(searchText: string): void {
    if (!searchText || searchText.trim() === '') {
      this.studentSearchResults = this.availableStudents;
      return;
    }

    const lowerSearchText = searchText.toLowerCase();
    this.studentSearchResults = this.availableStudents.filter(student => {
      const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
      return fullName.includes(lowerSearchText);
    });
  }

  // Add student to class
  addStudentToClass(): void {
    if (!this.selectedClass || !this.selectedStudentId) {
      this.notification.warning('Warning', 'Please select a student to add to the class.');
      return;
    }

    this.isAddingStudent = true;
    const classStudentCreate: ClassStudentCreate = {
      class_id: this.selectedClass.id,
      student_user_id: this.selectedStudentId,
    };

    this.classStudentsService.createClassStudent(classStudentCreate).subscribe({
      next: () => {
        this.isAddingStudent = false;
        this.notification.success('Success', 'Student added to class successfully!');
        this.selectedStudentId = null;
        this.loadStudentsByClass(this.selectedClass!.id); // Reload students list
      },
      error: err => {
        this.isAddingStudent = false;
        this.notification.error('Error', err.error?.detail || 'Failed to add student to class. Please try again.');
      },
    });
  }

  // Remove student from class
  removeStudentFromClass(classStudentId: number): void {
    this.classStudentsService.deleteClassStudent(classStudentId).subscribe({
      next: () => {
        this.notification.success('Success', 'Student removed from class successfully!');
        if (this.selectedClass) {
          this.loadStudentsByClass(this.selectedClass.id); // Reload students list
        }
      },
      error: err => {
        this.notification.error('Error', err.error?.detail || 'Failed to remove student from class. Please try again.');
      },
    });
  }

  // Check if student is already enrolled
  isStudentEnrolled(studentId: number): boolean {
    return this.enrolledStudents.some(enrollment => enrollment.student_user?.id === studentId);
  }

  // Get student display name
  getStudentDisplayName(student: UserOut): string {
    return `${student.first_name} ${student.last_name}`;
  }

  // Modified methods to handle different drawer modes
  openViewDrawer(classItem: ClassOut): void {
    this.selectedClass = classItem;
    this.drawerMode = 'view';
    this.drawerTitle = `View Class: ${classItem.name}`;
    this.loadStudentsByClass(classItem.id);
    // No need to load available students in view mode
    this.drawerVisible = true;
  }

  openEditDrawer(classItem: ClassOut): void {
    this.selectedClass = classItem;
    this.drawerMode = 'edit';
    this.drawerTitle = `Edit Class: ${classItem.name}`;

    this.editForm = this.fb.group({
      name: [classItem.name, [Validators.required]],
      teacher_user_id: [classItem.teacher_user_id, [Validators.required]],
    });

    // Pre-fill teacherSearchResults with the current teacher
    const selectedTeacher = this.teachers.find(t => t.id === classItem.teacher_user_id);
    if (selectedTeacher) {
      this.teacherSearchResults = [selectedTeacher, ...this.teachers.filter(t => t.id !== selectedTeacher.id)];
    } else {
      this.teacherSearchResults = this.teachers;
    }

    this.loadStudentsByClass(classItem.id);
    this.loadAvailableStudents(); // Only load available students in edit mode
    this.drawerVisible = true;
  }

  // Update closeDrawer to reset student-related states
  closeDrawer(): void {
    this.drawerVisible = false;
    this.selectedClass = null;
    this.editForm = null;
    this.enrolledStudents = [];
    this.selectedStudentId = null;
  }

  // Existing methods...
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

  loadStudentsByClass(classId: number): void {
    this.loadingStudents = true;
    this.enrolledStudents = [];

    this.classStudentsService.readStudentsByClass(classId, 1, 100).subscribe({
      next: response => {
        this.loadingStudents = false;
        this.enrolledStudents = response.items;
      },
      error: error => {
        this.loadingStudents = false;
        this.notification.error('Error', error.error?.detail || 'Failed to load enrolled students. Please try again.');
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
          this.loadClasses();
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

  deleteClass(classId: number): void {
    this.classesService.deleteClass(classId).subscribe({
      next: () => {
        this.notification.success('Success', 'Class has been deleted successfully!');
        this.loadClasses();
      },
      error: err => {
        this.notification.error('Error', err.error?.detail || 'Failed to delete class. Please try again.');
      },
    });
  }

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
