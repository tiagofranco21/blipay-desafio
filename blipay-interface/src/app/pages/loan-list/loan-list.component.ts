import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan';
import { ModalService } from '../../services/modal.service';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [NgxMaskDirective, CommonModule, FormsModule],
  providers: [provideNgxMask({ dropSpecialCharacters: false })],
  templateUrl: './loan-list.component.html',
})
export class LoanListComponent {
  loans: Loan[] = [];
  cpf: string = '';
  isLoading = false;

  constructor(private api: LoanService, private modalService: ModalService) {}

  search(): void {
    this.isLoading = true;

    this.api.getAll(this.cpf).subscribe((data) => {
      if (!data.length) {
        this.modalService.show(
          'Nenhum resultado',
          'Nenhum empréstimo encontrado para o CPF informado.',
          'info'
        );
      }
      this.loans = data;
      this.isLoading = false;
    });
  }
}
