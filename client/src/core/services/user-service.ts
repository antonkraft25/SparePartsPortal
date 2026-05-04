import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserList } from '../../types/userList';
import { PaginatedResult } from '../../types/paginated-result';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getUsers(pageNumber: number = 1, pageSize: number = 10) {
    return this.http.get<PaginatedResult<UserList>>(
      this.baseUrl + `user?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
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
