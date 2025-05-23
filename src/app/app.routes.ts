import { Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer/customer.component';
import { CustomerFormComponent } from './customer/customer-form/customer-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: 'customers', component: CustomerComponent },
  { path: 'customer/create', component: CustomerFormComponent }
];
