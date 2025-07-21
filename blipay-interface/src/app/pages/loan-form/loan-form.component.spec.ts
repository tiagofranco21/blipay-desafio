import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanFormComponent } from './loan-form.component';
import { LoanService } from '../../services/loan.service';
import { ModalService } from '../../services/modal.service';
import { of, throwError } from 'rxjs';

describe('LoanFormComponent', () => {
  let component: LoanFormComponent;
  let fixture: ComponentFixture<LoanFormComponent>;
  let mockService: jasmine.SpyObj<LoanService>;
  let modalService: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('LoanService', ['create']);
    modalService = jasmine.createSpyObj('ModalService', ['show']);

    await TestBed.configureTestingModule({
      imports: [LoanFormComponent],
      providers: [
        { provide: LoanService, useValue: mockService },
        { provide: ModalService, useValue: modalService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should mark the form as touched and not call the API if form is invalid', () => {
    component.submit();

    expect(component.form.touched).toBeTrue();
    expect(mockService.create).not.toHaveBeenCalled();
    expect(modalService.show).not.toHaveBeenCalled();
  });

  it('should call the API, show success modal, and reset the form if score is greater than 200', () => {
    const validData = {
      name: 'Rich User',
      age: 30,
      monthlyIncome: 4000.05,
      city: 'São Paulo',
      cpf: '123.456.789-00',
    };

    const fakeResponse = { score: 250, approved: true };

    component.form.setValue(validData);
    mockService.create.and.returnValue(of(fakeResponse));

    component.submit();

    expect(mockService.create).toHaveBeenCalledWith(validData);
    expect(modalService.show).toHaveBeenCalledWith(
      'Resposta',
      'Crédito aprovado com sucesso!',
      'success'
    );
    expect(component.form.value).toEqual({
      name: null,
      age: null,
      monthlyIncome: null,
      city: null,
      cpf: null,
    });
    expect(component.form.pristine).toBeTrue();
    expect(component.form.touched).toBeFalse();
  });

  it('should call the API and show modal if form is valid and not reset form if score is less than 200', () => {
    const validData = {
      name: 'Poor User',
      age: 30,
      monthlyIncome: 4000.05,
      city: 'São Paulo',
      cpf: '123.456.789-00',
    };

    const fakeResponse = { score: 199, approved: false };

    component.form.setValue(validData);
    mockService.create.and.returnValue(of(fakeResponse));

    component.submit();

    expect(mockService.create).toHaveBeenCalledWith(validData);
    expect(modalService.show).toHaveBeenCalledWith(
      'Resposta',
      'Seu emprestimo foi negado. <br>Infelizmente, seu score não é suficiente.',
      'warning'
    );
    expect(component.form.value).toEqual(validData);
  });

  it('should show validation errors if backend returns invalid city (HTTP 400)', () => {
    const validData = {
      name: 'Invalid User',
      age: 25,
      monthlyIncome: 1000.0,
      city: 'city',
      cpf: '000.000.000-00',
    };

    const backendError = {
      errors: {
        city: 'Não foi possível encontrar informações meteorológicas para city',
      },
      message: 'Input payload validation failed',
    };

    mockService.create.and.returnValue(
      throwError(() => ({ error: backendError }))
    );
    component.form.setValue(validData);

    component.submit();

    expect(mockService.create).toHaveBeenCalledWith(validData);
    expect(modalService.show).toHaveBeenCalledWith(
      'Erro de Validação',
      'Não foi possível encontrar informações meteorológicas para city',
      'danger'
    );
    expect(component.form.value).toEqual(validData);
  });

  it('should show a generic error modal if the API fails with an unexpected error (e.g. 500)', () => {
    const validData = {
      name: 'Test User',
      age: 40,
      monthlyIncome: 3000.0,
      city: 'São Paulo',
      cpf: '999.999.999-99',
    };

    const unexpectedError = {
      status: 500,
      message: 'Internal Server Error',
    };

    mockService.create.and.returnValue(throwError(() => unexpectedError));

    component.form.setValue(validData);
    component.submit();

    expect(mockService.create).toHaveBeenCalledWith(validData);

    expect(modalService.show).toHaveBeenCalledWith(
      'Erro',
      'Ocorreu um erro inesperado ao enviar os dados.',
      'danger'
    );

    expect(component.form.value).toEqual(validData);
  });
});
