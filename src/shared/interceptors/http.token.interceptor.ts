import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(private _snackBar: MatSnackBar) { }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (
            /*  event.url.startsWith('https://zinde.com') && */
            event.body.erro
          ) {
            throw new HttpErrorResponse({
              ...event,
              error: 'hata.'
            });
          }
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        this._snackBar.open(error.error, null, {
          duration: 5000
        });

        return throwError(error);
      })
    );
  }
}
