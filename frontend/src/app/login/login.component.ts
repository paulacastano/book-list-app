import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = 'Credenciales incorrectas';
        console.error(err);
      },
    });
  }
}
