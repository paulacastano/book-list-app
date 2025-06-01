import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token = signal<string | null>(localStorage.getItem('token'));
  private apiUrl = 'http://localhost:8000/users';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post<any>(this.apiUrl + '/token', body).pipe(
      tap((response) => {
        localStorage.setItem('token', response.access_token);
        this.token.set(response.access_token);
      })
    );
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
  }

  isLoggedIn = computed(() => !!this.token());

  getToken(): string | null {
    return this.token();
  }
}
