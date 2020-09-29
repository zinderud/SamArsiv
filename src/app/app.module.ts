import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { LOCALE_ID, Injectable, ErrorHandler } from '@angular/core';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import * as Sentry from '@sentry/browser';

import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  MatPaginatorModule,
  MatPaginatorIntl
} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';

import { ConfirmationComponent } from '../shared/components/confirmation/confirmation.component';


import { gettrTRPaginatorIntl } from '../shared/i18n/material/trTR-paginator-intl';
import { HttpConfigInterceptor } from '../shared/interceptors/http.token.interceptor';
import { DisplayNamesPipe } from '../shared/pipes/display-names/display-names.pipe';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './home/home.component';
import { ArchiveAddComponent } from './archive/archive-add/archive-add.component';
import { ArchiveListComponent } from './archive/archive-list/archive-list.component';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {
    if (environment.production) {
      Sentry.init({
        dsn: '493f577b9f944667b3d73db1ccd63b09@o454464.ingest.sentry.io/5444432'
      });
    }
  }
  handleError(error) {
    console.error(error);
    if (environment.production) {
      Sentry.captureException(error.originalError || error);
      throw error;
    }
  }
}

registerLocaleData(localeTr, 'tr-TR');

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

const appRoutes: Routes = [
  { path: '', component: ArchiveListComponent },
  { path: 'arsiv', component: ArchiveListComponent },
  { path: 'arsiv/:id', component: ArchiveAddComponent },
  { path: '', component: ArchiveListComponent },
  { path: 'home', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,

    ConfirmationComponent, ArchiveAddComponent, ArchiveListComponent,
    DisplayNamesPipe,
    HomeComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    NgxMaskModule.forRoot(options),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    MatChipsModule,
    MatIconModule,
    MatTabsModule,
    MatBadgeModule,
    MatDividerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatStepperModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSelectModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: gettrTRPaginatorIntl() },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' },
    { provide: LOCALE_ID, useValue: 'tr-TR' },
    {
      provide: ErrorHandler,
      useClass: SentryErrorHandler
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationComponent,
  ]
})
export class AppModule { }
