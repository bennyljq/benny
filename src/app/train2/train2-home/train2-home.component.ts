import { Component } from '@angular/core';
import { ThemeService } from 'src/app/physics/theme.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-train2-home',
  templateUrl: './train2-home.component.html',
  styleUrls: ['./train2-home.component.scss']
})
export class Train2HomeComponent {

  constructor (
    public themeService: ThemeService,
    private _location: Location
  ) {}
  
  goBack() {
    this._location.back();
  }
  
}
