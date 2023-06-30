import { Injectable } from '@angular/core';
import { IIndexedFont } from './IIndexedFont';
import { IFontWithChars } from './IFontWithChars';
import { Observable, of, EMPTY, map, mergeMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICharInfo } from './ICharInfo';
import { IFont } from './IFont';

@Injectable({
  providedIn: 'root'
})
export class FontService {
  constructor(private http: HttpClient) { }

  getFontFrom(source: IFont): Observable<IFontWithChars> {
    return this.http.get<ICharInfo[]>('assets/char-map' + source.id + '.json').pipe(map(chars => <IFontWithChars>{
      id: source.id,
      name: source.name,
      characters: chars
    }));
  }

  getFont(id: number): Observable<IFontWithChars> {
    return this.http.get<IIndexedFont[]>('assets/font-index.json').pipe(
      mergeMap(fonts =>
      {
        var f = fonts.find(f => f.id == id);
        return (typeof f === 'undefined') ? EMPTY : of(f);
      })
    ).pipe(
      mergeMap(font => this.http.get<ICharInfo[]>('assets/char-map' + id + '.json').pipe(
        map(chars => <IFontWithChars>{
          id: id,
          name: font!.name,
          characters: chars
        })
      ))
    );
  }

  getFonts(): Observable<IIndexedFont[]> {
    return this.http.get<IIndexedFont[]>('assets/font-index.json');
  }
}
