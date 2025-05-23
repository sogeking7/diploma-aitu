import { Component, OnInit } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getRoleTagColor } from '../../../../lib/common';
import { ClassesService, ClassOut, UserOut } from '../../../../lib/open-api';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  imports: [CommonModule, NzTableModule, NzButtonModule, NzTagModule, RouterModule, NzIconModule, NzSpinModule, NzTypographyComponent],
  styleUrls: ['./classes.component.css'],
  standalone: true,
})
export class ClassesComponent implements OnInit {
  classes: ClassOut[] = [];

  loading = true;
  page = 1;
  count = 10;
  total = 0;

  constructor(
    private classesService: ClassesService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const pageFromUrl = params['page'];
      const countFromUrl = params['count'];

      this.page = pageFromUrl ? +pageFromUrl : 1;
      this.count = countFromUrl ? +countFromUrl : 10;

      this.loadClasses();
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

  getTeacherDisplayName(teacher: UserOut): string {
    return `${teacher.first_name} ${teacher.last_name}`;
  }

  public getRoleTagColor = getRoleTagColor;
}
