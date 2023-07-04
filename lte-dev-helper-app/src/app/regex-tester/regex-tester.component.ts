import { Component } from '@angular/core';

import { RegexTesterService, IParseRegexOptions } from '../regex-tester.service';

interface INumberedGroup {
  index: number;
  value: string;
}

interface INamedGroup {
  name: string;
  value: string;
}

@Component({
  selector: 'app-regex-tester',
  templateUrl: './regex-tester.component.html',
  styleUrls: ['./regex-tester.component.css']
})
export class RegexTesterComponent implements IParseRegexOptions {
  disallowEvaluation: boolean = false;

  pattern: string = "";
  
  // #region hasParseErrorMessage Property
  
  /**
   * Gets a value indicating whether the pattern text is invalid.
   * @type {boolean}
   * @memberof RegexTesterComponent
   * @public
   */
  public get hasParseErrorMessage(): boolean { return this.limitErrorMessage.length > 0; }
  
  parseErrorMessage: string = "";

  targetString: string = "";
  
  testResult: string = "";

  matchEvaluated: boolean = false;

  matchIndex: number = -1;
  
  numberedGroups: INumberedGroup[] = [];
  
  namedGroups: INamedGroup[] = [];

  replaceValue: string = "";
  
  replaceResult?: string;

  disallowSplit: boolean = false;

  private _limitValue?: number;

  // #region hasLimitErrorMessage Property
  
  /**
   * Gets a value indicating whether the limit text is invalid.
   * @type {boolean}
   * @memberof RegexTesterComponent
   * @public
   */
  public get hasLimitErrorMessage(): boolean { return this.limitErrorMessage.length > 0; }
  
  // #endregion

  limitErrorMessage: string = "";

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
    {
      this.disallowSplit = false;
      this._limitValue = undefined;
    }
    else
    {
      var l: number = parseInt(value);
      this.disallowSplit = isNaN(l);
      if (this.disallowSplit)
        this.limitErrorMessage = "Invalid number";
      else {
        this._limitValue = l;
        this.limitErrorMessage = "";
      }
    }
  }
  
  // #endregion

  splitResult: string[] = [];

  globalFlag: boolean = false;
  
  ignoreCaseFlag: boolean = false;
  
  multilineFlag: boolean = false;
  
  unicodeFlag: boolean = false;
  
  stickyFlag: boolean = false;
  
  constructor(private regexTesterService: RegexTesterService) { }

  ngOnInit(): void { this.startTest(); }

  startTest(): void {
    this.parseErrorMessage = "";
    var disallowSplit = this.disallowSplit;
    this.disallowSplit = this.disallowEvaluation = true;
    this.testResult = "";
    this.regexTesterService.parseRegExp(this).then(exp => this.regexTesterService.testRegExp(this.targetString, exp)).then(result => {
      this.disallowSplit = disallowSplit;
      this.onTestCompleted(result);
    }).catch(reason => {
      this.disallowSplit = disallowSplit;
      this.onOperationFailed(reason);
    });
  }

  startExec(): void {
    this.parseErrorMessage = "";
    var disallowSplit = this.disallowSplit;
    this.disallowSplit = this.disallowEvaluation = true;
    this.matchIndex = -1;
    this.numberedGroups = [];
    this.namedGroups = [];
    this.matchEvaluated = false;
    this.regexTesterService.parseRegExp(this).then(exp => this.regexTesterService.execRegExp(this.targetString, exp)).then(result => {
      this.disallowSplit = disallowSplit;
      this.onExecCompleted(result);
    }).catch(reason => {
      this.disallowSplit = disallowSplit;
      this.onOperationFailed(reason);
    });
  }

  startReplace(): void {
    var disallowSplit = this.disallowSplit;
    this.disallowSplit = this.disallowEvaluation = true;
    this.replaceResult = undefined;
    this.regexTesterService.parseRegExp(this).then(exp => this.regexTesterService.replaceRegExp(this.targetString, exp, this.replaceValue)).then(result => {
      this.disallowSplit = disallowSplit;
      this.onReplaceCompleted(result);
    }).catch(reason => {
      this.disallowSplit = disallowSplit;
      this.onOperationFailed(reason);
    });
  }

  startSplit(): void {
    if (this.disallowSplit)
      return;
    this.parseErrorMessage = "";
    this.disallowEvaluation = true;
    this.splitResult = [];
    this.disallowSplit = true;
    this.regexTesterService.parseRegExp(this).then(exp => this.regexTesterService.splitRegExp(this.targetString, exp, this._limitValue)).then(this.onSplitCompleted).catch(reason => {
      this.disallowSplit = false;
      this.onOperationFailed(reason);
    });
  }

  private onOperationFailed(reason: any) {
    this.disallowEvaluation = false;
    if (typeof reason === 'string')
    {
      if ((this.parseErrorMessage = reason.trim()).length > 0)
        return;
    } else if (typeof reason !== 'undefined' && reason !== null && (this.parseErrorMessage = reason.toString().trim()).length > 0)
      return;
    this.parseErrorMessage = "Unexpected error";
  }
  
  private onTestCompleted(result: boolean): void {
    this.disallowEvaluation = false;
    this.testResult = result.toString();
  }

  private onExecCompleted(result: RegExpExecArray | null): void {
    this.disallowEvaluation = false;
    if (result === null)
    {
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

  private onReplaceCompleted(result: string): void {
    this.disallowEvaluation = false;
    this.replaceResult = result;
  }

  private onSplitCompleted(result: string[]): void {
    this.disallowEvaluation = this.disallowSplit = false;
    this.splitResult = result;
  }
}
