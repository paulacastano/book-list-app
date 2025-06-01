import { Component } from '@angular/core';
import { CreateBookComponent } from '../create-book/create-book.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CreateBookComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  showModal = false;
  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }
}
