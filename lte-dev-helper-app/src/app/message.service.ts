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

export class Message {
  short_description: string;
  details?: string;
  level: MessageLevel;
  class: string;
  constructor(level: MessageLevel, short_description: string, details?: string) {
    this.level = level;
    switch (level) {
      case MessageLevel.debug:
        this.class = CSS_CLASS_debug;
        break;
      case MessageLevel.verbose:
        this.class = CSS_CLASS_verbose;
        break;
      case MessageLevel.warning:
        this.class = CSS_CLASS_warning;
        break;
      case MessageLevel.error:
        this.class = CSS_CLASS_error;
        break;
      case MessageLevel.critical:
        this.class = CSS_CLASS_critical;
        break;
      default:
        this.class = CSS_CLASS_info;
        break;
    }
    this.short_description = short_description;
    if (typeof details === 'string' && (details = details.trim()).length > 0)
      this.details = details;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _allMessages: Message[] = [];

  messages: Message[] = [];

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

  add(short_description: string, details?: string) {
    var message: Message = new Message(MessageLevel.info, short_description, details);
    this._allMessages.push(message);
    if (this._level <= MessageLevel.info)
      this.messages.push(message);
  }

  addDebug(short_description: string, details?: string) {
    var message: Message = new Message(MessageLevel.debug, short_description, details);
    this._allMessages.push(message);
    if (this._level == MessageLevel.debug)
      this.messages.push(message);
  }

  addVerbose(short_description: string, details?: string) {
    var message: Message = new Message(MessageLevel.verbose, short_description, details);
    this._allMessages.push(message);
    if (this._level <= MessageLevel.verbose)
      this.messages.push(message);
  }

  addWarning(short_description: string, details?: string) {
    var message: Message = new Message(MessageLevel.warning, short_description, details);
    this._allMessages.push(message);
    if (this._level <= MessageLevel.warning)
      this.messages.push(message);
  }

  addError(short_description: string, details?: string) {
    var message: Message = new Message(MessageLevel.error, short_description, details);
    this._allMessages.push(message);
    if (this._level <= MessageLevel.error)
      this.messages.push(message);
  }

  addCritical(short_description: string, details?: string) {
    var message: Message = new Message(MessageLevel.critical, short_description, details);
    this._allMessages.push(message);
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
    this._allMessages = [];
  }
}
