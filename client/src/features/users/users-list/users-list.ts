import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../core/services/user-service';
import { UserCreate } from '../user-create/user-create';
import { UserList } from '../../../types/userList';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users-list',
  imports: [UserCreate, RouterLink],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersList implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  users: UserList[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  onUserCreated() {
    this.loadUsers();
  }
}