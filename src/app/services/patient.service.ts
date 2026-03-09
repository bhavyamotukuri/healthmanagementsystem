import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';
import { BmiResult } from '../models/bmi-result';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/patients`;

  private toPayload(p: Patient): Omit<Patient, 'id'> {
    const payload: Omit<Patient, 'id'> = {
      name: p.name,
      age: p.age,
      gender: p.gender,
      conditions: p.conditions ?? []
    };

    if (p.heightCm != null) payload.heightCm = p.heightCm;
    if (p.weightKg != null) payload.weightKg = p.weightKg;

    return payload;
  }

  list(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.baseUrl);
  }

  get(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/${id}`);
  }

  create(p: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.baseUrl, this.toPayload(p));
  }

  update(id: number, p: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.baseUrl}/${id}`, this.toPayload(p));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  bmi(heightCm: number, weightKg: number): Observable<BmiResult> {
    return this.http.post<BmiResult>(`${environment.apiBaseUrl}/utils/bmi`, {
      heightCm, weightKg
    });
  }
}