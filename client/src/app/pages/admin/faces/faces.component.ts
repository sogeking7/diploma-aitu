import { Component, OnInit } from '@angular/core';
import { FaceOut, FacesService } from '../../../../lib/open-api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams, NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { getRoleTagColor } from '../../../../lib/common';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-faces',
  imports: [CommonModule, RouterModule, NzTableModule, NzButtonModule, NzTagModule, NzPopconfirmModule, NzIconModule, NzTypographyComponent],
  templateUrl: './faces.component.html',
  styleUrl: './faces.component.css',
})
export class FacesComponent implements OnInit {
  faces: FaceOut[] = [];

  loading = true;
  page = 1;
  count = 10;
  total = 0;

  constructor(
    private facesService: FacesService,
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

      this.loadUFaces();
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

  private loadUFaces(): void {
    this.loading = true;
    this.facesService.getFaces(this.page, this.count).subscribe({
      next: list => {
        this.loading = false;
        this.total = Number(list.total);
        this.faces = list.items;
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

  deleteFace(faceId: number): void {
    this.facesService.deleteFace(faceId).subscribe({
      next: () => {
        this.notification.success('Success', 'Face has been deleted successfully!');
        this.loadUFaces();
      },
      error: error => {
        this.notification.error('Error', error.error?.detail || 'Failed to delete face. Please try again.');
      },
    });
  }

  public getRoleTagColor = getRoleTagColor;
}
