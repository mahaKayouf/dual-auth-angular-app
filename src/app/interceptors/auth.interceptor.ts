import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private keycloakService: KeycloakService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip if using Azure AD
    if (environment.features.useAzureAD) {
      return next.handle(request);
    }
    
    // Skip for certain URLs
    const excludedUrls = ['/assets'];
    if (excludedUrls.some(url => request.url.includes(url))) {
      return next.handle(request);
    }
    
    return from(this.keycloakService.getToken()).pipe(
      switchMap(token => {
        if (token) {
          const authRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(authRequest);
        }
        return next.handle(request);
      })
    );
  }
}