import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

export enum OperationType {
  test,
  exec,
  replace,
  split
}

export interface IRegexTestOptions {
  concurrencyId: number;
  pattern: string;
  targetString: string;
  globalFlag: boolean;
  ignoreCaseFlag: boolean;
  multilineFlag: boolean;
  unicodeFlag: boolean;
  stickyFlag: boolean;
}

export interface IRegexReplaceOptions extends IRegexTestOptions {
  replaceValue: string;
}

export interface IRegexSplitOptions extends IRegexTestOptions {
  limit?: string;
}

export interface ICreateRegExpSuccessResult {
  concurrencyId: number;
  regex: RegExp;
}

export interface ICreateRegExpFailedResult {
  concurrencyId: number;
  error: Error | string;
}

export interface IRegExpTestResult extends ICreateRegExpSuccessResult {
  result: boolean;
}

export interface IRegExpExecResult extends ICreateRegExpSuccessResult {
  result: RegExpExecArray | null;
}

export interface IRegExpReplaceResult extends ICreateRegExpSuccessResult {
  result: string;
}

export interface IRegExpSplitResult extends ICreateRegExpSuccessResult {
  result: string[];
}

export function isValidResult<T>(result: T | ICreateRegExpFailedResult): result is T {
  return typeof (<ICreateRegExpFailedResult>result).error !== 'undefined';
}

function createRegExpPromise(options: IRegexTestOptions) : Promise<RegExp> {
  if (options.globalFlag)
    return Promise.resolve(RegExp(options.pattern, options.ignoreCaseFlag ? (options.multilineFlag ? (options.unicodeFlag ? (options.stickyFlag ? 'gimuy' : 'gimu') : options.stickyFlag ? 'gimy' : 'gim') :
      options.unicodeFlag ? (options.stickyFlag ? 'giuy' : 'giu') : options.stickyFlag ? 'giy' : 'gi') :
      options.multilineFlag ? (options.unicodeFlag ? (options.stickyFlag ? 'gmuy' : 'gmu') : options.stickyFlag ? 'gmy' : 'gm') : options.unicodeFlag ? (options.stickyFlag ? 'guy' : 'gu') : options.stickyFlag ? 'gy' : 'g'));
  if (options.ignoreCaseFlag)
  return Promise.resolve(new RegExp(options.pattern, options.multilineFlag ? (options.unicodeFlag ? (options.stickyFlag ? 'imuy' : 'imu') : options.stickyFlag ? 'imy' : 'im') :
      options.unicodeFlag ? (options.stickyFlag ? 'iuy' : 'iu') : options.stickyFlag ? 'iy' : 'i'));
  if (options.multilineFlag)
    return Promise.resolve(new RegExp(options.pattern, options.unicodeFlag ? (options.stickyFlag ? 'muy' : 'mu') : options.stickyFlag ? 'my' : 'm'));
  if (options.unicodeFlag)
    return Promise.resolve(new RegExp(options.pattern, options.stickyFlag ? 'uy' : 'u'));
  return Promise.resolve(options.stickyFlag ? new RegExp(options.pattern, 'y') : new RegExp(options.pattern));
}

async function testRegExp(options: IRegexTestOptions): Promise<IRegExpTestResult | ICreateRegExpFailedResult> {
  var exp: RegExp;
  try {
    exp = await createRegExpPromise(options);
  } catch (e) {
    return <ICreateRegExpFailedResult>{
      concurrencyId: options.concurrencyId,
      error: e
    };
  }
  return <IRegExpTestResult>{
    concurrencyId: options.concurrencyId,
    regex: exp,
    result: exp.test(options.targetString)
  };
}

async function execRegExp(options: IRegexTestOptions): Promise<IRegExpExecResult | ICreateRegExpFailedResult> {
  var exp: RegExp;
  try {
    exp = await createRegExpPromise(options);
  } catch (e) {
    return <ICreateRegExpFailedResult>{
      concurrencyId: options.concurrencyId,
      error: e
    };
  }
  return <IRegExpExecResult>{
    concurrencyId: options.concurrencyId,
    regex: exp,
    result: exp.exec(options.targetString)
  };
}

async function replaceRegExp(options: IRegexReplaceOptions): Promise<IRegExpReplaceResult | ICreateRegExpFailedResult> {
  var exp: RegExp;
  try {
    exp = await createRegExpPromise(options);
  } catch (e) {
    return <ICreateRegExpFailedResult>{
      concurrencyId: options.concurrencyId,
      error: e
    };
  }
  return <IRegExpReplaceResult>{
    concurrencyId: options.concurrencyId,
    regex: exp,
    result: options.targetString.replace(exp, options.replaceValue)
  };
}

async function splitRegExp(options: IRegexSplitOptions): Promise<IRegExpSplitResult | ICreateRegExpFailedResult> {
  var exp: RegExp;
  try {
    exp = await createRegExpPromise(options);
  } catch (e) {
    return <ICreateRegExpFailedResult>{
      concurrencyId: options.concurrencyId,
      error: e
    };
  }
  var s: string | undefined = options.limit;
  if (typeof s === 'string' && (s = s.trim()).length > 0)
  {
    var limit: number = parseInt(s);
    if (isNaN(limit))
      return <ICreateRegExpFailedResult>{
        concurrencyId: options.concurrencyId,
        error: "Invalid number value"
      };
    return <IRegExpSplitResult>{
      concurrencyId: options.concurrencyId,
      regex: exp,
      result: options.targetString.split(exp, limit)
    };
  }
  return <IRegExpSplitResult>{
    concurrencyId: options.concurrencyId,
    regex: exp,
    result: options.targetString.split(exp)
  };
}

@Injectable({
  providedIn: 'root'
})
export class RegexTesterService {
  testRegExp(options: IRegexTestOptions): Observable<IRegExpTestResult | ICreateRegExpFailedResult> { return from(testRegExp(options)); }

  execRegExp(options: IRegexTestOptions): Observable<IRegExpExecResult | ICreateRegExpFailedResult> { return from(execRegExp(options)); }

  replaceRegExp(options: IRegexReplaceOptions): Observable<IRegExpReplaceResult | ICreateRegExpFailedResult> { return from(replaceRegExp(options)); }

  splitRegExp(options: IRegexSplitOptions): Observable<IRegExpSplitResult | ICreateRegExpFailedResult> { return from(splitRegExp(options)); }

  constructor() { }
}
