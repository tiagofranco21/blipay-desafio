import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoanFormComponent } from './pages/loan-form/loan-form.component';
import { LoanListComponent } from './pages/loan-list/loan-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'form', component: LoanFormComponent },
  { path: 'list', component: LoanListComponent },
];
