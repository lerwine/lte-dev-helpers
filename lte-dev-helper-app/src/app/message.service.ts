import { Injectable } from '@angular/core';

const CSS_CLASS_debug: string = "debug";
const CSS_CLASS_verbose: string = "verbose";
const CSS_CLASS_info: string = "info";
const CSS_CLASS_warning: string = "warning";
const CSS_CLASS_error: string = "error";
const CSS_CLASS_critical: string = "critical";

export enum MessageLevel {
  debug,
  verbose,
  info,
  warning,
  error,
  critical
}

export interface IMessage {
  short_description: string;
  details?: string;
  level: MessageLevel;
  class: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _allMessages: IMessage[] = [];

  messages: IMessage[] = [];

  // #region level Property
  
  private _level: MessageLevel = MessageLevel.info;
  
  public get level(): MessageLevel { return this._level; }
  
  public set level(value: MessageLevel) {
    if (this._level == value)
      return;
    if (this._allMessages.length > 0)
    {
      if (value > this._level)
        this.messages = this.messages.filter(m => m.level >= value);
      else if (value == MessageLevel.debug)
      {
        this.messages = [];
        for (var m of this._allMessages)
          this.messages.push(m);
      }
      else
        this.messages = this._allMessages.filter(m => m.level >= value);
    }
    this._level = value;
  }
  
  // #endregion

  constructor() { }

  addDebug(short_description: string, details?: string) {
    var message: IMessage = (typeof details === 'string' && (details = details.trim()).length > 0) ?
      { short_description: short_description, details: details, level: MessageLevel.debug, class: CSS_CLASS_debug } :
      { short_description: short_description, level: MessageLevel.debug, class: CSS_CLASS_debug };
    this._allMessages.push(message);
    if (this._level == MessageLevel.debug)
      this.messages.push(message);
  }

  addVerbose(short_description: string, details?: string) {
    var message: IMessage = (typeof details === 'string' && (details = details.trim()).length > 0) ?
      { short_description: short_description, details: details, level: MessageLevel.verbose, class: CSS_CLASS_verbose } :
      { short_description: short_description, level: MessageLevel.verbose, class: CSS_CLASS_verbose };
    this._allMessages.push(message);
    if (this._level <= MessageLevel.verbose)
      this.messages.push(message);
  }

  add(short_description: string, details?: string) {
    var message: IMessage = (typeof details === 'string' && (details = details.trim()).length > 0) ?
      { short_description: short_description, details: details, level: MessageLevel.info, class: CSS_CLASS_info } :
      { short_description: short_description, level: MessageLevel.info, class: CSS_CLASS_info };
    this._allMessages.push(message);
    if (this._level <= MessageLevel.info)
      this.messages.push(message);
  }

  addWarning(short_description: string, details?: string) {
    var message: IMessage = (typeof details === 'string' && (details = details.trim()).length > 0) ?
      { short_description: short_description, details: details, level: MessageLevel.debug, class: CSS_CLASS_warning } :
      { short_description: short_description, level: MessageLevel.warning, class: CSS_CLASS_warning };
    this._allMessages.push(message);
    if (this._level <= MessageLevel.warning)
      this.messages.push(message);
  }

  addError(short_description: string, details?: string) {
    var message: IMessage = (typeof details === 'string' && (details = details.trim()).length > 0) ?
      { short_description: short_description, details: details, level: MessageLevel.error, class: CSS_CLASS_error } :
      { short_description: short_description, level: MessageLevel.error, class: CSS_CLASS_error };
    this._allMessages.push(message);
    if (this._level <= MessageLevel.error)
      this.messages.push(message);
  }

  addCritical(short_description: string, details?: string) {
    var message: IMessage = (typeof details === 'string' && (details = details.trim()).length > 0) ?
      { short_description: short_description, details: details, level: MessageLevel.critical, class: CSS_CLASS_critical } :
      { short_description: short_description, level: MessageLevel.critical, class: CSS_CLASS_critical };
    this._allMessages.push(message);
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
    this._allMessages = [];
  }
}
