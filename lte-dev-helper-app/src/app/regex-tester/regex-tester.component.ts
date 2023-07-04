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
  canEvaluate: boolean = true;

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

  canStartSplit: boolean = true;

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
      this.canStartSplit = true;
      this._limitValue = undefined;
    }
    else
    {
      var l: number = parseInt(value);
      this.canStartSplit = !isNaN(l);
      if (this.canStartSplit) {
        this._limitValue = l;
        this.limitErrorMessage = "";
      } else
        this.limitErrorMessage = "Invalid number";
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

  ngOnInit(): void { this.startParse(); }

  startTest(): void {
    this.parseErrorMessage = "";
    this.canEvaluate = false;
    this.testResult = "";
    this.startParse().then(exp => this.regexTesterService.testRegExp(this.targetString, exp)).then(this.onTestCompleted).catch(this.onOperationFailed);
  }

  startExec(): void {
    this.parseErrorMessage = "";
    this.canEvaluate = false;
    this.matchIndex = -1;
    this.numberedGroups = [];
    this.namedGroups = [];
    this.matchEvaluated = false;
    this.startParse().then(exp => this.regexTesterService.execRegExp(this.targetString, exp)).then(this.onExecCompleted).catch(this.onOperationFailed);
  }

  startReplace(): void {
    this.replaceResult = undefined;
    this.startParse().then(exp => this.regexTesterService.replaceRegExp(this.targetString, exp, this.replaceValue)).then(this.onReplaceCompleted).catch(this.onOperationFailed);
  }

  startSplit(): void {
    if (!this.canStartSplit)
      return;
    this.parseErrorMessage = "";
    this.canEvaluate = false;
    this.splitResult = [];
    this.canStartSplit = false;
    this.startParse().then(exp => this.regexTesterService.splitRegExp(this.targetString, exp, this._limitValue)).then(this.onSplitCompleted).catch(reason => {
      this.canStartSplit = true;
      this.onOperationFailed(reason);
    });
  }

  private startParse(): Promise<RegExp> {
    return this.regexTesterService.parseRegExp({
      pattern: this.pattern,
      globalFlag: this.globalFlag,
      ignoreCaseFlag: this.ignoreCaseFlag,
      multilineFlag: this.multilineFlag,
      unicodeFlag: this.unicodeFlag,
      stickyFlag: this.stickyFlag
    });
  }

  private onOperationFailed(reason: any) {
    this.canEvaluate = true;
    if (typeof reason === 'string')
    {
      if ((this.parseErrorMessage = reason.trim()).length > 0)
        return;
    } else if (typeof reason !== 'undefined' && reason !== null && (this.parseErrorMessage = reason.toString().trim()).length > 0)
      return;
    this.parseErrorMessage = "Unexpected error";
  }
  
  private onTestCompleted(result: boolean): void {
    this.canEvaluate = true;
    this.testResult = result.toString();
  }

  private onExecCompleted(result: RegExpExecArray | null): void {
    this.canEvaluate = true;
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
    this.canEvaluate = true;
    this.replaceResult = result;
  }

  private onSplitCompleted(result: string[]): void {
    this.canEvaluate = this.canStartSplit = true;
    this.splitResult = result;
  }
}
