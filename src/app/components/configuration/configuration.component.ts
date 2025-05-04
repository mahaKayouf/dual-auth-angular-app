import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  authProvider = environment.features.useAzureAD ? 'Azure AD' : 'Keycloak';
  providerConfig: any;
  
  constructor() {}
  
  ngOnInit(): void {
    // Get the configuration for the current auth provider
    this.providerConfig = environment.features.useAzureAD 
      ? this.sanitizeConfig(environment.azureAD) 
      : this.sanitizeConfig(environment.keycloak);
  }
  
  // Remove sensitive information from config before displaying
  private sanitizeConfig(config: any): any {
    const sanitized = { ...config };
    
    // Replace sensitive values with placeholders
    if (sanitized.clientId) {
      sanitized.clientId = this.maskString(sanitized.clientId);
    }
    
    return sanitized;
  }
  
  private maskString(str: string): string {
    if (str.length <= 8) {
      return '********';
    }
    
    return str.substring(0, 4) + '****' + str.substring(str.length - 4);
  }
}