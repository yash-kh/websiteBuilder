import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  siteForm: any;
  selectedImage: any = null;
  error = '';
  website = '';

  constructor(public fb: FormBuilder, private auth: AuthService) {
    this.siteForm = this.fb.group({
      name: [''],
      age: [''],
      gender: [''],
      about: [''],
      avatar: [null],
    });
  }

  ngOnInit(): void {
    this.siteForm.get('name').setValue(this.auth.user.name);
  }

  logOut() {
    this.auth.logOut();
  }

  onImageSelect(event: any) {
    this.selectedImage = event.target.files[0];
    const file = event.target.files[0];
    this.siteForm.patchValue({
      avatar: file,
    });
    this.siteForm.get('avatar').updateValueAndValidity();
  }

  async generateSite() {
    this.error = '';
    this.website = '';

    if (this.selectedImage === null) {
      this.error = 'Please select the image';
      return;
    }

    var formData: any = new FormData();
    formData.append('name', this.siteForm.get('name').value);
    formData.append('age', this.siteForm.get('age').value);
    formData.append('gender', this.siteForm.get('gender').value);
    formData.append('about', this.siteForm.get('about').value);
    formData.append('avatar', this.siteForm.get('avatar').value);
    try {
      let websiteName: any = await this.auth.createWebsite(formData);
      this.website = websiteName['websiteName'];
    } catch (e) {
      this.error = 'Invalid Inputs';
      console.log(e);
    }
  }
}
