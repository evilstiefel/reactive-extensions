import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);
  token$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  userToken$ = this.user$.pipe(
    filter(user => !!user),
    map(user => user.token)
  );

  isTokenValid$ = combineLatest(
    this.token$,
    this.userToken$
  ).pipe(
    map(([token, userToken]) => userToken === token)
  );

  isLoggedIn$ = this.user$.pipe(
    map(user => !!user)
  );
  constructor() { }

  login(username: string): Observable<boolean> {
    const token = uuid();
    this.user$.next({
      token,
      username
    });
    this.token$.next(token);
    return of(true);
  }

  logout(): void {
    this.user$.next(null);
  }

  invalidateToken(): void {
    this.token$.next(uuid());
  }
}

export interface IUser {
  username: string;
  token: string;
}
