import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, User } from '../../types/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);
  private readonly defaultApiUrl = 'https://localhost:7064/api/';
  private baseUrl = environment.apiUrl;
  private readonly localStorageKey = 'user';

  constructor() {
    const stored = localStorage.getItem(this.localStorageKey);
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }

  login(creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds);
  }

  setCurrentUser(user: User) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(user));
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem(this.localStorageKey);
    this.currentUser.set(null);
  }

  resetPassword(email: string, newPassword: string) {
    return this.http.post(this.baseUrl + 'account/reset-password', { email, newPassword }, { responseType: 'text' });
  }
}
