export const environment = {
    production: true,
    features: {
      useAzureAD: true, // Set to false to use Keycloak
    },
    azureAD: {
      clientId: 'AZURE_CLIENT_ID',
      authority: 'AUTHORITY_URL',
      redirectUri: 'REDIRECT_URL',
      scopes: ['user.read']
    },
    keycloak: {
      url: 'KEYCLOAK_URL',
      realm: 'REALM_NAME',
      clientId: 'CLIENT_ID',
      clientSiteUrl: "CLIENT_SITE_URL",
    },
    apiUrl: 'API_URL',
  };