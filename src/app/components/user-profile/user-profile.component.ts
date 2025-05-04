import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, UserInfo } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  currentUser: UserInfo | null = null;
  isAdmin = false;
  authProvider = environment.features.useAzureAD ? 'Azure AD' : 'Keycloak';
  private userSubscription: Subscription | null = null;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user ? user.roles.includes('Admin') : false;
    });
  }
  
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}