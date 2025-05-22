import { Component, OnInit } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { DatePipe, NgForOf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceOut, AttendancesService } from '../../../../lib/open-api';
import { LucideAngularModule } from 'lucide-angular';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-attendances',
  templateUrl: './attendances.component.html',
  imports: [NzTableModule, NgForOf, NzTagModule, DatePipe, LucideAngularModule, NzIconDirective, NzTypographyComponent],
  styleUrls: ['./attendances.component.css'],
  standalone: true,
})
export class AttendancesComponent implements OnInit {
  attendances: AttendanceOut[] = [];

  loading = true;
  page = 1;
  count = 10;
  total = 0;

  constructor(
    private attendancesService: AttendancesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const pageFromUrl = params['page'];
      const countFromUrl = params['count'];

      this.page = pageFromUrl ? +pageFromUrl : 1;
      this.count = countFromUrl ? +countFromUrl : 10;

      this.loadAttendances();
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

  private loadAttendances(): void {
    this.loading = true;
    this.attendancesService.readAttendances(this.page, this.count).subscribe(list => {
      this.loading = false;
      this.total = Number(list.total);
      this.attendances = list.items;
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
}
