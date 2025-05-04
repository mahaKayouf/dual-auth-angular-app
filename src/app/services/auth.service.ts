import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Azure AD imports
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';

// Keycloak imports
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(
    private router: Router,
    private msalService: MsalService,
    private keycloakService: KeycloakService
  ) {
    this.initAuth();
  }

  private async initAuth(): Promise<void> {
    if (environment.features.useAzureAD) {
      await this.initAzureAD();
    } else {
      await this.initKeycloak();
    }
  }

  private async initAzureAD(): Promise<void> {
    try {
    await this.msalService.instance.handleRedirectPromise().then(response => {
      if (response) {
        this.msalService.instance.setActiveAccount(response.account);
      }
    });
  
    const account = this.msalService.instance.getActiveAccount();
    if (account) {
      this.setUserFromAzureAD(account);
    }
  } catch (error) {
    console.error('Azure init failed', error);
  }
  }

  private async initKeycloak(): Promise<void> {
    try {
      await this.keycloakService.init({
        config: {
          url: environment.keycloak.url,
          realm: environment.keycloak.realm,
          clientId: environment.keycloak.clientId,
        },
        initOptions: {
          checkLoginIframe: false,
          redirectUri: environment.keycloak.clientSiteUrl,
        }
      });
      
      if (await this.keycloakService.isLoggedIn()) {
        const profile = await this.keycloakService.loadUserProfile();
        this.setUserFromKeycloak(profile);
      }
    } catch (error) {
      console.error('Keycloak init failed', error);
    }
  }

  private setUserFromAzureAD(account: AccountInfo): void {
    // Extract roles from ID token claims
    const idTokenClaims = account.idTokenClaims as any;
    const roles = idTokenClaims?.roles || [];
    
    const user: UserInfo = {
      id: account.localAccountId,
      name: account.name || account.username || '',
      email: account.username || '',
      roles: roles
    };
    
    this.currentUserSubject.next(user);
  }

  private setUserFromKeycloak(profile: KeycloakProfile): void {
    const roles = this.keycloakService.getUserRoles();
    
    const user: UserInfo = {
      id: profile.id || '',
      name: profile.firstName + ' ' + profile.lastName || '',
      email: profile.email || '',
      roles: roles
    };
    
    this.currentUserSubject.next(user);
  }

  public login(): void {
    if (environment.features.useAzureAD) {
      this.msalService.loginRedirect();
    } else {
      this.keycloakService.login();
    }
  }

  public logout(): void {
    if (environment.features.useAzureAD) {
      this.msalService.logout();
    } else {
      this.keycloakService.logout(window.location.origin);
    }
    this.currentUserSubject.next(null);
  }

  public isAuthenticated(): boolean {
    if (environment.features.useAzureAD) {
      return !!this.msalService.instance.getActiveAccount();
    } else {
      this.keycloakService.isLoggedIn().then(loggedIn => {
        return loggedIn;
      });
    }
    return false;

  }

  public hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    return user.roles.includes(role);
  }

  public getCurrentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }
}