import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthStore} from "../authentication/auth-store";

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  if (auth.isTokenNotValid()) {
    router.navigate(['login']);
  console.log("auth guard - false")
    return false;
  }
  console.log("auth guard - true")
  return true;
};
