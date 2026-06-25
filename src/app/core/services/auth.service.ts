import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_URL } from '../config/api.config';
import { AuthRequest, AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = API_URL;
  private readonly tokenKey = 'lvn_admin_token';
  private readonly tokenSubject = new BehaviorSubject<string>(localStorage.getItem(this.tokenKey) || '');

  readonly token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  get token(): string {
    return this.tokenSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/login`, request).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.tokenSubject.next(response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.tokenSubject.next('');
  }

  authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.token}` });
  }
}
