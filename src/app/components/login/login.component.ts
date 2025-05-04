import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authProvider = environment.features.useAzureAD ? 'Azure AD' : 'Keycloak';
  
  constructor(private authService: AuthService) {}
  
  login(): void {
    this.authService.login();
  }
}