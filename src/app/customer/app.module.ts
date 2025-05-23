// AppModule
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '../app.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerFilterComponent } from './customer-filter/customer-filter.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule, MatIconModule,
    AppComponent,
    CustomerComponent,
    CustomerFormComponent,
    CustomerFilterComponent
  ],
  providers: [],
  // Remove bootstrap array since AppComponent is standalone
})
export class AppModule { }
