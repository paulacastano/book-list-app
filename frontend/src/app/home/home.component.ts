import { Component } from '@angular/core';
import { BookListComponent } from '../book-list/book-list.component';
import { HeaderComponent } from '../header/header.component';
import { ToastService } from '../services/toast.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookListComponent, HeaderComponent, CommonModule, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  toastMessage: string | null = null;

  constructor(private toastService: ToastService) {
    this.toastService.toast$.subscribe((message) => {
      this.toastMessage = message;
    });
  }
}
