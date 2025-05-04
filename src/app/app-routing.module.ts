import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from './guard/auth.guard';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { RoleGuard } from './guard/role.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'profile', 
    component: UserProfileComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'configuration', 
    component: ConfigurationComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
