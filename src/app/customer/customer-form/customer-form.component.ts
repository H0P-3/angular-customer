import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Customer } from '../customer/customer.model';
import { CustomerService } from '../customer.service';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  standalone: true
})
export class CustomerFormComponent implements OnInit, OnDestroy {
  customerForm: FormGroup;
  selectedCustomer: Customer | null = null;
  formMode: 'add' | 'edit' = 'add';
  private subscription: Subscription = new Subscription();
  isDialog = false;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    public router: Router,
    private route: ActivatedRoute,
    @Optional() private dialogRef: MatDialogRef<CustomerFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.customerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[+\d\s-]+$/)]],
      zipCode: ['', [Validators.required]],
      website: ['', [Validators.required, Validators.pattern(/^(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/)]]
    });
    
    // Check if we're in dialog mode
    this.isDialog = !!this.dialogRef;
    
    // If we have data from dialog, use it
    if (this.data && this.data.customer) {
      this.selectedCustomer = this.data.customer;
      this.formMode = this.data.mode || 'edit';
      this.customerForm.patchValue({
        name: this.selectedCustomer?.name,
        address: this.selectedCustomer?.address,
        phoneNumber: this.selectedCustomer?.phoneNumber,
        zipCode: this.selectedCustomer?.zipCode,
        website: this.selectedCustomer?.website
      });
    }
  }

  ngOnInit(): void {
    // Only subscribe to selected customer if we're not in dialog mode
    if (!this.isDialog) {
      // Check if we're in standalone mode (separate page)
      if (this.router.url === '/customer/create') {
        this.formMode = 'add';
        this.customerForm.reset();
      } else {
        // Only subscribe to selected customer if we're in the main page
        this.subscription.add(
          this.customerService.getSelectedCustomer().subscribe(customer => {
            this.selectedCustomer = customer;
            if (customer) {
              this.formMode = 'edit';
              this.customerForm.patchValue({
                name: customer.name,
                address: customer.address,
                phoneNumber: customer.phoneNumber,
                zipCode: customer.zipCode,
                website: customer.website
              });
            } else if (this.formMode === 'edit') {
              this.formMode = 'add';
              this.customerForm.reset();
            }
          })
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.markFormGroupTouched(this.customerForm);
      return;
    }

    const customerData = this.customerForm.value;
    
    if (this.formMode === 'add') {
      this.customerService.addCustomer({
        id: 0, // Will be assigned by service
        ...customerData
      });
      this.resetForm();
      
      // If we're on the create page, navigate back to customers list
      if (this.router.url === '/customer/create') {
        this.router.navigate(['/customers']);
      }
      
      // If we're in a dialog, close it
      if (this.isDialog) {
        this.dialogRef.close(true);
      }
    } else {
      this.customerService.updateCustomer({
        id: this.selectedCustomer!.id,
        ...customerData
      });
      
      // If we're in a dialog, close it
      if (this.isDialog) {
        this.dialogRef.close(true);
      }
    }
  }

  resetForm(): void {
    this.formMode = 'add';
    this.customerForm.reset();
    
    // If we're on the create page and cancel, go back to customers list
    if (this.router.url === '/customer/create') {
      this.router.navigate(['/customers']);
    } else if (this.selectedCustomer !== null && !this.isDialog) {
      this.customerService.setSelectedCustomer(null);
    }
    
    // If we're in a dialog, close it
    if (this.isDialog) {
      this.dialogRef.close();
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
