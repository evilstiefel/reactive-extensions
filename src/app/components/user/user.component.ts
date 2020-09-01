import { animate, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, throwError } from 'rxjs';
import { finalize, retryWhen, switchMap } from 'rxjs/operators';
import { LoginModalComponent } from 'src/app/modals/login-modal/login-modal.component';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user-service.service';

import { UniqueElement } from './user.interfaces';
import { trackLast, lastN } from './user.operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [
    trigger('rollResult', [
      transition(':enter', [
        style({
          opacity: 0,
        }),
        animate('0.2s', style({
          opacity: 1,
        }))
      ]),
    ])
  ]
})
export class UserComponent {

  isLoggedIn$: Observable<boolean>;
  isTokenValid$: Observable<boolean>;
  userToken$: Observable<string>;

  roll$: Subject<number>;
  rolls$: Observable<UniqueElement<number>[]>;
  automaticRetry = false;
  requestRunning = false;

  constructor(
    readonly userService: UserService,
    readonly dataService: DataService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {
    this.isLoggedIn$ = this.userService.isLoggedIn$;
    this.isTokenValid$ = this.userService.isTokenValid$;
    this.userToken$ = this.userService.userToken$;
    this.roll$ = new Subject<number>();

    this.rolls$ = this.roll$.pipe(
      trackLast<number>(6),
    );
  }

  updateData(): void {
    this.requestRunning = true;
    this.dataService.requestData$.pipe(
      retryWhen((errors: Observable<HttpErrorResponse>) =>
        errors.pipe(
          switchMap((error) => this.retryLogic(error))
        )
      ),
      finalize(() => this.requestRunning = false)
    ).subscribe(
      (data) => this.roll$.next(data),
      (err) => this.handleError(err)
    );
  }

  retryLogic(error: HttpErrorResponse): Observable<boolean> {
    if (!this.automaticRetry) {
      return throwError(error);
    }
    if (error.status === 401) {
      const dialogRef = this.dialog.open(LoginModalComponent, {
        data: {
          message: error.statusText
        }
      });
      return dialogRef.afterClosed().pipe(
        switchMap((shouldRetry) => {
          if (shouldRetry) {
            return this.userService.login('Testnutzer');
          } else {
            return throwError(new Error(error.statusText));
          }
        })
      );
    } else {
      return throwError(new Error('Unbekannter Fehler mit der API'));
    }
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      this.snackbar.open(`Fehler: ${error.statusText}`, '', { duration: 4000 });
    } else if (error instanceof Error) {
      this.snackbar.open(error.message, '', { duration: 4000 });
    } else {
      this.snackbar.open('Ein unbekannter Fehler ist aufgetreten!', '', { duration: 4000 });
    }
  }

  trackRolls(index: number, element: UniqueElement<number>) {
    return element.id;
  }
}
