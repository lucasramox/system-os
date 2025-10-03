import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  registerForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const userData = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Register successful:', response);

          this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Register error:', error);

          const errorMessage = error.error?.message || 'Erro ao realizar cadastro. Tente novamente.';

          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  getNameErrorMessage() {
    const nameControl = this.registerForm.get('name');
    if (nameControl?.hasError('required')) {
      return 'Nome é obrigatório';
    }
    return nameControl?.hasError('minlength') ? 'Nome deve ter no mínimo 3 caracteres' : '';
  }

  getEmailErrorMessage() {
    const emailControl = this.registerForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email é obrigatório';
    }
    return emailControl?.hasError('email') ? 'Email inválido' : '';
  }

  getPasswordErrorMessage() {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Senha é obrigatória';
    }
    return passwordControl?.hasError('minlength') ? 'Senha deve ter no mínimo 6 caracteres' : '';
  }
}
