import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, map, mergeMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/**
 * Base interface for font data.
 * @export
 * @interface IFontItem
 */
export interface IFontItem {
  /**
   * The unique identifier of the font.
   * @type {number}
   * @memberof IFontItem
   */
  id: number;

  /**
   * The name of the font.
   * @type {string}
   * @memberof IFontItem
   */
  name: string;

  /**
   * Gets the recommended baseline-to-baseline distance for the text in this font relative to the em size.
   * @type {number}
   * @memberof IFontItem
   */
  lineSpacing: number;

  /**
   * Gets the maximum character cell height relative to the em size.
   * @type {number}
   * @memberof IFontItem
   */
  maxHeight: number;

  /**
   * Gets the maximum character cell width relative to the em size.
   * @type {number}
   * @memberof IFontItem
   */
  maxWidth: number;
}

/**
 * Font summary data.
 * @export
 * @interface IFontSummaryData
 * @extends {IFontItem}
 */
export interface IFontSummaryData extends IFontItem {
  /**
   * The number of characters supported by the font.
   * @type {number}
   * @memberof IFontSummaryData
   */
  characterCount: number;
}

/**
 * Represents unicode character catagories.
 * @export
 * @enum {number}
 */
export enum UnicodeCategory {
  /**
   * Uppercase letter.
   * Signified by the Unicode designation "Lu" (letter, uppercase).
   */
  uppercaseLetter,

  /**
   * Lowercase letter.
   * Signified by the Unicode designation "Ll" (letter, lowercase).
   */
  lowercaseLetter,

  /**
   * Titlecase letter.
   * Signified by the Unicode designation "Lt" (letter, titlecase).
   */
  titlecaseLetter,

  /**
   * Modifier letter character, which is free-standing spacing character that indicates modifications of a preceding letter.
   * Signified by the Unicode designation "Lm" (letter, modifier).
   */
  modifierLetter,

  /**
   * Letter that is not an uppercase letter, a lowercase letter, a titlecase letter, or a modifier letter.
   * Signified by the Unicode designation "Lo" (letter, other).
   */
  otherLetter,

  /**
   * Nonspacing character that indicates modifications of a base character.
   * Signified by the Unicode designation "Mn" (mark, nonspacing).
   */
  nonSpacingMark,

  /**
   * Nonspacing character that indicates modifications of a base character.
   * Signified by the Unicode designation "Mn" (mark, nonspacing).
   */
  spacingCombiningMark,

  /**
   * Enclosing mark character, which is a nonspacing combining character that surrounds all previous characters up to and including a base character.
   * Signified by the Unicode designation "Me" (mark, enclosing).
   */
  enclosingMark,

  /**
   * Decimal digit character, that is, a character representing an integer in the range 0 through 9.
   * Signified by the Unicode designation "Nd" (number, decimal digit).
   */
  decimalDigitNumber,

  /**
   * Number represented by a letter, instead of a decimal digit, for example, the Roman numeral for five, which is "V".
   * The indicator is signified by the Unicode designation "Nl" (number, letter).
   */
  letterNumber,

  /**
   * Number that is neither a decimal digit nor a letter number, for example, the fraction 1/2.
   * The indicator is signified by the Unicode designation "No" (number, other).
   */
  otherNumber,

  /**
   * Space character, which has no glyph but is not a control or format character.
   * Signified by the Unicode designation "Zs" (separator, space).
   */
  spaceSeparator,

  /**
   * Character that is used to separate lines of text.
   * Signified by the Unicode designation "Zl" (separator, line).
   */
  lineSeparator,

  /**
   * Character used to separate paragraphs.
   * Signified by the Unicode designation "Zp" (separator, paragraph).
   */
  paragraphSeparator,

  /**
   * Control code character, with a Unicode value of U+007F or in the range U+0000 through U+001F or U+0080 through U+009F.
   * Signified by the Unicode designation "Cc" (other, control).
   */
  control,

  /**
   * Format character that affects the layout of text or the operation of text processes, but is not normally rendered.
   * Signified by the Unicode designation "Cf" (other, format).
   */
  format,

  /**
   * High surrogate or a low surrogate character. Surrogate code values are in the range U+D800 through U+DFFF.
   * Signified by the Unicode designation "Cs" (other, surrogate).
   */
  surrogate,

  /**
   * Private-use character, with a Unicode value in the range U+E000 through U+F8FF.
   * Signified by the Unicode designation "Co" (other, private use).
   */
  privateUse,

  /**
   * Connector punctuation character that connects two characters.
   * Signified by the Unicode designation "Pc" (punctuation, connector).
   */
  connectorPunctuation,

  /**
   * Dash or hyphen character.
   * Signified by the Unicode designation "Pd" (punctuation, dash).
   */
  dashPunctuation,

  /**
   * Opening character of one of the paired punctuation marks, such as parentheses, square brackets, and braces.
   * Signified by the Unicode designation "Ps" (punctuation, open).
   */
  openPunctuation,

  /**
   * Closing character of one of the paired punctuation marks, such as parentheses, square brackets, and braces.
   * Signified by the Unicode designation "Pe" (punctuation, close).
   */
  closePunctuation,

  /**
   * Opening or initial quotation mark character.
   * Signified by the Unicode designation "Pi" (punctuation, initial quote).
   */
  initialQuotePunctuation,

  /**
   * Closing or final quotation mark character.
   * Signified by the Unicode designation "Pf" (punctuation, final quote).
   */
  finalQuotePunctuation,

  /**
   * Punctuation character that is not a connector, a dash, open punctuation, close punctuation, an initial quote, or a final quote.
   * Signified by the Unicode designation "Po" (punctuation, other).
   */
  otherPunctuation,

  /**
   * Mathematical symbol character, such as "+" or "= ".
   * Signified by the Unicode designation "Sm" (symbol, math).
   */
  mathSymbol,

  /**
   * Currency symbol character.
   * Signified by the Unicode designation "Sc" (symbol, currency).
   */
  currencySymbol,

  /**
   * Modifier symbol character, which indicates modifications of surrounding characters.
   * For example, the fraction slash indicates that the number to the left is the numerator and the number to the right is the denominator.
   * The indicator is signified by the Unicode designation "Sk" (symbol, modifier).
   */
  modifierSymbol,

  /**
   * Symbol character that is not a mathematical symbol, a currency symbol or a modifier symbol.
   * Signified by the Unicode designation "So" (symbol, other).
   */
  otherSymbol,

  /**
   * Character that is not assigned to any Unicode category.
   * Signified by the Unicode designation "Cn" (other, not assigned).
   */
  otherNotAssigned
}

/**
 * Represents an HTML character entity set.
 * @export
 * @enum {number}
 */
export enum EntitySet {
  /**
   * No HTML character entity set.
   */
  none,

  /**
   * The HTML character entity set for Latin 1 characters.
   */
  lat1,

  /**
   * The HTML character entity set for Mathematical, Greek and Symbolic characters.
   */
  symbol,

  /**
   * The HTML character entity set for Special characters.
   */
  special
}

/**
 * Font character information.
 * @export
 * @interface ICharInfo
 */
export interface ICharInfo {
  /**
   * The numerical value of the character.
   * @type {number}
   * @memberof ICharInfo
   */
  numericValue: number;

  /**
   * The display value for the character or undefined if the character is white space or cannot be displayed.
   * @type {(string | undefined)}
   * @memberof ICharInfo
   */
  value?: string;

  /**
   * The entity name of the character.
   * @type {(string | undefined)}
   * @memberof ICharInfo
   */
  name?: string;

  /**
   * Indicates whether the current character is a white-space character.
   * @type {boolean}
   * @memberof ICharInfo
   */
  isWhiteSpace: boolean;

  /**
   * The identifier for the unicode category of the character.
   * This corresponds to values of the {@link UnicodeCategory} enumeration.
   * @type {number}
   * @memberof ICharInfo
   */
  category: number | UnicodeCategory;

  /**
   * The identifier for the HTML entity set for the character.
   * This corresponds to values of the {@link EntitySet} enumeration.
   * @type {number}
   * @memberof ICharInfo
   */
  entitySet: number | EntitySet;
}

/**
 * Font character data.
 * @export
 * @interface ICharInfoData
 * @extends {ICharInfo}
 */
export interface ICharInfoData extends ICharInfo {
  /**
   * The identifier for the unicode category of the character.
   * This corresponds to values of the {@link UnicodeCategory} enumeration.
   * @type {number}
   * @memberof ICharInfoData
   */
  category: number;

  /**
   * The identifier for the HTML entity set for the character.
   * This corresponds to values of the {@link EntitySet} enumeration.
   * @type {number}
   * @memberof ICharInfoData
   */
  entitySet: number;
}

const CSS_CLASS_entity = "entity";

const CSS_CLASS_nonEntity = "non-entity";

/**
 * 
 * Represents font character information
 * @export
 * @class CharInfo
 * @implements {ICharInfo}
 */
export class CharInfo implements ICharInfo {
  /**
   * The numerical value of the character.
   * @type {number}
   * @memberof CharInfo
   */
  numericValue: number;

  /**
   * The hexidecimal value of the character.
   * @type {string}
   * @memberof CharInfo
   * @public
   */
  public get valueHex(): string {
    return (this.numericValue < 0x10) ? "000" + this.numericValue.toString(16) : (this.numericValue < 0x100) ? "00" + this.numericValue.toString(16) : (this.numericValue < 0x1000) ? "0" + this.numericValue.toString(16) : this.numericValue.toString(16);
  }
  
  /**
   * Indicates whether the character has a display value.
   * @type {boolean}
   * @memberof CharInfo
   * @public
   */
  hasValue: boolean;
  
  /**
   * The display value for the character, which may be empty if the character is white space or cannot be displayed.
   * @type {string}
   * @memberof CharInfo
   */
  value: string;

  /**
   * The entity name of the character.
   * @type {string}
   * @memberof CharInfo
   */
  name: string;

  /**
   * Indicates whether the current character is a white-space character.
   * @type {boolean}
   * @memberof CharInfo
   */
  isWhiteSpace: boolean;

  /**
   * The identifier for the unicode category of the character.
   * This corresponds to values of the {@link UnicodeCategory} enumeration.
   * @type {number}
   * @memberof CharInfo
   */
  category: UnicodeCategory;

  /**
   * Gets the unicode category name.
   * @type {string}
   * @memberof CharInfo
   * @public
   */
  public get categoryName(): string {
    var result: string = UnicodeCategory[this.category];
    return result.substring(0, 1).toUpperCase() + result.substring(1);
  }
  
  /**
   * Indicates whether the character is part of an HTML entity set.
   * @type {boolean}
   * @memberof CharInfo
   * @public
   */
  public get hasEntitySet(): boolean { return this.entitySet != EntitySet.none; }
  
  public get hasEncodedValue(): boolean { return this.entitySet != EntitySet.none || this.numericValue > 127 || (!this.hasValue && this.numericValue != 32); }
  
  public get encodedValue(): string { return ((this.entitySet != EntitySet.none) ? '&' + this.name : '&#' + this.numericValue) + ';'; }
  
  /**
   * The identifier for the HTML entity set for the character.
   * This corresponds to values of the {@link EntitySet} enumeration.
   * @type {number}
   * @memberof CharInfo
   */
  entitySet: EntitySet;

  /**
   * Gets the HTML entity set name.
   * @type {string}
   * @memberof CharInfo
   * @public
   */
  public get entitySetName(): string {
    switch (this.entitySet) {
      case EntitySet.lat1:
        return "Latin 1";
      case EntitySet.symbol:
        return "Symbol";
      case EntitySet.special:
        return "Special";
    }
    return "";
  }

  /**
   * Creates an instance of CharInfo.
   * @param {ICharInfoData} data - The source character information data.
   * @memberof CharInfo
   */
  constructor(data: ICharInfoData) {
    this.numericValue = data.numericValue;
    this.value = (typeof data.value === 'string') ? data.value : "";
    this.name = (typeof data.name === 'string') ? data.name : "";
    this.isWhiteSpace = data.isWhiteSpace;
    try { this.category = data.category; } catch { this.category = UnicodeCategory.otherNotAssigned; }
    try { this.entitySet = data.entitySet; } catch { this.entitySet = EntitySet.none; }
    if (data.isWhiteSpace || typeof data.value !== 'string' || data.value.length == 0)
      this.hasValue = false;
    else
      switch (this.category) {
        case UnicodeCategory.control:
        case UnicodeCategory.spaceSeparator:
        case UnicodeCategory.modifierSymbol:
          this.hasValue = false;
          break;
        default:
          this.hasValue = true;
          break;
      }
  }
}

/**
 * Represents font details.
 * @export
 * @class FontDetail
 * @implements {IFontItem}
 */
export class FontDetail implements IFontItem {
  /**
   * The unique identifier of the font.
   * @type {number}
   * @memberof FontDetail
   */
  id: number;

  /**
   * The name of the font.
   * @type {string}
   * @memberof FontDetail
   */
  name: string;

  /**
   * The characters supported by the font.
   * @type {ICharInfoData[]}
   * @memberof FontDetail
   */
  characters: CharInfo[];

  /**
   * Gets the recommended baseline-to-baseline distance for the text in this font relative to the em size.
   * @type {number}
   * @memberof IFontItem
   */
  lineSpacing: number;

  /**
   * Gets the maximum character cell height relative to the em size.
   * @type {number}
   * @memberof IFontItem
   */
  maxHeight: number;

  /**
   * Gets the maximum character cell width relative to the em size.
   * @type {number}
   * @memberof IFontItem
   */
  maxWidth: number;

  /**
   * Creates an instance of FontDetail.
   * @param {number} id -The unique identifier of the font.
   * @param {string} name - The name of the font.
   * @param {ICharInfoData[]} data - The source character detail data.
   * @memberof FontDetail
   */
  constructor(id: number, name: string | undefined, lineSpacing: number, maxHeight: number, maxWidth: number, data: ICharInfoData[]) {
    this.id = id;
    this.name = (typeof name === 'string') ? name : "";
    this.lineSpacing = lineSpacing;
    this.maxHeight = maxHeight;
    this.maxWidth = maxWidth;
    this.characters = data.map(c => new CharInfo(c));
  }
}

/**
 * Loads font and character information.
 * @export
 * @class FontService
 */
@Injectable({
  providedIn: 'root'
})
export class FontService {
  constructor(private http: HttpClient) { }

  /**
   * Gets the font characters for a given font.
   * @param {IFontItem} source - The source font item.
   * @return {Observable<FontDetail>} - The observable font detail load results.
   * @memberof FontService
   */
  getFontChars(source: IFontItem): Observable<FontDetail> {
    return this.http.get<ICharInfoData[]>('assets/char-map' + source.id + '.json').pipe(map(chars => new FontDetail(source.id, source.name, source.lineSpacing, source.maxHeight, source.maxWidth, chars)));
  }

  /**
   * Gets the font details by the unique identifier.
   * @param {number} id - The unique identifier of the font.
   * @return {Observable<FontDetail>} - The observable font detail load results.
   * @memberof FontService
   */
  getFont(id: number): Observable<FontDetail> {
    return this.http.get<IFontSummaryData[]>('assets/font-index.json').pipe(
      mergeMap(fonts =>
      {
        var f = fonts.find(f => f.id == id);
        return (typeof f === 'undefined') ? EMPTY : of(f);
      })
    ).pipe(
      mergeMap(font => this.http.get<ICharInfoData[]>('assets/char-map' + id + '.json').pipe(
        map(chars => new FontDetail(id, font!.name, font.lineSpacing, font.maxHeight, font.maxWidth, chars))
      ))
    );
  }

  /**
   * Loads the summary information of the fonts supported by this service.
   * @return {Observable<IFontSummaryData[]>} The observible font summary list load results.
   * @memberof FontService
   */
  getFonts(): Observable<IFontSummaryData[]> {
    return this.http.get<IFontSummaryData[]>('assets/font-index.json');
  }
}
