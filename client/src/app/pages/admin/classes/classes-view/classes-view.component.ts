import { Component, OnInit } from '@angular/core';
import {
  ClassesService,
  ClassOut,
  ClassStudentOut,
  ClassStudentsService,
  ClassStudentCreate,
  UsersService,
  UserOut,
} from '../../../../../lib/open-api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForOf, NgIf } from '@angular/common';
import { NzDescriptionsComponent, NzDescriptionsItemComponent } from 'ng-zorro-antd/descriptions';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-classes-view',
  standalone: true,
  imports: [
    NgIf,
    NzDescriptionsComponent,
    NzDescriptionsItemComponent,
    NzButtonComponent,
    NzIconDirective,
    NzSpinComponent,
    NzPopconfirmDirective,
    RouterModule,
    NgForOf,
    NzTableModule,
    NzTypographyComponent,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    FormsModule,
  ],
  templateUrl: './classes-view.component.html',
  styleUrl: './classes-view.component.css',
})
export class ClassesViewComponent implements OnInit {
  classId: number | null = null;
  class_: ClassOut | null = null;
  isLoading = false;

  studentsPage = 1;
  studentsCount = 10;
  studentsTotal = 0;

  enrolledStudents: ClassStudentOut[] = [];
  isLoadingStudents = false;

  // Add student modal
  isAddStudentModalVisible = false;
  isLoadingAvailableStudents = false;
  availableStudents: UserOut[] = [];
  selectedStudentId: number | null = null;
  isAddingStudent = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classesService: ClassesService,
    private classStudentsService: ClassStudentsService,
    private usersService: UsersService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isLoadingStudents = true;
    this.route.queryParams.subscribe(params => {
      const pageFromUrl = params['page'];
      const countFromUrl = params['count'];

      this.studentsPage = pageFromUrl ? +pageFromUrl : 1;
      this.studentsCount = countFromUrl ? +countFromUrl : 10;

      this.loadStudentsByClass();
    });

    // Get the user ID from the route params
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.classId = +idParam;
        this.loadClassData();
        this.loadStudentsByClass();
      } else {
        this.notification.error('Error', 'Class ID is missing');
        this.router.navigate(['/classes']);
      }
    });
  }

  private loadClassData(): void {
    if (!this.classId) {
      return;
    }

    this.classesService.readClass(this.classId).subscribe({
      next: class_ => {
        this.class_ = class_;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.notification.error('Error', error.error?.detail || 'Failed to load class data');
        this.router.navigate(['/classes']);
      },
    });
  }

  private loadStudentsByClass(): void {
    if (!this.classId) {
      return;
    }

    this.classStudentsService.readStudentsByClass(this.classId, this.studentsPage, this.studentsCount).subscribe({
      next: list => {
        this.isLoadingStudents = false;
        this.enrolledStudents = list.items;
        this.studentsTotal = Number(list.total);
      },
      error: error => {
        this.isLoadingStudents = false;
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

  deleteClass(): void {
    if (!this.classId) return;

    this.classesService.deleteClass(this.classId).subscribe({
      next: () => {
        this.notification.success('Success', 'Class has been deleted successfully!');
        this.router.navigate(['/classes']);
      },
      error: err => {
        this.notification.error('Error', err.error?.detail || 'Failed to delete class. Please try again.');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/classes']);
  }

  showAddStudentModal(): void {
    this.isAddStudentModalVisible = true;
    this.loadAvailableStudents();
  }

  handleCancelAddStudent(): void {
    this.isAddStudentModalVisible = false;
    this.selectedStudentId = null;
  }

  loadAvailableStudents(): void {
    this.isLoadingAvailableStudents = true;

    // First, get all students
    this.usersService.readUsers('student', undefined, 1, 100).subscribe({
      next: response => {
        const allStudents = response.items;

        if (this.enrolledStudents && this.enrolledStudents.length > 0) {
          // Filter out students who are already enrolled in the class
          const enrolledStudentIds = this.enrolledStudents.map(es => es.student_user?.id);
          this.availableStudents = allStudents.filter(student => !enrolledStudentIds.includes(student.id));
        } else {
          // If no students are enrolled yet, all students are available
          this.availableStudents = allStudents;
        }

        this.isLoadingAvailableStudents = false;
      },
      error: error => {
        this.isLoadingAvailableStudents = false;
        this.notification.error('Error', error.error?.detail || 'Failed to load available students');
      },
    });
  }

  handleAddStudent(): void {
    if (!this.selectedStudentId || !this.classId) {
      this.notification.error('Error', 'Please select a student to add');
      return;
    }

    this.isAddingStudent = true;

    const studentData: ClassStudentCreate = {
      class_id: this.classId,
      student_user_id: this.selectedStudentId,
    };

    this.classStudentsService.createClassStudent(studentData).subscribe({
      next: () => {
        this.notification.success('Success', 'Student added to class successfully');
        this.isAddingStudent = false;
        this.isAddStudentModalVisible = false;
        this.selectedStudentId = null;

        // Reload class and students data
        this.loadClassData();
        this.loadStudentsByClass();
      },
      error: error => {
        this.isAddingStudent = false;
        this.notification.error('Error', error.error?.detail || 'Failed to add student to class');
      },
    });
  }

  removeStudent(classStudentId: number): void {
    if (!classStudentId) return;

    this.classStudentsService.deleteClassStudent(classStudentId).subscribe({
      next: () => {
        this.notification.success('Success', 'Student removed from class successfully');

        // Reload class and students data
        this.loadClassData();
        this.loadStudentsByClass();
      },
      error: error => {
        this.notification.error('Error', error.error?.detail || 'Failed to remove student from class');
      },
    });
  }
}
