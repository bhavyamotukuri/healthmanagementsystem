import { Routes } from '@angular/router';
import { PatientsListComponent } from './components/patients-list.component';
import { PatientFormComponent } from './components/patient-form.component';
import { BmiComponent } from './components/bmi.component';

export const routes: Routes = [
  { path: '', component: PatientsListComponent },
  { path: 'add', component: PatientFormComponent },
  { path: 'edit/:id', component: PatientFormComponent },
  { path: 'bmi', component: BmiComponent },
  { path: '**', redirectTo: '' }
];