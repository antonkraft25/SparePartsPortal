import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserList } from '../../types/userList';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getUsers() {
    return this.http.get<UserList[]>(this.baseUrl + 'user');
  }

  getUser(id: string) {
    return this.http.get<UserList>(this.baseUrl + 'user/' + id);
  }

  createUser(dto: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    customerId: string;
    role: string;
  }) {
    return this.http.post(this.baseUrl + 'user', dto);
  }

  updateUser(
    id: string,
    dto: { firstName: string; lastName: string; email: string; customerId: string; role: string },
  ) {
    return this.http.put(this.baseUrl + 'user/' + id, dto);
  }

  disableUser(id: string) {
    return this.http.put(this.baseUrl + 'user/' + id + '/disable', {});
  }
}
