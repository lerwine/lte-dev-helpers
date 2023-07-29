import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { RegexTesterService, IParseRegexOptions } from '../regex-tester.service';
import { ConcurrentAsyncExecService } from '../concurrent-async-exec.service';

interface IValueAndJs {
  value: string;
  js: string;
}
interface INumberedGroup extends IValueAndJs {
  index: number;
}

interface INamedGroup extends IValueAndJs {
  name: string;
}

@Component({
  selector: 'app-regex-tester',
  templateUrl: './regex-tester.component.html',
  styleUrls: ['./regex-tester.component.css']
})
export class RegexTesterComponent {
  private _regExpPromise?: Promise<RegExp> = Promise.resolve(new RegExp(''));
  private _concurrencyCount: number = 0;
  private readonly _startTestKey = Symbol();
  private readonly _startExecKey = Symbol();
  private readonly _startReplaceKey = Symbol();
  private readonly _startSplitKey = Symbol();
  
  /**
   * Gets a value indicating whether the pattern text is invalid.
   * @type {boolean}
   * @memberof RegexTesterComponent
   * @public
   */
  public get disallowEvaluation(): boolean { return this.hasParseErrorMessage || this._concurrencyCount > 0; }

  // #region pattern Property
  
  private _pattern: string = "";

  get pattern(): string { return this._pattern; }

  set pattern(value: string) {
    // console.log("set pattern(" + JSON.stringify(value) + ")");
    if (this._pattern == (value = this.asString(value)))
      return;
    // var oldValue = this._pattern;
    this._pattern = value;
    if (!this._stripLeadingWhitespace)
      this._multilinePattern = value;
    if (this._parsePatternOnChange)
      this.startParseRegex();
    else
      this._regExpPromise = undefined;
    this.resetMatchResults();
    // console.log(JSON.stringify({ stripLeadingWhitespace: this._stripLeadingWhitespace, parsePatternOnChange: this._parsePatternOnChange, oldPattern: oldValue, newPattern: this._pattern, multilinePattern: this._multilinePattern }));
  }
  
  // #endregion

  // #region multilinePattern Property

  private readonly _leadingWsRegExp = /[\r\n]+\s*/g;
  
  private _multilinePattern: string = "";

  get multilinePattern(): string { return this._multilinePattern; }

  set multilinePattern(value: string) {
    // console.log("set multilinePattern(" + JSON.stringify(value) + ")");
    if (this._multilinePattern == (value = this.asString(value)))
      return;
    // var oldValue = this._multilinePattern;
    this._multilinePattern = value;
    if (this._stripLeadingWhitespace) {
      if ((value = value.trim()).length > 0)
        value = value.replace(this._leadingWsRegExp, "");
      if (this._pattern != value) {
        this._pattern = value;
        if (this._parsePatternOnChange)
          this.startParseRegex();
        else
          this._regExpPromise = undefined;
      }
    }
    // console.log(JSON.stringify({ stripLeadingWhitespace: this._stripLeadingWhitespace, parsePatternOnChange: this._parsePatternOnChange, pattern: this._pattern, oldMultilinePattern: oldValue, newMultilinePattern: this._multilinePattern }));
  }
  
  // #endregion

  // #region parsePatternOnChange Property

  _parsePatternOnChange: boolean = true;

  get parsePatternOnChange(): boolean { return this._parsePatternOnChange; }

  set parsePatternOnChange(value: boolean) {
    // console.log("set parsePatternOnChange(" + JSON.stringify(value) + ")");
    // var oldValue = this._parsePatternOnChange;
    if (value) {
      if (this._parsePatternOnChange)
        return;
      this._parsePatternOnChange = true;
      this.startParseRegex();
    } else {
      if (!this._parsePatternOnChange)
        return;
      this._parsePatternOnChange = false;
      this.evaluationErrorMessage = "";
    }
    // console.log(JSON.stringify({ stripLeadingWhitespace: this._stripLeadingWhitespace, oldParsePatternOnChange: oldValue, newParsePatternOnChange: this._parsePatternOnChange, pattern: this._pattern, multilinePattern: this._multilinePattern }));
  }
  
  // #endregion

  // #region stripWhitespace Property

  _stripLeadingWhitespace: boolean = false;

  get stripLeadingWhitespace(): boolean { return this._stripLeadingWhitespace; }

  set stripLeadingWhitespace(value: boolean) {
    // console.log("set stripLeadingWhitespace(" + JSON.stringify(value) + ")");
    // var oldValue = this._stripLeadingWhitespace;
    if (value) {
      if (this._stripLeadingWhitespace)
        return;
      this._stripLeadingWhitespace = true;
      this.startParseRegex();
    } else {
      if (!this._stripLeadingWhitespace)
        return;
      this._stripLeadingWhitespace = false;
    }
    // console.log(JSON.stringify({ oldStripLeadingWhitespace: oldValue, newStripLeadingWhitespace: this._stripLeadingWhitespace, parsePatternOnChange: this._parsePatternOnChange, pattern: this._pattern, multilinePattern: this._multilinePattern }));
  }
  
  // #endregion

  // #region parseErrorMessage Properties
  
  parseErrorMessage: string = "";

  /**
   * Gets a value indicating whether the pattern text is invalid.
   * @type {boolean}
   * @memberof RegexTesterComponent
   * @public
   */
  public get hasParseErrorMessage(): boolean { return this.parseErrorMessage.length > 0; }


  // #endregion

  // #region evaluationErrorMessage Properties
  
  evaluationErrorMessage: string = "";
  
  /**
   * Gets a value indicating whether the pattern text is invalid.
   * @type {boolean}
   * @memberof RegexTesterComponent
   * @public
   */
  public get hasEvaluationErrorMessage(): boolean { return this.evaluationErrorMessage.length > 0; }
  
  // #endregion

  // #region targetString Properties
  
  private _targetString: string = "";
  
  get targetString(): string { return this._targetString; }

  set targetString(value: string) {
    if (this._targetString == (value = this.asString(value)))
      return;
    this._targetString = value;
    this.resetMatchResults();
  }
  
  // #endregion

  testResult?: boolean;

  public get hasTestResult(): boolean { return typeof this.testResult === 'boolean' && !this.hasEvaluationErrorMessage; }
  
  public get testPassed(): boolean { return this.testResult === true && !this.hasEvaluationErrorMessage; }
  
  public get testFailed(): boolean { return this.testResult === false && !this.hasEvaluationErrorMessage; }
  
  matchEvaluated: boolean = false;

  matchIndex: number = -1;
  
  get matchSucceeded(): boolean { return this.matchIndex > -1 && this.matchEvaluated && !this.hasEvaluationErrorMessage; }

  get matchFailed(): boolean { return this.matchIndex < 0 && this.matchEvaluated && !this.hasEvaluationErrorMessage; }

  numberedGroups: INumberedGroup[] = [];
  
  get hasNumberedGroups(): boolean { return this.matchEvaluated && this.numberedGroups.length > 0 && !this.hasEvaluationErrorMessage; }

  namedGroups: INamedGroup[] = [];

  get hasNamedGroups(): boolean { return this.matchEvaluated && this.namedGroups.length > 0 && !this.hasEvaluationErrorMessage; }

  replaceValue: string = "";
  
  replaceResult: string = "";

  replaceResultJs: string = "";

  get hasReplacementResult(): boolean { return this.replaceResultJs.length > 0 && !this.hasEvaluationErrorMessage; }

  private _limitValue?: number;

  // #region limitErrorMessage Properties

  limitErrorMessage: string = "";
  
  /**
   * Gets a value indicating whether the limit text is invalid.
   * @type {boolean}
   * @memberof RegexTesterComponent
   * @public
   */
  public get hasLimitErrorMessage(): boolean { return this.limitErrorMessage.length > 0; }
  
  public get disallowSplit(): boolean { return this.hasEvaluationErrorMessage || this.hasLimitErrorMessage; }
  
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
    if (this._limit == value)
      return;
    this._limit = value;
    if ((value = value.trim()).length == 0)
      this._limitValue = undefined;
    else
    {
      var l: number = parseInt(value);
      if (isNaN(l))
        this.limitErrorMessage = "Invalid number";
      else {
        this._limitValue = l;
        this.limitErrorMessage = "";
      }
    }
  }
  
  // #endregion

  splitResult: INumberedGroup[] = [];

  get hasSplitResult(): boolean { return this.splitResult.length > 0 && !this.hasEvaluationErrorMessage; }

  // #region globalFlag Property

  _globalFlag: boolean = false;

  get globalFlag(): boolean { return this._globalFlag; }

  set globalFlag(value: boolean) {
    if (value) {
      if (this._globalFlag)
        return;
      this._globalFlag = true;
    } else {
      if (!this._globalFlag)
        return;
      this._globalFlag = false;
    }
    if (this._parsePatternOnChange)
      this.startParseRegex();
  }
  
  // #endregion

  // #region ignoreCaseFlag Property
  
  _ignoreCaseFlag: boolean = false;

  get ignoreCaseFlag(): boolean { return this._ignoreCaseFlag; }

  set ignoreCaseFlag(value: boolean) {
    if (value) {
      if (this._ignoreCaseFlag)
        return;
      this._ignoreCaseFlag = true;
    } else {
      if (!this._ignoreCaseFlag)
        return;
      this._ignoreCaseFlag = false;
    }
    if (this._parsePatternOnChange)
      this.startParseRegex();
  }
  
  // #endregion

  // #region multilineFlag Property
  
  _multilineFlag: boolean = false;

  get multilineFlag(): boolean { return this._multilineFlag; }

  set multilineFlag(value: boolean) {
    if (value) {
      if (this._multilineFlag)
        return;
      this._multilineFlag = true;
    } else {
      if (!this._multilineFlag)
        return;
      this._multilineFlag = false;
    }
    if (this._parsePatternOnChange)
      this.startParseRegex();
  }
  
  // #endregion

  // #region unicodeFlag Property
  
  _unicodeFlag: boolean = false;

  get unicodeFlag(): boolean { return this._unicodeFlag; }

  set unicodeFlag(value: boolean) {
    if (value) {
      if (this._unicodeFlag)
        return;
      this._unicodeFlag = true;
    } else {
      if (!this._unicodeFlag)
        return;
      this._unicodeFlag = false;
    }
    if (this._parsePatternOnChange)
      this.startParseRegex();
  }
  
  // #endregion

  // #region stickyFlag Property
  
  _stickyFlag: boolean = false;

  get stickyFlag(): boolean { return this._stickyFlag; }

  set stickyFlag(value: boolean) {
    if (value) {
      if (this._stickyFlag)
        return;
      this._stickyFlag = true;
    } else {
      if (!this._stickyFlag)
        return;
      this._stickyFlag = false;
    }
    if (this._parsePatternOnChange)
      this.startParseRegex();
  }
  
  // #endregion

  constructor(private regexTesterService: RegexTesterService, private concurrentAsyncExecService: ConcurrentAsyncExecService) { }

  ngOnInit(): void { this.startTest(); }

  private resetMatchResults() {
    this.testResult = undefined;
    this.evaluationErrorMessage = this.replaceResultJs = "";
    this.matchEvaluated = false;
    this.splitResult = [];
  }

  private asString(value?: any): string {
    switch (typeof value) {
      case 'string':
        return value;
      case 'object':
        return (value === null) ? '' : '' + value;
      default:
        return '' + value;
    }
  }

  private getRegExpPromise(): Promise<RegExp> {
    return (typeof this._regExpPromise === 'undefined') ? this.startParseRegex() : this._regExpPromise;
  }

  private startParseRegex(): Promise<RegExp> {
    this._concurrencyCount++;
    this.parseErrorMessage = "";
    this.resetMatchResults();
    this._regExpPromise = this.regexTesterService.parseRegExp({
      pattern: this._pattern,
      globalFlag: this._globalFlag,
      ignoreCaseFlag: this._ignoreCaseFlag,
      multilineFlag: this._multilineFlag,
      stickyFlag: this._stickyFlag,
      unicodeFlag: this._unicodeFlag
    });
    this._regExpPromise.catch(reason => {
      if ((this.parseErrorMessage = this.asString(reason).trim()).length == 0)
        this.parseErrorMessage = "Invalid regular expression.";
    })
    .finally(() => this._concurrencyCount--);
    return this._regExpPromise;
  }

  startTest(): void {
    this._concurrencyCount++;
    this.resetMatchResults();
    this.concurrentAsyncExecService.then1<RegExp, string, boolean>(this._startTestKey, this.getRegExpPromise(), this._targetString,
      (exp, s) => this.regexTesterService.testRegExp(s, exp), reason => this.evaluationErrorMessage = ((reason = this.asString(reason).trim()).length == 0) ? "An unexpected error has occurred." : reason)
      .then(value => this.testResult = value)
      .finally(() => this._concurrencyCount--);
  }

  startExec(): void {
    this._concurrencyCount++;
    this.resetMatchResults();
    this.concurrentAsyncExecService.then1<RegExp, string, RegExpExecArray | null>(this._startExecKey, this.getRegExpPromise(), this._targetString,
      (exp, s) => this.regexTesterService.execRegExp(s, exp), reason => this.evaluationErrorMessage = ((reason = this.asString(reason).trim()).length == 0) ? "An unexpected error has occurred." : reason)
      .then(result => {
        this.matchEvaluated = true;
        if (result === null)
        {
          this.matchIndex = -1;
          this.numberedGroups = [];
          this.namedGroups = [];
          return;
        }
        this.matchIndex = result.index;
        this.numberedGroups = result.map((v, i) => <INumberedGroup>{ index: i, value: v, js: JSON.stringify(v) });
        this.namedGroups = [];
        if (typeof result.groups !== 'undefined' && result.groups !== null)
          for (var n in result.groups) {
            var s = result.groups[n];
            this.namedGroups.push({ name: n, value: s, js: JSON.stringify(s) });
          }
      })
      .finally(() => this._concurrencyCount--);
  }

  startReplace(): void {
    this._concurrencyCount++;
    this.resetMatchResults();
    this.concurrentAsyncExecService.then2<RegExp, string, string, string>(this._startReplaceKey, this.getRegExpPromise(), this._targetString, this.replaceValue,
      (exp, s, r) => this.regexTesterService.replaceRegExp(s, exp, r), reason => this.evaluationErrorMessage = ((reason = this.asString(reason).trim()).length == 0) ? "An unexpected error has occurred." : reason)
      .then(result => {
        this.replaceResult = result;
        this.replaceResultJs = JSON.stringify(result);
      })
      .finally(() => this._concurrencyCount--);
  }

  startSplit(): void {
    if (this.hasLimitErrorMessage)
      return;
    this._concurrencyCount++;
    this.resetMatchResults();
    this.concurrentAsyncExecService.then2<RegExp, string, number | undefined, string[]>(this._startSplitKey, this.getRegExpPromise(), this._targetString, this._limitValue,
      (exp, s, r) => this.regexTesterService.splitRegExp(s, exp, r), reason => this.evaluationErrorMessage = ((reason = this.asString(reason).trim()).length == 0) ? "An unexpected error has occurred." : reason)
      .then(result => this.splitResult = result.map((v, i) => <INumberedGroup>{ value: v, index: i, js: JSON.stringify(v) }))
      .finally(() => this._concurrencyCount--);
  }
}
