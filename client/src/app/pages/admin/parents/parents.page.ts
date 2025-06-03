import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-parents',
  templateUrl: './parents.page.html',
  imports: [CommonModule, NzTableModule, NzButtonModule, NzTagModule, RouterModule, NzIconModule, NzTypographyComponent],
  standalone: true,
})
export class ParentsPage implements OnInit {
  parents: UserOut[] = [];
  loading = true;
  page = 1;
  count = 10;
  total = 0;

  constructor(
    private parentsService: UsersService,
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

      this.loadParents();
    });
  }

  private loadParents(): void {
    this.loading = true;
    this.parentsService.readUsers('parent', undefined, this.page, this.count).subscribe({
      next: list => {
        this.loading = false;
        this.total = Number(list.total);
        this.parents = list.items;
      },
      error: error => {
        this.loading = false;
        this.notification.error('Error', error.error?.detail || 'Failed to load parents. Please try again.');
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

  public getRoleTagColor = getRoleTagColor;
}
