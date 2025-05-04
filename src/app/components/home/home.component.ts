import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, UserInfo } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isAdmin = false;
  currentUser: UserInfo | null = null;
  authProvider = environment.features.useAzureAD ? 'Azure AD' : 'Keycloak';
  private userSubscription: Subscription | null = null;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.isAdmin = user ? user.roles.includes('Admin') : false;
      this.currentUser = user;
    });
  }
  
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  
  login(): void {
    this.authService.login();
  }
}