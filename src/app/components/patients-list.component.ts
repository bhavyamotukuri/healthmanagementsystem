import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})
export class PatientsListComponent implements OnInit {
  private svc = inject(PatientService);

  patients: Patient[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.svc.list().subscribe({
      next: (data) => { this.patients = data; this.loading = false; },
      error: (err: HttpErrorResponse) => {
        this.error = err.status === 0
          ? 'Backend not reachable on port 8080. Start Spring Boot and refresh.'
          : 'Failed to load patients';
        this.loading = false;
        console.error(err);
      }
    });
  }

  delete(p: Patient): void {
    if (!p.id) return;
    if (!confirm(`Delete ${p.name}?`)) return;
    this.svc.delete(p.id).subscribe({
      next: () => this.load(),
      error: (err: HttpErrorResponse) => {
        const msg = err.status === 0
          ? 'Delete failed: Backend not reachable. Start Spring Boot on port 8080.'
          : `Delete failed: ${err.message}`;
        alert(msg);
        console.error(err);
      }
    });
  }
}