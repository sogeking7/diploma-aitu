import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../services/auth.service';
import { NzAlertComponent } from 'ng-zorro-antd/alert';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  imports: [
    NzAlertComponent,
    NzCardComponent,
    NzFormItemComponent,
    NzFormControlComponent,
    NzInputGroupComponent,
    ReactiveFormsModule,
    NzButtonComponent,
    NzInputDirective,
    NzCheckboxModule,
    NzFormDirective,
    NzTypographyComponent,
  ],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';
  returnUrl: string = '/';

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthenticationService);

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async submitForm() {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    try {
      await firstValueFrom(this.authService.login(this.loginForm.value.username, this.loginForm.value.password));
      this.router.navigate([this.returnUrl]);
    } catch (e) {
      const error = e as HttpErrorResponse;
      this.error = error?.error?.message || 'Login failed';
    } finally {
      this.loading = false;
    }
  }
}
