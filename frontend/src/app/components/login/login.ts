import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login successful:', response);

          // Salvar token se vier na resposta - MUDOU AQUI
          if (response.access_token) {
            this.authService.saveToken(response.access_token, JSON.stringify(response.user));
            console.log('Token salvo:', response.access_token);
          }

          this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });

          // Redirecionar para a listagem de ordens
          this.router.navigate(['/orders']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);

          const errorMessage =
            error.error?.message || 'Erro ao fazer login. Verifique suas credenciais.';

          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  getEmailErrorMessage() {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email é obrigatório';
    }
    return emailControl?.hasError('email') ? 'Email inválido' : '';
  }

  getPasswordErrorMessage() {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Senha é obrigatória';
    }
    return passwordControl?.hasError('minlength') ? 'Senha deve ter no mínimo 6 caracteres' : '';
  }
}
