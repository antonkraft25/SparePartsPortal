import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../core/services/user-service';
import { UserCreate } from '../user-create/user-create';
import { RouterLink } from '@angular/router';
import { UserList } from '../../../types/userList';
import { Paginator } from '../../../shared/paginator/paginator';


@Component({
  selector: 'app-users-list',
  imports: [UserCreate, RouterLink, Paginator],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersList implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  users: UserList[] = [];
  totalCount = 0;
  totalPages = 0;
  pageNumber = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.pageNumber, this.pageSize).subscribe({
      next: (data) => {
        this.users = data.items;
        this.totalCount = data.totalCount;
        this.totalPages = data.totalPages;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading users:', err),
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  onUserCreated() {
    this.loadUsers();
  }
}
