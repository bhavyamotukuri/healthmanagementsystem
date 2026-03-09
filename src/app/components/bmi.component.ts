import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { BmiResult } from '../models/bmi-result';

@Component({
  selector: 'app-bmi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bmi.component.html',
  styleUrls: ['./bmi.component.scss']
})
export class BmiComponent {
  private svc = inject(PatientService);

  heightCm: number | null = 170;
  weightKg: number | null = 70;
  result: BmiResult | null = null;

  calc(): void {
    const h = this.heightCm;
    const w = this.weightKg;
    if (!h || !w || h <= 0 || w <= 0) {
      alert('Enter valid height and weight');
      return;
    }
    this.svc.bmi(h, w).subscribe({
      next: r => this.result = r,
      error: (e: HttpErrorResponse) => {
        const msg = e.status === 0
          ? 'Failed to compute BMI: Backend not reachable. Start Spring Boot on port 8080.'
          : `Failed to compute BMI: ${e.message}`;
        console.error(e);
        alert(msg);
      }
    });
  }
}