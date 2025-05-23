import { Component, OnInit } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { ParentStudentCreate, ParentStudentOut, ParentStudentsService, UserOut, UsersService } from '../../../../../lib/open-api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForOf, NgIf } from '@angular/common';
import { NzDescriptionsComponent, NzDescriptionsItemComponent } from 'ng-zorro-antd/descriptions';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { getRoleTagColor } from '../../../../../lib/common';

@Component({
  selector: 'app-parents-view',
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
    NzTagComponent,
  ],
  templateUrl: './parents-view.component.html',
  styleUrl: './parents-view.component.css',
})
export class ParentsViewComponent implements OnInit {
  parentId: number | null = null;
  parent: UserOut | null = null;
  parentStudents: ParentStudentOut[] | null = null;
  isLoading = false;

  studentsPage = 1;
  studentsCount = 10;
  studentsTotal = 0;
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
    private parentStudentService: ParentStudentsService,
    private usersService: UsersService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.isLoadingStudents = true;
    this.isLoading = true;
    this.route.queryParams.subscribe(params => {
      const pageFromUrl = params['page'];
      const countFromUrl = params['count'];

      this.studentsPage = pageFromUrl ? +pageFromUrl : 1;
      this.studentsCount = countFromUrl ? +countFromUrl : 10;

      this.loadParentData();
      this.loadStudentsByParent();
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.parentId = +idParam;
        this.loadStudentsByParent();
        this.loadParentData();
      } else {
        this.notification.error('Error', 'Parent ID is missing');
        this.router.navigate(['/parents']);
      }
    });
  }

  private loadParentData(): void {
    if (!this.parentId) {
      return;
    }

    this.usersService.readUser(this.parentId).subscribe({
      next: parent => {
        this.parent = parent;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.notification.error('Error', error.error?.detail || 'Failed to load parent data');
        this.router.navigate(['/parents']);
      },
    });
  }

  private loadStudentsByParent(): void {
    if (!this.parentId) {
      return;
    }

    this.parentStudentService.readStudentsByParent(this.parentId).subscribe({
      next: list => {
        this.parentStudents = list.items;
        this.studentsTotal = Number(list.total);
        this.isLoadingStudents = false;
      },
      error: error => {
        this.isLoadingStudents = false;
        this.notification.error('Error', error.error?.detail || 'Failed to load parent students data');
        this.router.navigate(['/parents']);
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

  goBack(): void {
    this.router.navigate(['/parents']);
  }

  showAddStudentModal(): void {
    this.isAddStudentModalVisible = true;
    this.loadAvailableStudents();
  }

  handleCancelAddStudent(): void {
    this.isAddStudentModalVisible = false;
    this.selectedStudentId = null;
  }

  private loadAvailableStudents(): void {
    this.isLoadingAvailableStudents = true;

    // First, get all students
    this.usersService.readUsers('student', 1, 100).subscribe({
      next: response => {
        const allStudents = response.items;

        if (this.parentStudents && this.parentStudents.length > 0) {
          // Filter out students who are already enrolled in the class
          const enrolledStudentIds = this.parentStudents.map(es => es.student_user_id);
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
    if (!this.selectedStudentId || !this.parentId) {
      this.notification.error('Error', 'Please select a student to add');
      return;
    }

    this.isAddingStudent = true;

    const studentData: ParentStudentCreate = {
      student_user_id: this.selectedStudentId,
      parent_user_id: this.parentId,
    };

    this.parentStudentService.createParentStudent(studentData).subscribe({
      next: () => {
        this.notification.success('Success', 'Student added to parent successfully');
        this.isAddingStudent = false;
        this.isAddStudentModalVisible = false;
        this.selectedStudentId = null;

        this.loadStudentsByParent();
      },
      error: error => {
        this.isAddingStudent = false;
        this.notification.error('Error', error.error?.detail || 'Failed to add student to parent');
      },
    });
  }

  removeStudent(parentStudentId: number): void {
    if (!parentStudentId) return;

    this.parentStudentService.deleteParentStudent(parentStudentId).subscribe({
      next: () => {
        this.notification.success('Success', 'Student removed from parent successfully');
        this.loadStudentsByParent();
      },
      error: error => {
        this.notification.error('Error', error.error?.detail || 'Failed to remove student from parent');
      },
    });
  }

  protected readonly getRoleTagColor = getRoleTagColor;
}
