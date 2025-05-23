// CustomerComponent
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from './customer.model';
import { CustomerService } from '../customer.service';
import { CommonModule } from '@angular/common';
import { CustomerFilterComponent } from "../customer-filter/customer-filter.component";
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CustomerFormComponent } from "../customer-form/customer-form.component";
import { MatDialog } from '@angular/material/dialog';
import { CustomerDetailsComponent } from "../customer-details/customer-details.component";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  imports: [CommonModule, CustomerFilterComponent, MatIconModule, MatButtonModule],
  providers: [CustomerFormComponent, CustomerDetailsComponent],
  standalone: true
})
export class CustomerComponent implements OnInit {
  customers$: Observable<Customer[]>;
  selectedCustomer$: Observable<Customer | null>;
  displayedColumns: string[] = ['name', 'address', 'phoneNumber', 'zipCode', 'website', 'actions'];

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.customers$ = this.customerService.getCustomers();
    this.selectedCustomer$ = this.customerService.getSelectedCustomer();
  }

  ngOnInit(): void {
  }

  navigateToCreateCustomer(): void {
    console.log('Navigating to create customer');
    this.router.navigate(['/customer/create']);
  }

  viewCustomer(customer: Customer): void {
    this.customerService.setSelectedCustomer(customer);
    
    const dialogRef = this.dialog.open(CustomerDetailsComponent, {
      width: '500px',
      data: { customer: customer }
    });
  }

  editCustomer(customer: Customer, event: Event): void {
    event.stopPropagation();
    this.customerService.setSelectedCustomer(customer);
    
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      width: '900px',
      data: { customer: customer, mode: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        
        this.customerService.setSelectedCustomer(null);
      }
    });
  }

  deleteCustomer(customer: Customer, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      this.customerService.deleteCustomer(customer.id);
    }
  }
}
