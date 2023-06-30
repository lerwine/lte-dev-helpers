import { ICharInfo } from "./ICharInfo";
import { IFont } from "./IFont";
import { Observable } from 'rxjs';

export interface IFontWithChars extends IFont {
  characters: ICharInfo[];
}
