import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanListComponent } from './loan-list.component';
import { LoanService } from '../../services/loan.service';
import { of } from 'rxjs';
import { Loan } from '../../models/loan';
import { By } from '@angular/platform-browser';
import { ModalService } from '../../services/modal.service';

describe('LoanListComponent', () => {
  let component: LoanListComponent;
  let fixture: ComponentFixture<LoanListComponent>;
  let mockService: jasmine.SpyObj<LoanService>;
  let mockModal: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('LoanService', ['getAll']);
    mockModal = jasmine.createSpyObj('ModalService', ['show']);

    await TestBed.configureTestingModule({
      imports: [LoanListComponent],
      providers: [
        { provide: LoanService, useValue: mockService },
        { provide: ModalService, useValue: mockModal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanListComponent);
    component = fixture.componentInstance;
  });

  it('should fetch and render credit scores on init', () => {
    const cpf = '123.456.789-00';

    const mockData: Loan[] = [
      {
        name: 'User Test',
        age: 32,
        monthlyIncome: 5000,
        city: 'Rio de Janeiro',
        cpf: '123.456.789-00',
        score: 350,
        approved: true,
      },
      {
        name: 'User Test',
        age: 28,
        monthlyIncome: 1500.04,
        city: 'São Paulo',
        cpf: '123.456.789-00',
        score: 150,
        approved: false,
      },
    ];
    component.cpf = cpf;

    mockService.getAll.and.returnValue(of(mockData));

    component.search();
    fixture.detectChanges();

    expect(component.loans.length).toBe(2);
    expect(mockService.getAll).toHaveBeenCalled();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);

    const firstRow = rows[0].nativeElement;
    expect(firstRow.textContent).toContain('User Test');
    expect(firstRow.textContent).toContain(32);
    expect(firstRow.textContent).toContain('R$5,000.00');
    expect(firstRow.textContent).toContain('Rio de Janeiro');
    expect(firstRow.textContent).toContain('123.456.789-00');
    expect(firstRow.textContent).toContain(350);
    expect(firstRow.textContent).toContain('Aprovado');

    const secondRow = rows[1].nativeElement;
    expect(secondRow.textContent).toContain('User Test');
    expect(secondRow.textContent).toContain(28);
    expect(secondRow.textContent).toContain('R$1,500.04');
    expect(secondRow.textContent).toContain('São Paulo');
    expect(secondRow.textContent).toContain('123.456.789-00');
    expect(secondRow.textContent).toContain(150);
    expect(secondRow.textContent).toContain('Reprovado');
  });

  it('should show info modal if no loans are returned', () => {
    const cpf = '000.000.000-00';
    component.cpf = cpf;
    mockService.getAll.and.returnValue(of([]));

    component.search();
    fixture.detectChanges();

    expect(mockService.getAll).toHaveBeenCalledWith(cpf);
    expect(mockModal.show).toHaveBeenCalledWith(
      'Nenhum resultado',
      'Nenhum empréstimo encontrado para o CPF informado.',
      'info'
    );
    expect(component.loans.length).toBe(0);
  });
});
