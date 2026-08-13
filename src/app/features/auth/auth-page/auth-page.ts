import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {
  readonly isSignUp = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly loginForm: FormGroup;
  readonly cadastroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  switchToSignUp(): void {
    this.errorMessage.set(null);
    this.isSignUp.set(true);
  }

  switchToSignIn(): void {
    this.errorMessage.set(null);
    this.isSignUp.set(false);
  }

  onSubmitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, senha } = this.loginForm.getRawValue();

    this.authService.login({ email: email!, senha: senha! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/app']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.status === 401
            ? 'Email ou senha incorretos.'
            : 'Não foi possível entrar. Tente novamente.'
        );
      },
    });
  }

  onSubmitCadastro(): void {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { nome, email, senha } = this.cadastroForm.getRawValue();

    this.authService.cadastrar({ nome: nome!, email: email!, senha: senha! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/app']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.status === 409
            ? 'Este email já está cadastrado.'
            : 'Não foi possível cadastrar. Tente novamente.'
        );
      },
    });
  }
}