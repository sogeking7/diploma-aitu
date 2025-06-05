import { Component, inject, OnInit } from '@angular/core';
import { FaceOut, FacesService } from '../../../../lib/open-api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams, NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { getRoleTagColor } from '../../../../lib/common';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-faces-page',
  imports: [CommonModule, RouterModule, NzTableModule, NzButtonModule, NzTagModule, NzPopconfirmModule, NzIconModule, NzTypographyComponent],
  templateUrl: './faces.page.html',
})
export class FacesPage implements OnInit {
  faces: FaceOut[] = [];

  isLoading = {
    faces: false,
    delete: false,
  };
  page = 1;
  count = 10;
  total = 0;

  private facesService = inject(FacesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notification = inject(NzNotificationService);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.page = params['page'] ? +params['page'] : 1;
      this.count = params['count'] ? +params['count'] : 10;
    });
    this.loadFaces();
  }

  async loadFaces() {
    this.isLoading.faces = true;
    try {
      const res = await firstValueFrom(this.facesService.getFaces(this.page, this.count));
      this.total = Number(res.total);
      this.faces = res.items;
    } catch (e) {
      const error = e as HttpErrorResponse;
      this.notification.error('Error', error.error?.message || 'Failed to load users. Please try again.');
    } finally {
      this.isLoading.faces = false;
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

  async deleteFace(faceId: number) {
    this.isLoading.delete = true;
    try {
      await firstValueFrom(this.facesService.deleteFace(faceId));
      this.notification.success('Success', 'Face has been deleted successfully!');
      this.loadFaces();
    } catch (e) {
      const error = e as HttpErrorResponse;
      this.notification.error('Error', error.error?.message || 'Failed to delete face. Please try again.');
    } finally {
      this.isLoading.delete = false;
    }
  }

  public getRoleTagColor = getRoleTagColor;
}
