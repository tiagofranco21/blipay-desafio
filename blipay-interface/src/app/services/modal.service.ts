import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalData, ModalType } from '../models/modal';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalData = new Subject<ModalData>();
  modal$ = this.modalData.asObservable();

  show(title: string, message: string, type: ModalType = 'info') {
    this.modalData.next({
      visible: true,
      title,
      message,
      type,
    });
  }
}
