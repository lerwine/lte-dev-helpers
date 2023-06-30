import { Injectable } from '@angular/core';

const CSS_CLASS_debug: string = "message-debug";
const CSS_CLASS_verbose: string = "message-verbose";
const CSS_CLASS_info: string = "message-info";
const CSS_CLASS_warning: string = "message-warning";
const CSS_CLASS_error: string = "message-error";
const CSS_CLASS_critical: string = "message-critical";

/**
 * Message severity levels.
 * @export
 * @enum {number}
 */
export enum MessageLevel {
  /**
   * Debug-level message type.
   */
  debug,

  /**
   * Verbose message type.
   */
  verbose,

  /**
   * Informationaal message type.
   */
  info,

  /**
   * Warning message type.
   */
  warning,

  /**
   * Error message type.
   */
  error,

  /**
   * Critical error message type.
   */
  critical
}

/**
 * Represents an application message.
 * @export
 * @class Message
 */
export class Message {
  /**
   * Gets the short description of the message.
   * @type {string}
   * @memberof Message
   */
  short_description: string;

  /**
   * Gets the optional detailed message.
   * @type {(string | undefined)}
   * @memberof Message
   */
  details?: string;
  
  /**
   * Gets the optional error associated with the message.
   * @type {(string | Error)}
   * @memberof Message
   */
  error?: Error;
  
  /**
   * Gets the message severity level.
   * @type {MessageLevel}
   * @memberof Message
   */
  level: MessageLevel;
  
  /**
   * Gets the CSS class name for the message.
   * @type {string}
   * @memberof Message
   */
  cssClass: string;
  
  /**
   * Creates an instance of the Message class.
   * @param {MessageLevel} level - The message severity level.
   * @param {string} short_description - The short description of the message.
   * @param {string} [details] - The optional detailed message.
   * @memberof Message
   */
  constructor(level: MessageLevel, short_description: string, details?: string, error?: Error) {
    this.level = level;
    switch (level) {
      case MessageLevel.debug:
        this.cssClass = CSS_CLASS_debug;
        break;
      case MessageLevel.verbose:
        this.cssClass = CSS_CLASS_verbose;
        break;
      case MessageLevel.warning:
        this.cssClass = CSS_CLASS_warning;
        break;
      case MessageLevel.error:
        this.cssClass = CSS_CLASS_error;
        break;
      case MessageLevel.critical:
        this.cssClass = CSS_CLASS_critical;
        break;
      default:
        this.cssClass = CSS_CLASS_info;
        break;
    }
    this.short_description = short_description;
    if (typeof details === 'string' && (details = details.trim()).length > 0)
    {
      this.details = details;
      if (typeof error === 'object' && error != null)
        this.error = error;
    }
    else if (typeof error === 'object' && error != null) {
      this.error = error;
      var cause: string | undefined = (typeof error.cause === 'string') ? error.cause : (typeof error.cause === 'object' && error.cause != null) ? error.cause.toString() : undefined;
      var stack: string | undefined = error.stack;
      var name: string = error.name;
      if (typeof (details = error.message) === 'string' && (details = details.trim()).length > 0)
      {
        if (typeof cause === 'string' && (cause = cause.trim()).length > 0)
        {
          if (typeof stack === 'string' && (stack = stack.trim()).length > 0)
          {
            if (typeof name === 'string' && (name = name.trim()).length > 0)
              this.details = 'Error Name: ' + name + "\nMessage: " + details + "\n\nCause: " + cause + "\n\nStack Trace:\n" + stack;
            else
              this.details = 'Error Message: ' + details + "\n\nCause: " + cause + "\n\nStack Trace:\n" + stack;
          } else if (typeof name === 'string' && (name = name.trim()).length > 0)
            this.details = 'Error Name: ' + name + "\nMessage: " + details + "\n\nCause: " + cause;
          else
            this.details = 'Error Message: ' + details + "\n\nCause: " + cause;
        }
        else if (typeof stack === 'string' && (stack = stack.trim()).length > 0)
        {
          if (typeof name === 'string' && (name = name.trim()).length > 0)
            this.details = 'Error Name: ' + name + "\nMessage: " + details + "\n\nStack Trace:\n" + stack;
          else
            this.details = 'Error Message: ' + details + "\n\nStack Trace:\n" + stack;
        } else if (typeof name === 'string' && (name = name.trim()).length > 0)
          this.details = 'Error Name: ' + name + "\nMessage: " + details;
        else
          this.details = 'Error Message: ' + details;
      }
      else if (typeof cause === 'string' && (cause = cause.trim()).length > 0)
      {
        if (typeof stack === 'string' && (stack = stack.trim()).length > 0)
        {
          if (typeof name === 'string' && (name = name.trim()).length > 0)
            this.details = 'Error Name: ' + name + "\n\nCause: " + cause + "\n\nStack Trace:\n" + stack;
          else
            this.details = 'Cause: ' + cause + "\n\nStack Trace:\n" + stack;
        } else if (typeof name === 'string' && (name = name.trim()).length > 0)
          this.details = 'Error Name: ' + name + "\n\nCause: " + cause;
        else
          this.details = 'Cause: ' + cause;
      }
      else if (typeof stack === 'string' && (stack = stack.trim()).length > 0)
      {
        if (typeof name === 'string' && (name = name.trim()).length > 0)
          this.details = 'Error Name: ' + name + "\n\nStack Trace:\n" + stack;
        else
          this.details = 'Stack Trace: ' + stack;
      } else if (typeof name === 'string' && (name = name.trim()).length > 0)
        this.details = 'Error Name: ' + name;
      else if ((details = error.toString().trim()).length > 0)
        this.details = details;
    }
  }
}

/**
 * Manages application messages.
 * @export
 * @class MessageService
 */
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _allMessages: Message[] = [];

  /**
   * Gets the messages to be displayed.
   * @type {Message[]}
   * @memberof MessageService
   */
  messages: Message[] = [];

  // #region level Property
  
  private _level: MessageLevel = MessageLevel.info;
  
  /**
   * Gets or sets the minimum severity level of the messages to be displayed.
   * @type {MessageLevel}
   * @memberof MessageService
   * @public
   */
  public get level(): MessageLevel { return this._level; }
  
  /** @type {MessageLevel} */
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

  private addMessage(messageLevel: MessageLevel, short_description: string, details?: string | Error) {
    var message: Message;
    if (typeof short_description !== 'string' || (short_description = short_description.trim()).length == 0)
    {
      if (typeof details === 'string')
      {
        if ((details = details.trim()).length == 0)
          return;
          var i = details.indexOf('\n');
          message = (i < 0) ? new Message(messageLevel, details) : new Message(messageLevel, details.substring(0, i), details.substring(i));
      }
      else
      {
        if (typeof details !== 'object' || details == null)
          return;
        message = new Message(messageLevel, "Unexpected error", undefined, details);
      }
      if (typeof details !== 'string' || (details = details.trim()).length == 0)
        return;
    }
    else
      message = (typeof details === 'string') ? new Message(messageLevel, short_description, details) : new Message(messageLevel, short_description, undefined, details);
    this._allMessages.push(message);
    if (messageLevel >= this._level)
      this.messages.push(message);
  }

  /**
   * Adds a new informational message.
   * @param {string} short_description - The short description of the message.
   * @param {string} [details] - The optional message details.
   * @memberof MessageService
   */
  add(short_description: string, details?: string) { this.addMessage(MessageLevel.info, short_description, details); }

  /**
   * Adds a new debug message.
   * @param {string} short_description - The short description of the message.
   * @param {string} [details] - The optional message details.
   * @memberof MessageService
   */
  addDebug(short_description: string, details?: string) { this.addMessage(MessageLevel.debug, short_description, details); }

  /**
   * Adds a new verbose message.
   * @param {string} short_description - The short description of the message.
   * @param {string} [details] - The optional message details.
   * @memberof MessageService
   */
  addVerbose(short_description: string, details?: string) { this.addMessage(MessageLevel.verbose, short_description, details); }

  /**
   * Adds a new warning message.
   * @param {string} short_description - The short description of the message.
   * @param {string | Error} [details] - The optional message details.
   * @memberof MessageService
   */
  addWarning(short_description: string, details?: string | Error) { this.addMessage(MessageLevel.warning, short_description, details); }

  /**
   * Adds a new error message.
   * @param {string} short_description - The short description of the message.
   * @param {string | Error} [details] - The optional message details.
   * @memberof MessageService
   */
  addError(short_description: string, details?: string | Error) { this.addMessage(MessageLevel.error, short_description, details); }

  /**
   * Adds a new critical error message.
   * @param {string} short_description - The short description of the message.
   * @param {string | Error} [details] - The optional message details.
   * @memberof MessageService
   */
  addCritical(short_description: string, details?: string | Error) { this.addMessage(MessageLevel.critical, short_description, details); }

  /**
   * Clears all application messages.
   * @memberof MessageService
   */
  clear() {
    if (this._allMessages.length > 0)
    {
      if (this.messages.length > 0)
        this.messages = [];
      this._allMessages = [];
    }
  }
}
