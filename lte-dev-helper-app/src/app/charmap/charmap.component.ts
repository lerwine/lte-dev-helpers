import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FontService, FontDetail, CharInfo, EntitySet } from '../font.service';

const ROW_SIZE = 20;

class OutputRow {
  characters: CharInfo[] = [];
  finalColSpan: number;
  constructor(characters: CharInfo[], start: number, end: number) {
    for (var i = start; i < end; i++)
      this.characters.push(characters[i]);
    this.finalColSpan = ROW_SIZE - this.characters.length;
  }
}

@Component({
  selector: 'app-charmap',
  templateUrl: './charmap.component.html',
  styleUrls: ['./charmap.component.css']
})
export class CharmapComponent {
  private _characters: CharInfo[] = [];
  id: number = NaN;
  page: number = 0;
  pageSize: number = 10;
  fontName?: string;
  rows: OutputRow[] = [];
  showAll = false;
  current?: CharInfo;

  constructor(
    private route: ActivatedRoute,
    private fontService: FontService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getFont();
  }

  private setRows(): void {
    var characters = this.showAll ? this._characters : this._characters.filter(c => c.hasValue);
    var startIndex = 0;
    var end = characters.length - ROW_SIZE;
    this.rows = [];
    this.page = 0;
    while (startIndex < end) {
      var next = startIndex + ROW_SIZE;
      this.rows.push(new OutputRow(characters, startIndex, next));
      startIndex = next;
    }
    this.rows.push(new OutputRow(characters, startIndex, characters.length));
  }

  showAllToggle(event: any): void {
    this.showAll = event.currentTarget.checked == true;
    this.setRows();
  }

  selectCharacter(item?: CharInfo): void {
    this.current = item;
  }

  getFont(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.fontService.getFont(id)
      .subscribe(font =>
        {
          this.id = font.id;
          this.fontName = font.name;
          this._characters = font.characters;
          this.setRows();
        });
  }
}
