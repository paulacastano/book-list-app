import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BooksService, CreateBook } from '../services/books.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-create-book-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-book.component.html',
})
export class CreateBookComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  currentYear = new Date().getFullYear();

  newBook: CreateBook = {
    title: '',
    description: '',
    image_url: '',
    author: '',
    year: undefined,
  };

  constructor(
    private booksService: BooksService,
    private toastService: ToastService
  ) {}

  submitForm() {
    this.booksService.createBook(this.newBook).subscribe({
      next: (book) => {
        this.close.emit();
        this.toastService.show('Libro creado correctamente');
      },
      error: (err) => console.error('Error creando libro:', err),
    });
    this.resetForm();
  }

  cancel() {
    this.close.emit();
    this.resetForm();
  }

  private resetForm() {
    this.newBook = {
      title: '',
      description: '',
      image_url: '',
      author: '',
      year: this.currentYear,
    };
  }
}
