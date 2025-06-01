import { Component } from '@angular/core';
import { CreateBookComponent } from '../create-book/create-book.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CreateBookComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  showModal = false;

  constructor(private authService: AuthService) {}

  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }
  logout() {
    this.authService.logout();
    window.location.reload(); // Recarga la página para reflejar el cambio de estado
  }
}
