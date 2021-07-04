import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in-sign-up',
  templateUrl: './sign-in-sign-up.component.html',
  styleUrls: ['./sign-in-sign-up.component.css'],
})
export class SignInSignUpComponent implements OnInit {
  isLogin = true;
  isLoading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  async login(f: NgForm) {
    if (f.value.password.length < 7) {
      return (this.error = 'Passwords is too short !!!');
    }
    this.isLoading = true;
    try {
      await this.authService.login(f.value.email, f.value.password);
      this.error = '';
      this.isLoading = false;
      this.router.navigate(['/']);
    } catch (e) {
      this.isLoading = false;
      this.error = e;
    }
    return;
  }

  async signUp(f: NgForm) {
    if (f.value.password !== f.value.confirmPassword) {
      return (this.error = 'Passwords does not match !!!');
    }
    if (f.value.password.length < 7) {
      return (this.error = 'Passwords is too short !!!');
    }
    this.isLoading = true;
    try {
      await this.authService.signup(
        f.value.name,
        f.value.email,
        f.value.password
      );
      this.error = '';
      this.isLoading = false;
      this.router.navigate(['/']);
    } catch (e) {
      this.isLoading = false;
      this.error = e;
    }
    return;
  }
}
