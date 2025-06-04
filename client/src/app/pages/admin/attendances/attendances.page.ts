import { Component, inject, OnInit } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { DatePipe, NgForOf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceOut, AttendancesService } from '../../../../lib/open-api';
import { LucideAngularModule } from 'lucide-angular';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-attendances',
  templateUrl: './attendances.page.html',
  imports: [NzTableModule, NgForOf, NzTagModule, DatePipe, LucideAngularModule, NzIconDirective, NzTypographyComponent],
  standalone: true,
})
export class AttendancesPage implements OnInit {
  attendances: AttendanceOut[] = [];

  loading = true;
  page = 1;
  count = 50;
  total = 0;

  private attendancesService = inject(AttendancesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notification = inject(NzNotificationService);

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.page = params['page'] ? +params['page'] : 1;
      this.count = params['count'] ? +params['count'] : 20;
    });
    await this.loadAttendances();
  }

  private async loadAttendances() {
    this.loading = true;
    try {
      const res = await firstValueFrom(this.attendancesService.readAttendances(this.page, this.count));
      this.total = Number(res.total);
      this.attendances = res.items;
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
}
