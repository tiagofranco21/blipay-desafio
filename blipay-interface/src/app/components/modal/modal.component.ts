import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
})
export class ModalMessageComponent {
  @Input() title = 'Aviso';
  @Input() type: 'success' | 'danger' | 'info' | 'warning' = 'info';
  @Input() message = '';

  @Output() close = new EventEmitter<void>();
}
