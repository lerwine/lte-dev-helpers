import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, map, mergeMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface IFont {
  id: number;
  name: string;
}

export interface IIndexedFont extends IFont {
  characterCount: number;
}

export interface ICharInfo {
  value: number;
  display?: string;
  name: string,
  encoded: string,
  entitySet?: string;
}

export interface IFontWithChars extends IFont {
  characters: ICharInfo[];
}

@Injectable({
  providedIn: 'root'
})
export class FontService {
  constructor(private http: HttpClient) { }

  getFontChars(source: IFont): Observable<IFontWithChars> {
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
