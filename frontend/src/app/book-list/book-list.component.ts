import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BooksService, Book, EditBook } from '../services/books.service';
import { TruncatePipe } from '../truncate.pipe';
import { ToastService } from '../services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  imports: [CommonModule, TruncatePipe, FormsModule],
  styleUrls: ['./book-list.component.css'],
  standalone: true,
})
export class BookListComponent {
  books: Book[] = [];
  activeMenu: number | null = null;
  currentYear = new Date().getFullYear();
  showEditModal = false;
  bookToEdit: EditBook = {
    id: 0,
    title: '',
    description: '',
    author: '',
    year: this.currentYear,
  };

  constructor(
    private booksService: BooksService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.booksService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (err) => console.error('Error cargando libros:', err),
    });
  }

  toggleMenu(index: number) {
    this.activeMenu = this.activeMenu === index ? null : index;
  }

  deleteBook(index: number) {
    const bookId = this.books[index].id;
    this.books.splice(index, 1); // Eliminar de la lista local antes de hacer la petición
    this.booksService.deleteBook(bookId).subscribe({
      next: () => {
        this.toastService.show('Libro eliminado correctamente');
      },
      error: (err) => console.error('Error eliminando libro:', err),
    });
    this.activeMenu = null;
  }

  openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  submitEditForm() {
    this.booksService
      .editBook(this.bookToEdit.id, this.bookToEdit)
      .subscribe((book) => {
        const index = this.books.findIndex((b) => b.id === book.id);
        if (index !== -1) {
          this.books[index] = book; // Actualizar el libro editado en la lista
          this.toastService.show('Libro editado correctamente');
        }
        this.closeEditModal();
      }); // Asegúrate de que bookToEdit tenga un id
  }

  editBook(index: number) {
    this.bookToEdit = this.books[index];
    this.openEditModal();
    this.toggleMenu(index);
  }
}
