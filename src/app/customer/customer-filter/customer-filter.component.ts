// CustomerFilterComponent
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CustomerService } from '../customer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-filter',
  templateUrl: './customer-filter.component.html',
  styleUrls: ['./customer-filter.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class CustomerFilterComponent implements OnInit {
  filterControl = new FormControl('');

  constructor(private customerService: CustomerService) { }

  // CustomerFilterComponent
  ngOnInit(): void {
    this.filterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.customerService.filterCustomers(value || '');
    });
  }

  clearFilter(): void {
    this.filterControl.setValue('');
  }
}
