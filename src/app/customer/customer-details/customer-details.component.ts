import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Customer } from '../customer/customer.model';

// CustomerDetailsComponent
@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  standalone: true
})
export class CustomerDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<CustomerDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customer: Customer }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}