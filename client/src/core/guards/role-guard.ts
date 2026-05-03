import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account-service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const accountService = inject(AccountService);
    const router = inject(Router);

    const user = accountService.currentUser();

    if (!user) {
      router.navigateByUrl('/login');
      return false;
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    router.navigateByUrl('/');
    return false;
  };
};
