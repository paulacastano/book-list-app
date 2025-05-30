import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BooksService, Book } from '../services/books.service';
import { TruncatePipe } from '../truncate.pipe';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  imports: [CommonModule, TruncatePipe],
  styleUrls: ['./book-list.component.css'],
  standalone: true,
})
export class BookListComponent {
  books: Book[] = [];

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.booksService.getBooks().subscribe({
      next: (data) => {
        console.log('Libros cargados:', data);
        this.books = data;
      },
      error: (err) => console.error('Error cargando libros:', err),
    });
  }
}
