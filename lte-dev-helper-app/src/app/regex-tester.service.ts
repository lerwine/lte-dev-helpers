import { Injectable } from '@angular/core';

export enum OperationType {
  test,
  exec,
  replace,
  split
}

export interface IParseRegexOptions {
  pattern: string;
  globalFlag: boolean;
  ignoreCaseFlag: boolean;
  multilineFlag: boolean;
  unicodeFlag: boolean;
  stickyFlag: boolean;
}

export interface IOperationFailure {
  isRegexParse: boolean;
  error: any;
}

export function isOperationFailure(obj: any): obj is IOperationFailure {
  return typeof obj === 'object' && obj !== null && typeof <IOperationFailure>obj.isRegexParse === 'boolean' && typeof <IOperationFailure>obj.error !== 'undefined';
}

@Injectable({
  providedIn: 'root'
})
export class RegexTesterService {
  async parseRegExp(options: IParseRegexOptions): Promise<RegExp> {
      return await new Promise((resolve, reject) => {
        try {
          if (options.globalFlag)
            resolve(RegExp(options.pattern, options.ignoreCaseFlag ? (options.multilineFlag ? (options.unicodeFlag ? (options.stickyFlag ? 'gimuy' : 'gimu') : options.stickyFlag ? 'gimy' : 'gim') :
              options.unicodeFlag ? (options.stickyFlag ? 'giuy' : 'giu') : options.stickyFlag ? 'giy' : 'gi') :
              options.multilineFlag ? (options.unicodeFlag ? (options.stickyFlag ? 'gmuy' : 'gmu') : options.stickyFlag ? 'gmy' : 'gm') : options.unicodeFlag ? (options.stickyFlag ? 'guy' : 'gu') : options.stickyFlag ? 'gy' : 'g'));
          else if (options.ignoreCaseFlag)
            resolve(new RegExp(options.pattern, options.multilineFlag ? (options.unicodeFlag ? (options.stickyFlag ? 'imuy' : 'imu') : options.stickyFlag ? 'imy' : 'im') :
              options.unicodeFlag ? (options.stickyFlag ? 'iuy' : 'iu') : options.stickyFlag ? 'iy' : 'i'));
          else if (options.multilineFlag)
            resolve(new RegExp(options.pattern, options.unicodeFlag ? (options.stickyFlag ? 'muy' : 'mu') : options.stickyFlag ? 'my' : 'm'));
          else if (options.unicodeFlag)
            resolve(new RegExp(options.pattern, options.stickyFlag ? 'uy' : 'u'));
          else
            resolve(options.stickyFlag ? new RegExp(options.pattern, 'y') : new RegExp(options.pattern));
        } catch (e) {
          reject(<IOperationFailure>{ isRegexParse: true, error: e });
        }
      });
  }

  async testRegExp(targetString: string, pattern: RegExp): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      try {
        resolve(pattern.test(targetString));
      } catch (e) {
        reject(<IOperationFailure>{ isRegexParse: false, error: e });
      }
    });
  }

  async execRegExp(targetString: string, pattern: RegExp): Promise<RegExpExecArray | null> {
    return await new Promise((resolve, reject) => {
      try {
        resolve(pattern.exec(targetString));
      } catch (e) {
        reject(<IOperationFailure>{ isRegexParse: false, error: e });
      }
    });

  }

  async replaceRegExp(targetString: string, pattern: RegExp, replacementString: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      try {
      } catch (e) {
        reject(<IOperationFailure>{ isRegexParse: false, error: e });
      }
    });
    var exp: RegExp = await pattern;
    return targetString.replace(exp, replacementString);

  }

  async splitRegExp(targetString: string, pattern: RegExp, limit?: number): Promise<string[]> {
    return await new Promise((resolve, reject) => {
      try {
        if (typeof limit === 'number')
          resolve(targetString.split(pattern, limit));
        else
          resolve(targetString.split(pattern));
      } catch (e) {
        reject(<IOperationFailure>{ isRegexParse: false, error: e });
      }
    });
  }

  constructor() { }
}
