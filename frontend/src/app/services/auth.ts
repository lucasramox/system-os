import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token?: string;
  user?: any;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  constructor(private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getUser(): any | null {
    if (this.isBrowser) {
      const user = localStorage.getItem('user');
      try {
        return user ? JSON.parse(user) : null;
      } catch (e) {
        console.warn('Erro ao parsear user do localStorage', e);
        return null;
      }
    }
    return null;
  }


  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials);
  }


  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/user/register`, userData);
  }

  saveToken(token: string, user: any): void {
    if (this.isBrowser) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', user);
    }
  }


  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }


  isLoggedIn(): boolean {
    if (this.isBrowser) {
      return !!this.getToken();
    }
    return false;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }
}
