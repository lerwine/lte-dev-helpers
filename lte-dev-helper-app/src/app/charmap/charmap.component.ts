import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FontService, IFontDetailData } from '../font.service';

@Component({
  selector: 'app-charmap',
  templateUrl: './charmap.component.html',
  styleUrls: ['./charmap.component.css']
})
export class CharmapComponent {
  font?: IFontDetailData;

  constructor(
    private route: ActivatedRoute,
    private fontService: FontService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getFont();
  }

  getFont(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.fontService.getFont(id)
      .subscribe(font => this.font = font);
  }
}
