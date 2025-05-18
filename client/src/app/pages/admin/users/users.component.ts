import { Component, OnInit } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NgForOf } from '@angular/common';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { ActivatedRoute, Router } from '@angular/router';
import { getRoleTagColor } from '../../../../lib/common';
import { UserOut, UsersService } from '../../../../lib/open-api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  imports: [NzTableModule, NgForOf, NzButtonComponent, NzTagModule],
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: UserOut[] = [];

  loading = true;
  page = 1;
  count = 10;
  total = 0;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
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
    this.usersService.readUsers(this.page, this.count).subscribe(list => {
      this.loading = false;
      this.total = Number(list.total);
      this.users = list.items;
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
