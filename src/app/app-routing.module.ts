import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {PagenotfoundComponent} from './pagenotfound/pagenotfound.component';

const routes: Routes = [
  {path: '', component: LoginComponent },
  {path: 'Login', component: LoginComponent},
  {path: 'Signup', component: SignupComponent},
  {path: 'Profile', component: DashboardComponent},  
  { path: '**', component: PagenotfoundComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes)
