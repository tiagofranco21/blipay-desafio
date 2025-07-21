import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ModalMessageComponent } from './components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { ModalService } from './services/modal.service';
import { ModalData } from './models/modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ModalMessageComponent, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  modal: ModalData = {
    visible: false,
    title: '',
    message: '',
    type: 'info',
  };

  constructor(private modalService: ModalService) {
    this.modalService.modal$.subscribe((data) => {
      this.modal = data;
    });
  }

  closeModal() {
    this.modal.visible = false;
  }
}
