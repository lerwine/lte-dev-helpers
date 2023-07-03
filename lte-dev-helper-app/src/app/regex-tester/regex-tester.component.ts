import { Component } from '@angular/core';

import { RegexTesterService, OperationType, ICreateRegExpFailedResult, ICreateRegExpSuccessResult, IRegExpTestResult, IRegExpExecResult, IRegExpReplaceResult, IRegExpSplitResult, isValidResult } from '../regex-tester.service';

@Component({
  selector: 'app-regex-tester',
  templateUrl: './regex-tester.component.html',
  styleUrls: ['./regex-tester.component.css']
})
export class RegexTesterComponent {
  // #region pattern Property
  
  private _pattern: string = "";
  
  /**
   * Gets or sets the regular expression pattern.
   * @type {string}
   * @memberof RegexTesterComponent
   * @public
   */
  public get pattern(): string { return this._pattern; }
  
  /** @type {string} */
  public set pattern(value: string) {
      this._pattern = value;
  }
  
  // #endregion
  
  // #region targetString Property
  
  private _targetString: string = "";
  
  /**
   * Gets or sets the text that will be applied to the regular expression.
   * @type {string}
   * @memberof RegexTesterComponent
   * @public
   */
  public get targetString(): string { return this._targetString; }
  
  /** @type {string} */
  public set targetString(value: string) {
      this._targetString = value;
  }
  
  // #endregion

  // #region replaceValue Property
  
  private _replaceValue: string = "";
  
  /**
   * Gets or sets the replacement value.
   * @type {string}
   * @memberof RegexTesterComponent
   * @public
   */
  public get replaceValue(): string { return this._replaceValue; }
  
  /** @type {string} */
  public set replaceValue(value: string) {
      this._replaceValue = value;
  }
  
  // #endregion
  // #region operationType Property
  
  private _operationType: OperationType = OperationType.test;
  
  /**
   * Gets or sets the regular expression evaluation type.
   * @type {OperationType}
   * @memberof RegexTesterComponent
   * @public
   */
  public get operationType(): OperationType { return this._operationType; }
  
  /** @type {OperationType} */
  public set operationType(value: OperationType) {
      this._operationType = value;
  }
  
  // #endregion

  // #region globalFlag Property
  
  private _globalFlag: boolean = false;
  
  /**
   * Gets or sets a value indicating whether the global flag is set.
   * @type {boolean}
   * @memberof RegexTesterComponent
   * @public
   */
  public get globalFlag(): boolean { return this._globalFlag; }
  
  /** @type {boolean} */
  public set globalFlag(value: boolean) {
      this._globalFlag = value;
  }
  
  // #endregion
  
  // #region ignoreCaseFlag Property
  
  private _ignoreCaseFlag: boolean = false;
  
  /**
   * Gets or sets a value indicating whether the global flag is set.
   * @type {boolean}
   * @memberof RegexTesterComponent
   * @public
   */
  public get ignoreCaseFlag(): boolean { return this._ignoreCaseFlag; }
  
  /** @type {boolean} */
  public set ignoreCaseFlag(value: boolean) {
      this._ignoreCaseFlag = value;
  }
  
  // #endregion
  
  // #region multilineFlag Property
  
  private _multilineFlag: boolean = false;
  
  /**
   * Gets or sets a value indicating whether the global flag is set.
   * @type {boolean}
   * @memberof RegexTesterComponent
   * @public
   */
  public get multilineFlag(): boolean { return this._multilineFlag; }
  
  /** @type {boolean} */
  public set multilineFlag(value: boolean) {
      this._multilineFlag = value;
  }
  
  // #endregion
  
  // #region unicodeFlag Property
  
  private _unicodeFlag: boolean = false;
  
  /**
   * Gets or sets a value indicating whether the global flag is set.
   * @type {boolean}
   * @memberof RegexTesterComponent
   * @public
   */
  public get unicodeFlag(): boolean { return this._unicodeFlag; }
  
  /** @type {boolean} */
  public set unicodeFlag(value: boolean) {
      this._unicodeFlag = value;
  }
  
  // #endregion
  
  // #region stickyFlag Property
  
  private _stickyFlag: boolean = false;
  
  /**
   * Gets or sets a value indicating whether the global flag is set.
   * @type {boolean}
   * @memberof RegexTesterComponent
   * @public
   */
  public get stickyFlag(): boolean { return this._stickyFlag; }
  
  /** @type {boolean} */
  public set stickyFlag(value: boolean) {
      this._stickyFlag = value;
  }
  
  // #endregion

  constructor(private regexTesterService: RegexTesterService) { }

  ngOnInit(): void { this.startEvaluation(); }

  private _concurrencyId: number = 0;
  startEvaluation() {
    if (this._concurrencyId > 1073741822)
      this._concurrencyId = 0;
    else
      this._concurrencyId++;
    switch (this._operationType) {
      case OperationType.exec:
        this.regexTesterService.execRegExp({
          concurrencyId: this._concurrencyId,
          pattern: this._pattern,
          targetString: this._targetString,
          globalFlag: this._globalFlag,
          ignoreCaseFlag: this._ignoreCaseFlag,
          multilineFlag: this._multilineFlag,
          unicodeFlag: this._unicodeFlag,
          stickyFlag: this._stickyFlag
        }).subscribe(result => this.onExecCompleted(result));
        break;
      case OperationType.replace:
        this.regexTesterService.replaceRegExp({
          concurrencyId: this._concurrencyId,
          pattern: this._pattern,
          targetString: this._targetString,
          replaceValue: this._replaceValue,
          globalFlag: this._globalFlag,
          ignoreCaseFlag: this._ignoreCaseFlag,
          multilineFlag: this._multilineFlag,
          unicodeFlag: this._unicodeFlag,
          stickyFlag: this._stickyFlag
        }).subscribe(result => this.onReplaceCompleted(result));
        break;
      case OperationType.split:
        var s = this._replaceValue.trim();
        this.regexTesterService.splitRegExp({
          concurrencyId: this._concurrencyId,
          pattern: this._pattern,
          targetString: this._targetString,
          limit: this._replaceValue,
          globalFlag: this._globalFlag,
          ignoreCaseFlag: this._ignoreCaseFlag,
          multilineFlag: this._multilineFlag,
          unicodeFlag: this._unicodeFlag,
          stickyFlag: this._stickyFlag
        }).subscribe(result => this.onSplitCompleted(result));
        break;
      default:
        this.regexTesterService.testRegExp({
          concurrencyId: this._concurrencyId,
          pattern: this._pattern,
          targetString: this._targetString,
          globalFlag: this._globalFlag,
          ignoreCaseFlag: this._ignoreCaseFlag,
          multilineFlag: this._multilineFlag,
          unicodeFlag: this._unicodeFlag,
          stickyFlag: this._stickyFlag
        }).subscribe(result => this.onTestCompleted(result));
        break;
    }
  }

  isValidResult<T extends ICreateRegExpSuccessResult>(result: T | ICreateRegExpFailedResult): result is T {
    if (result.concurrencyId != this._concurrencyId)
      return false;
    if (isValidResult<T>(result))
      return true;
    // TODO: Report error
    return false;
  }

  onTestCompleted(result: IRegExpTestResult | ICreateRegExpFailedResult): void {
    if (!this.isValidResult<IRegExpTestResult>(result))
      return;
    throw new Error('Method not implemented.');
  }

  onExecCompleted(result: IRegExpExecResult | ICreateRegExpFailedResult): void {
    if (!this.isValidResult<IRegExpExecResult>(result))
      return;
    throw new Error('Method not implemented.');
  }

  onReplaceCompleted(result: IRegExpReplaceResult | ICreateRegExpFailedResult): void {
    if (!this.isValidResult<IRegExpReplaceResult>(result))
      return;
    throw new Error('Method not implemented.');
  }

  onSplitCompleted(result: IRegExpSplitResult | ICreateRegExpFailedResult): void {
    if (!this.isValidResult<IRegExpSplitResult>(result))
      return;
    throw new Error('Method not implemented.');
  }
}
