import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient';
import { catchError, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {
  private svc = inject(PatientService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null;
  title = 'Add Patient';

  model: Patient = {
    name: '',
    age: 0,
    gender: 'Other',
    heightCm: null,
    weightKg: null,
    conditions: []
  };

  conditionsText = '';

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(idParam => {
          if (!idParam) {
            this.id = null;
            this.title = 'Add Patient';
            return of<Patient | null>(null);
          }

          const id = Number(idParam);
          if (!Number.isFinite(id)) {
            return of<Patient | null>(null);
          }

          this.id = id;
          this.title = 'Edit Patient';

          return this.svc.get(id).pipe(
            catchError(() =>
              this.svc.list().pipe(
                map(list => list.find(p => p.id === id) ?? null)
              )
            )
          );
        })
      )
      .subscribe({
        next: (p) => {
          if (!p) {
            return;
          }
          this.patchModel(p);
        },
        error: () => alert('Failed to load patient')
      });
  }

  private patchModel(p: Patient): void {
    this.model = {
      id: p.id,
      name: p.name,
      age: p.age,
      gender: p.gender,
      heightCm: p.heightCm ?? null,
      weightKg: p.weightKg ?? null,
      conditions: p.conditions ?? []
    };
    this.conditionsText = (this.model.conditions ?? []).join(', ');
  }

  submit(): void {
    this.model.conditions = this.parseConditions(this.conditionsText);
    if (!this.model.name || !this.model.age || !this.model.gender) {
      alert('Name, Age and Gender are required');
      return;
    }

    if (this.id) {
      this.svc.update(this.id, this.model).subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (e: HttpErrorResponse) => {
          console.error(e);
          alert(this.toErrorMessage('Update failed', e));
        }
      });
    } else {
      this.svc.create(this.model).subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (e: HttpErrorResponse) => {
          console.error(e);
          alert(this.toErrorMessage('Create failed', e));
        }
      });
    }
  }

  private parseConditions(text: string): string[] {
    return text.split(',').map(s => s.trim()).filter(Boolean);
  }

  private toErrorMessage(prefix: string, err: HttpErrorResponse): string {
    if (err.status === 0) {
      return `${prefix}: Backend not reachable. Start Spring Boot on port 8080.`;
    }

    const serverMsg = typeof err.error === 'string'
      ? err.error
      : err.error?.message || err.message;

    return `${prefix}: ${serverMsg}`;
  }
}