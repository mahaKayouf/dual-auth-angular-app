import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, UserInfo } from './services/auth.service';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isAdmin = false;
  userName = '';
  private userSubscription: Subscription | null = null;
  
  constructor(
    private authService: AuthService,

  ) {}
  
  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.isAdmin = user ? user.roles.includes('Admin') : false;
      this.userName = user ? user.name : '';
    });
    
    // Check for PWA updates
    // if (this.swUpdate.isEnabled) {
    //   this.swUpdate.available.subscribe(() => {
    //     const snackBarRef = this.snackBar.open('New version available', 'Update', {
    //       duration: 6000
    //     });
        
    //     snackBarRef.onAction().subscribe(() => {
    //       window.location.reload();
    //     });
    //   });
    // }
  }
  
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  
  logout(): void {
    this.authService.logout();
  }
}