import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../services/loan.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ModalService } from '../../services/modal.service';
import { LoanResponseError } from '../../models/loan';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective,
    NgxCurrencyDirective,
  ],
  providers: [provideNgxMask({ dropSpecialCharacters: false })],
  templateUrl: './loan-form.component.html',
})
export class LoanFormComponent {
  form: FormGroup;
  isSubmitting = false;

  currencyMaskConfig = {
    prefix: 'R$ ',
    min: 0,
    thousands: '.',
    decimal: ',',
    align: 'left',
  };

  constructor(
    private fb: FormBuilder,
    private api: LoanService,
    private modalService: ModalService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(18)]],
      monthlyIncome: [null, [Validators.required, Validators.min(0)]],
      city: ['', Validators.required],
      cpf: ['', [Validators.required]],
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.touched && control.invalid);
  }
  hasError(field: string, errorCode: string): boolean {
    const control = this.form.get(field);
    return !!(control?.touched && control.errors?.[errorCode]);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    this.api.create(this.form.value).subscribe({
      next: (data) => {
        const approved = data.score > 200;

        if (approved) {
          this.modalService.show(
            'Resposta',
            'Crédito aprovado com sucesso!',
            'success'
          );
          this.form.reset();
        } else {
          this.modalService.show(
            'Resposta',
            'Seu emprestimo foi negado. <br>Infelizmente, seu score não é suficiente.',
            'warning'
          );
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        if (err?.error?.errors) {
          const backendErrors = err.error as LoanResponseError;
          const msgs = Object.entries(backendErrors.errors)
            .map(([_, msg]) => `${msg}`)
            .join('<br/>');

          this.modalService.show('Erro de Validação', msgs, 'danger');
        } else {
          this.modalService.show(
            'Erro',
            'Ocorreu um erro inesperado ao enviar os dados.',
            'danger'
          );
        }
        this.isSubmitting = false;
      },
    });
  }
}
