import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { MsalService } from '@azure/msal-angular';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private msalService: MsalService,
    private keycloakService: KeycloakService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (environment.features.useAzureAD) {
      return this.checkAzureAuth(state);
    } else {
      return this.checkKeycloakAuth();
    }
  }

  private async checkAzureAuth(state: RouterStateSnapshot): Promise<boolean> {
    if (await this.authService.isAuthenticated()) {
      return true;
    }
    
    this.msalService.loginRedirect({
      scopes: environment.azureAD.scopes,
      redirectStartPage: state.url
    });
    
    return false;
  }

  private async checkKeycloakAuth(): Promise<boolean> {
    if (await this.keycloakService.isLoggedIn()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}