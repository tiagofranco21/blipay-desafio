import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan, LoanResponse } from '../models/loan';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private apiUrl = `${environment.apiUrl}/loan/`;

  constructor(private http: HttpClient) {}

  getAll(cpf: string): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}?cpf=${cpf}`);
  }

  create(score: Loan): Observable<LoanResponse> {
    return this.http.post<LoanResponse>(this.apiUrl, score);
  }
}
