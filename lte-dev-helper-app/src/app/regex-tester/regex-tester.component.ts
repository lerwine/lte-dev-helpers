import { Component } from '@angular/core';

import { RegexTesterService, OperationType, isOperationFailure, IOperationFailure } from '../regex-tester.service';

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
  // #region limit Property
  
  private _limit: string = "";
  
  /**
   * Gets or sets the split limit value.
   * @type {string}
   * @memberof RegexTesterComponent
   * @public
   */
  public get limit(): string { return this._limit; }
  
  /** @type {string} */
  public set limit(value: string) {
      this._limit = value;
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
    var concurrencyId: number = this._concurrencyId;
    var parseResult: Promise<RegExp> = this.regexTesterService.parseRegExp({
      pattern: this._pattern,
      globalFlag: this._globalFlag,
      ignoreCaseFlag: this._ignoreCaseFlag,
      multilineFlag: this._multilineFlag,
      unicodeFlag: this._unicodeFlag,
      stickyFlag: this._stickyFlag
    });
    switch (this._operationType) {
      case OperationType.exec:
        parseResult.then(exp =>
        {
          if (concurrencyId != this._concurrencyId)
            return Promise.resolve(null);
          return this.regexTesterService.execRegExp(this._targetString, exp); 
        }).then(result => this.onExecCompleted((concurrencyId != this._concurrencyId) ? null : result)).catch(reason =>
            isOperationFailure(reason) ? ((reason.isRegexParse) ? this.onParseFailure(reason.error) : this.onExecFailed(reason.error)) : this.onExecFailed(reason));
        break;
      case OperationType.replace:
        parseResult.then(exp =>
        {
          if (concurrencyId != this._concurrencyId)
            return Promise.resolve(null);
          return this.regexTesterService.replaceRegExp(this._targetString, exp, this._replaceValue); 
        }).then(result => this.onReplaceCompleted((concurrencyId != this._concurrencyId) ? null : result));
        break;
      case OperationType.split:
        parseResult.then(exp =>
        {
          if (concurrencyId != this._concurrencyId)
            return Promise.resolve(null);
          return this.regexTesterService.splitRegExp(this._targetString, exp, this._limit); 
        }).then(result => this.onSplitCompleted((concurrencyId != this._concurrencyId) ? null : result));
        break;
      default:
        parseResult.then(exp =>
        {
          if (concurrencyId != this._concurrencyId)
            return Promise.resolve(null);
          return this.regexTesterService.testRegExp(this._targetString, exp); 
        }).then(result => this.onTestCompleted((concurrencyId != this._concurrencyId) ? null : result));
        break;
    }
  }

  onParseFailure(reason: any): any {
    throw new Error('Method not implemented.');
  }

  onTestCompleted(result: boolean | null): void {
    if (result === null)
      return;
    throw new Error('Method not implemented.');
  }

  onTestFailed(reason: any) {
    throw new Error('Method not implemented.');
  }
  
  onExecCompleted(result: RegExpExecArray | null): void {
    if (result === null)
      return;
    throw new Error('Method not implemented.');
  }

  onExecFailed(reason: any) {
    throw new Error('Method not implemented.');
  }

  onReplaceCompleted(result: string | null): void {
    if (result === null)
      return;
    throw new Error('Method not implemented.');
  }

  onReplaceFailed(reason: any) {
    throw new Error('Method not implemented.');
  }

  onSplitCompleted(result: string[] | null): void {
    if (result === null)
      return;
    throw new Error('Method not implemented.');
  }

  onSplitFailed(reason: any) {
    throw new Error('Method not implemented.');
  }
}
