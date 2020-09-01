import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { delay, map, switchMap, take } from 'rxjs/operators';

import { UserService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private userService: UserService, private http: HttpClient) { }

  requestData$ = this.userService.isLoggedIn$.pipe(
    delay(1000),
    switchMap((loggedIn) => {
      if (!loggedIn) {
        return throwError(new HttpErrorResponse({ status: 401, statusText: 'Nicht eingeloggt!' }));
      } else {
        return this.userService.isTokenValid$.pipe(take(1));
      }
    }),
    switchMap((isTokenValid) => {
      if (isTokenValid) {
        return of(Math.ceil(Math.random() * 6));
      } else {
        return throwError(new HttpErrorResponse({ status: 401, statusText: 'Token ungültig!' }));
      }
    }),
    take(1),
  );

  fetchCat(text?: string): Observable<CatImage[]> {
    return from(fetch('https://api.thecatapi.com/v1/images/search?size=small&mime_types=jpg')).pipe(
      switchMap((response) => response.json()),
      map(data => data as CatImage[])
    );
  }
}

export interface CatImage {
  id: string;
  url: string;
  categories: any[];
  breeds: any[];
}
