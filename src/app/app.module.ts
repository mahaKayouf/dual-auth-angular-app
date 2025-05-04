import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterModule } from '@angular/router';

// Material Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Azure AD Modules
import { MsalModule, MsalInterceptor, MsalGuard, MsalService, MsalBroadcastService, MSAL_INSTANCE } from '@azure/msal-angular';
import { InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';

// Keycloak Module
import { KeycloakAngularModule } from 'keycloak-angular';

// App Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

// App Services
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guard/auth.guard';
import { RoleGuard } from './guard/role.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Environment
import { environment } from '../environments/environment';
import { APP_ROUTES } from './app-routing.module';
import { msalConfig } from './auth.config';

// App Routes
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

export function initializeMsal(msalService: MsalService): () => Promise<void> {
  return async () => {
      await msalService.instance.initialize();
  };
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserProfileComponent,
    ConfigurationComponent,
    LoginComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(APP_ROUTES),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    // Material Modules
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    // Auth Modules
    KeycloakAngularModule,
    MsalModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    RoleGuard,
    MsalService, MsalGuard, MsalBroadcastService,
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeMsal,
      deps: [MsalService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: environment.features.useAzureAD ? MsalInterceptor : AuthInterceptor,
      multi: true
    } as any
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }