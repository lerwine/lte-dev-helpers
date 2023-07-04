import { Component } from '@angular/core';

import { RegexTesterService, OperationType } from '../regex-tester.service';

interface INumberedGroup {
  index: number;
  value: string;
}

interface INamedGroup {
  name: string;
  value: string;
}

interface IOperationOption {
  name: string;
  value: OperationType;
}

@Component({
  selector: 'app-regex-tester',
  templateUrl: './regex-tester.component.html',
  styleUrls: ['./regex-tester.component.css']
})
export class RegexTesterComponent {
  private _expression?: RegExp;

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
    if (this._pattern == value)
      return;
    this._pattern = value;
    this.startParse();
  }
  
  // #endregion
  
  parseErrorMessage: string = "";

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
    if (this._targetString == value)
      return;
    this._targetString = value;
    this.testResult = "";
    this.replaceResult = undefined;
    this.matchIndex = -1;
    this.numberedGroups = [];
    this.namedGroups = [];
    this.matchEvaluated = false;
    this.splitResult = [];
    this.startEvaluation();
  }
  
  // #endregion

  testResult: string = "";

  matchEvaluated: boolean = false;

  matchIndex: number = -1;
  
  numberedGroups: INumberedGroup[] = [];
  
  namedGroups: INamedGroup[] = [];

  operationErrorMessage: string = "";

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
    if (this._replaceValue == value)
      return;
    this.replaceResult = undefined;
    this._replaceValue = value;
    this.startEvaluation();
  }
  
  // #endregion

  replaceResult?: string;

  private _limitValue?: number;

  // #region limit Property
  
  private _limitText: string = "";
  
  /**
   * Gets or sets the split limit value.
   * @type {string}
   * @memberof RegexTesterComponent
   * @public
   */
  public get limit(): string { return this._limitText; }
  
  /** @type {string} */
  public set limit(value: string) {
    if (this._limitText == value)
      return;
    this._limitText = value;
    if ((value = value.trim()).length == 0)
    {
      if (typeof this._limitValue === 'undefined')
        return;
      this._limitValue = undefined;
    }
    else
    {
      var l: number = parseInt(value);
      if (isNaN(l)) {
        if (typeof this._limitValue !== 'number' || !isNaN(this._limitValue))
          this.limitErrorMessage = "Invalid number";
        return;
      }
      if (this._limitValue === l)
        return;
      this._limitValue = l;
    }
    this.limitErrorMessage = "";
    this.splitResult = [];
    this.startEvaluation();
  }
  
  // #endregion

  splitResult: string[] = [];

  limitErrorMessage: string = "";

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
    if (this._operationType == value)
      return;
    this._operationType = value;
    this.startEvaluation();
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
    if (this._globalFlag == value)
      return;
    this._globalFlag = value;
    this.startParse();
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
    if (this._ignoreCaseFlag == value)
      return;
    this._ignoreCaseFlag = value;
    this.startParse();
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
    if (this._multilineFlag == value)
      return;
    this._multilineFlag = value;
    this.startParse();
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
    if (this._unicodeFlag == value)
      return;
    this._unicodeFlag = value;
    this.startParse();
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
    if (this._stickyFlag == value)
      return;
    this._stickyFlag = value;
    this.startParse();
  }
  
  // #endregion

  constructor(private regexTesterService: RegexTesterService) { }

  ngOnInit(): void { this.startParse(); }

  private _concurrencyId: number = -1;

  startParse(): void {
    if (this._concurrencyId > 1073741822)
      this._concurrencyId = 0;
    else
      this._concurrencyId++;
    this.parseErrorMessage = this.operationErrorMessage = this.testResult = "";
    this.replaceResult = undefined;
    this.matchIndex = -1;
    this.numberedGroups = [];
    this.namedGroups = [];
    this.matchEvaluated = false;
    this.splitResult = [];
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
          this._expression = exp;
          return this.regexTesterService.execRegExp(this._targetString, exp); 
        }).then(result => this.onExecCompleted((concurrencyId != this._concurrencyId) ? true : (result === null) ? false : result)).catch(this.onOperationFailed);
        break;
      case OperationType.replace:
        parseResult.then(exp =>
        {
          if (concurrencyId != this._concurrencyId)
            return Promise.resolve(null);
          this._expression = exp;
          return this.regexTesterService.replaceRegExp(this._targetString, exp, this._replaceValue); 
        }).then(result => this.onReplaceCompleted((concurrencyId != this._concurrencyId) ? null : result)).catch(this.onOperationFailed);
        break;
      case OperationType.split:
        parseResult.then(exp =>
        {
          if (concurrencyId != this._concurrencyId)
            return Promise.resolve(null);
          this._expression = exp;
          if (typeof this._limitValue === 'number' &&  isNaN(this._limitValue))
            return Promise.resolve(null);
          return this.regexTesterService.splitRegExp(this._targetString, exp, this._limitValue); 
        }).then(result => this.onSplitCompleted((concurrencyId != this._concurrencyId) ? null : result)).catch(this.onOperationFailed);
        break;
      default:
        parseResult.then(exp =>
        {
          if (concurrencyId != this._concurrencyId)
            return Promise.resolve(null);
          this._expression = exp;
          return this.regexTesterService.testRegExp(this._targetString, exp); 
        }).then(result => this.onTestCompleted((concurrencyId != this._concurrencyId) ? null : result)).catch(this.onOperationFailed);
        break;
    }
  }

  startEvaluation(): void {
    if (typeof this._expression === 'undefined' || typeof this._expression === 'undefined' || typeof this._expression === 'undefined')
      return; 
    if (this._concurrencyId > 1073741822)
      this._concurrencyId = 0;
    else
      this._concurrencyId++;
    var concurrencyId: number = this._concurrencyId;
    this.operationErrorMessage = "";
    switch (this._operationType) {
      case OperationType.exec:
        if (!this.matchEvaluated)
          this.regexTesterService.execRegExp(this._targetString, this._expression).then(result => this.onExecCompleted((concurrencyId != this._concurrencyId) ? true : (result === null) ? false : result)).catch(this.onOperationFailed);
        break;
      case OperationType.replace:
        if (typeof this.replaceResult !== 'undefined')
          this.regexTesterService.replaceRegExp(this._targetString, this._expression, this._replaceValue).then(result => this.onReplaceCompleted((concurrencyId != this._concurrencyId) ? null : result)).catch(this.onOperationFailed);
        break;
      case OperationType.split:
        if (this.splitResult.length == 0 && (typeof this._limitValue === 'undefined' || !isNaN(this._limitValue)))
          this.regexTesterService.splitRegExp(this._targetString, this._expression, this._limitValue).then(result => this.onSplitCompleted((concurrencyId != this._concurrencyId) ? null : result)).catch(this.onOperationFailed);
        break;
      default:
        if (this.testResult.length == 0)
          this.regexTesterService.testRegExp(this._targetString, this._expression).then(result => this.onTestCompleted((concurrencyId != this._concurrencyId) ? null : result)).catch(this.onOperationFailed);
        break;
    }
  }

  onOperationFailed(reason: any) {
    if (typeof reason === 'string')
    {
      if ((this.operationErrorMessage = reason.trim()).length > 0)
        return;
    } else if (typeof reason !== 'undefined' && reason !== null && (this.operationErrorMessage = reason.toString().trim()).length > 0)
      return;
    this.operationErrorMessage = "Unexpected error";
  }
  
  onTestCompleted(result: boolean | null): void {
    if (result !== null)
      this.testResult = result.toString();
  }

  onExecCompleted(result: RegExpExecArray | boolean): void {
    if (typeof result === 'boolean')
    {
      if (result)
        return;
      this.matchIndex = -1;
      this.numberedGroups = [];
      this.namedGroups = [];
      this.matchEvaluated = true;
      return;
    }
    this.matchEvaluated = true;
    this.matchIndex = result.index;
    this.numberedGroups = result.map((v, i) => <INumberedGroup>{ index: i, value: v });
    this.namedGroups = [];
    if (typeof result.groups !== 'undefined' && result.groups !== null)
      for (var n in result.groups)
        this.namedGroups.push({ name: n, value: result.groups[n] });
  }

  onReplaceCompleted(result: string | null): void {
    if (result !== null)
      this.replaceResult = result;
  }

  onSplitCompleted(result: string[] | null): void {
    if (result !== null)
      this.splitResult = result;
  }
}
