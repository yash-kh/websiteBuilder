import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;

  apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  createWebsite(fd: FormData) {
    const promise = new Promise((resolve, reject) => {
      this.http
        .post(this.apiURL + '/createWebsite', fd, {
          headers: { Authorization: 'Bearer ' + this.user.token },
        })
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  }

  logOut() {
    this.http
      .post(this.apiURL + '/users/logoutALL', null, {
        headers: { Authorization: 'Bearer ' + this.user.token },
      })
      .subscribe((res) => {
        this.user = {};
        this.router.navigateByUrl('/sign-in');
      });
  }

  login(email: string, password: string) {
    let promise = new Promise((resolve, reject) => {
      this.http
        .post(this.apiURL + '/users/login', { email, password })
        .toPromise()
        .then(
          (res: any) => {
            this.user = { ...res['user'], token: res['token'] };
            resolve(res);
          },
          (err) => {
            console.log(err);
            if (err.status === 0) {
              reject('Server are offline');
              return;
            }
            if (err.error) {
              reject(err.error);
              return;
            }
            reject(err);
          }
        );
    });

    return promise;
  }

  signup(name: string, email: string, password: string) {
    let promise = new Promise((resolve, reject) => {
      this.http
        .post(this.apiURL + '/users', { name, email, password })
        .toPromise()
        .then(
          (res: any) => {
            this.user = { ...res['user'], token: res['token'] };
            resolve(res);
          },
          (err) => {
            if (err.error.code === 11000) {
              reject('Email already exist');
              return;
            }
            console.log(err);
            if (err.error.name) {
              reject(err.error.name);
              return;
            }
            if (err.error) {
              reject(err.error);
              return;
            }
            reject(err);
          }
        );
    });

    return promise;
  }
}
