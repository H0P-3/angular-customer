// CustomerService
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Customer } from './customer/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customers: Customer[] = [
    { 
      id: 1, 
      name: 'GT Bank Corporate', 
      address: '635 Marina Street, Lagos', 
      phoneNumber: '+2347034567824', 
      zipCode: '101244', 
      website: 'www.gtbank.com' 
    },
    { 
      id: 2, 
      name: 'Oando PLC', 
      address: '2 Ajose Adeogun Street, Victoria Island', 
      phoneNumber: '+2347034567856', 
      zipCode: '101255', 
      website: 'www.oandoplc.com' 
    },
    { 
      id: 3, 
      name: 'Dangote Group', 
      address: '1 Alfred Rewane Road, Ikoyi', 
      phoneNumber: '+2347034567888', 
      zipCode: '101266', 
      website: 'www.dangote.com' 
    },
    { 
      id: 4, 
      name: 'PWAN Group', 
      address: '24 Adeola Odeku Street, Victoria Island', 
      phoneNumber: '+2347034567821', 
      zipCode: '101290', 
      website: 'www.pwang.com' 
    }
  ];

  private customersSubject = new BehaviorSubject<Customer[]>(this.customers);
  private selectedCustomerSubject = new BehaviorSubject<Customer | null>(null);

  constructor() { }

  getCustomers(): Observable<Customer[]> {
    return this.customersSubject.asObservable();
  }

  getSelectedCustomer(): Observable<Customer | null> {
    return this.selectedCustomerSubject.asObservable();
  }

  setSelectedCustomer(customer: Customer | null): void {
    // Only update if the value is different to prevent unnecessary emissions
    const currentValue = this.selectedCustomerSubject.value;
    if (JSON.stringify(currentValue) !== JSON.stringify(customer)) {
      this.selectedCustomerSubject.next(customer);
    }
  }

  addCustomer(customer: Customer): void {
    const newId = Math.max(...this.customers.map(c => c.id), 0) + 1;
    const newCustomer = { ...customer, id: newId };
    this.customers = [...this.customers, newCustomer];
    this.customersSubject.next(this.customers);
  }

  updateCustomer(customer: Customer): void {
    this.customers = this.customers.map(c => 
      c.id === customer.id ? customer : c
    );
    this.customersSubject.next(this.customers);
    this.selectedCustomerSubject.next(customer);
  }

  deleteCustomer(id: number): void {
    this.customers = this.customers.filter(c => c.id !== id);
    this.customersSubject.next(this.customers);
    if (this.selectedCustomerSubject.value?.id === id) {
      this.selectedCustomerSubject.next(null);
    }
  }

  filterCustomers(filterTerm: string): void {
    if (!filterTerm) {
      this.customersSubject.next(this.customers);
      return;
    }
    
    const filteredCustomers = this.customers.filter(customer => 
      customer.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
      customer.address.toLowerCase().includes(filterTerm.toLowerCase()) ||
      customer.phoneNumber.toLowerCase().includes(filterTerm.toLowerCase()) ||
      customer.zipCode.toLowerCase().includes(filterTerm.toLowerCase()) ||
      customer.website.toLowerCase().includes(filterTerm.toLowerCase())
    );
    
    this.customersSubject.next(filteredCustomers);
  }
}
