# DualAuthApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## Development server

Run `npm start` or `ng serve` for a development server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Installing dependencies

Run `npm install` to install the required Node.js modules. This step is necessary before running the application or performing any builds.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` or `ng build` to build the project. The build artifacts will be stored in the `dist/dual-auth-app/` directory.

## Running unit tests

Run `npm test` or `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

End-to-end testing is not configured by default. To add end-to-end testing capabilities, you need to install and configure a suitable testing framework.

## Authentication Features

This application supports dual authentication mechanisms:
- **Azure AD**: Configured in `src/environments/environment.ts` and `src/environments/environment.prod.ts` under the `azureAD` section.
- **Keycloak**: Configured in the same files under the `keycloak` section.

To switch between authentication mechanisms, update the `useAzureAD` flag in the `features` section of the environment files.

## Further help

To get more help on the Angular CLI, use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

