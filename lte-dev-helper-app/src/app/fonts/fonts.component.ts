import { Component } from '@angular/core';
import { FontService, IIndexedFont } from '../font.service';

@Component({
  selector: 'app-fonts',
  templateUrl: './fonts.component.html',
  styleUrls: ['./fonts.component.css']
})
export class FontsComponent {
  fonts: IIndexedFont[] = [];

  constructor(private fontService: FontService) { }

  ngOnInit(): void { this.getFonts(); }

  getFonts() { this.fontService.getFonts().subscribe(fonts => this.fonts = fonts); }
}