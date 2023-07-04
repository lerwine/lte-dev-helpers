import { Injectable } from '@angular/core';

export interface IParseRegexOptions {
  pattern: string;
  globalFlag: boolean;
  ignoreCaseFlag: boolean;
  multilineFlag: boolean;
  unicodeFlag: boolean;
  stickyFlag: boolean;
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
          reject(e);
        }
      });
  }

  async testRegExp(targetString: string, exp: RegExp): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      try {
        resolve(exp.test(targetString));
      } catch (e) {
        reject(e);
      }
    });
  }

  async execRegExp(targetString: string, exp: RegExp): Promise<RegExpExecArray | null> {
    return await new Promise((resolve, reject) => {
      try {
        resolve(exp.exec(targetString));
      } catch (e) {
        reject(e);
      }
    });

  }

  async replaceRegExp(targetString: string, exp: RegExp, replacementString: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      try {
        resolve(targetString.replace(exp, replacementString));
      } catch (e) {
        reject(e);
      }
    });
  }

  async splitRegExp(targetString: string, exp: RegExp, limit?: number): Promise<string[]> {
    return await new Promise((resolve, reject) => {
      try {
        if (typeof limit === 'number')
          resolve(targetString.split(exp, limit));
        else
          resolve(targetString.split(exp));
      } catch (e) {
        reject(e);
      }
    });
  }

  constructor() { }
}
