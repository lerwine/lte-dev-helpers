import { Component } from '@angular/core';
import { FontService, IFontSummaryData } from '../font.service';

@Component({
  selector: 'app-fonts',
  templateUrl: './fonts.component.html',
  styleUrls: ['./fonts.component.css']
})
export class FontsComponent {
  fonts: IFontSummaryData[] = [];

  constructor(private fontService: FontService) { }

  ngOnInit(): void { this.getFonts(); }

  getFonts() { this.fontService.getFonts().subscribe(fonts => this.fonts = fonts); }
}
