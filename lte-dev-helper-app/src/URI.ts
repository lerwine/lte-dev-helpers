import { UriQueryParameters } from './UriQueryParameters';

export class UriUserInfo {
  private static _componentRe: RegExp = /^[^@:/?#]+$/;

  // #region username Property
  
  private _username: string = "";
  
  /**
   * Gets or sets the username.
   * @type {string}
   * @memberof UriUserInfo
   * @public
   */
  public get username(): string { return this._username; }
  
  /** @type {string} */
  public set username(value: string) {
    if ((typeof value !== 'string'))
      value = '' + value;
    if (value.length > 0 && !UriUserInfo._componentRe.test(value))
      throw new Error("Invalid username value");
    this._username = value;
  }
  
  // #endregion

  // #region password Property
  
  private _password?: string;
  
  /**
   * Gets or sets the password.
   * @type {(string | undefined)}
   * @memberof UriUserInfo
   * @public
   */
  public get password(): string | undefined { return this._password; }
  
  /** @type {(string | undefined)} */
  public set password(value: string | undefined) {
    if (typeof value !== 'string') {
      if (typeof value === 'undefined' || value === null) {
        this._password = undefined;
        return;
      }
      value = '' + value;
    }
    if (value.length > 0 && !UriUserInfo._componentRe.test(value))
      throw new Error("Invalid password value");
    this._password = value;
  }
  
  // #endregion

  constructor(username: string, password?: string) {
    if ((typeof username !== 'string'))
      username = '' + username;
    if (username.length > 0 && !UriUserInfo._componentRe.test(username))
      throw new Error("Invalid username value");
    this._username = username;
    if (typeof password !== 'string') {
      if (typeof password === 'undefined' || password === null) {
        this._password = undefined;
        return;
      }
      password = '' + password;
    }
    if (password.length > 0 && !UriUserInfo._componentRe.test(password))
      throw new Error("Invalid password value");
    this._password = password;
  }
}

export class UriAuthority {
  private static _componentRe: RegExp = /^[^@:/?#]+$/;

  // #region userInfo Property
  
  private _userInfo?: UriUserInfo;
  
  /**
   * Gets or sets the password.
   * @type {(UriUserInfo | undefined)}
   * @memberof UriAuthority
   * @public
   */
  public get userInfo(): UriUserInfo | undefined { return this._userInfo; }
  
  /** @type {(UriUserInfo | undefined)} */
  public set userInfo(value: UriUserInfo | undefined) {
    this._userInfo = (typeof value === 'object' && value !== null && value instanceof UriUserInfo) ? value : undefined;
  }
  
  // #endregion

  // #region host Property
  
  private _host: string;
  
  /**
   * Gets or sets the host name.
   * @type {string}
   * @memberof UriAuthority
   * @public
   */
  public get host(): string { return this._host; }
  
  /** @type {string} */
  public set host(value: string) {
    if ((typeof value !== 'string'))
      value = '' + value;
    if (value.length > 0 && !UriAuthority._componentRe.test(value))
      throw new Error("Invalid host name value");
    this._host = value;
  }
  
  // #endregion
  
  // #region portString Property
  
  private _portString?: string;
  
  /**
   * Gets .
   * @type {string | undefined}
   * @memberof UriAuthority
   * @public
   */
  public get portString(): string | undefined { return this._portString; }
  
  // #endregion
  // #region port Property
  
  private _port?: number;
  
  /**
   * Gets or sets the password.
   * @type {(number | undefined)}
   * @memberof UriAuthority
   * @public
   */
  public get port(): number | undefined { return this._port; }
  
  /** @type {(number | undefined)} */
  public set port(value: number | undefined) {
    if (typeof value === 'number' && !isNaN(value)) {
      if (value !== this._port)
        this._portString = (this._port = value).toString();
    } else if (typeof this._port !== 'undefined') {
      this._portString = undefined;
      this._port = undefined;
    }
  }
  
  // #endregion

  constructor(host: string, port?: string | number, userInfo?: UriUserInfo) {
    if ((typeof host !== 'string'))
    host = '' + host;
    if (host.length > 0 && !UriAuthority._componentRe.test(host))
      throw new Error("Invalid host name value");
    this._host = host;
    if (typeof port === 'string') {
      this._portString = port
      var p = parseInt(port);
      if (!isNaN(p))
        this.port = p;
    } else if (typeof port === 'number' && !isNaN(port))
      this.port = port;
    if (typeof userInfo === 'object' && userInfo !== null && userInfo instanceof UriUserInfo)
      this.userInfo = userInfo;
  }
}


export class URI {
  private static _uriRe: RegExp = /^(?:(?:([^:@/%?#]+):(\/\/?)?)?(?:([^@:/?#]*)(?::([^@:/?#]*))?@)?(?:([^@:/?#]+)(?::(\d+))?)?)?([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/;
  private static _schemeRe: RegExp = /^[^:@/%?#]+$/;
  private static _separatorRe: RegExp = /^\/\/?$/;
  private static _pathRe: RegExp = /^[^?#]+$/;

  // #region scheme Property
  
  private _scheme: string;
  
  /**
   * Gets or sets the host name.
   * @type {string}
   * @memberof URI
   * @public
   */
  public get scheme(): string { return this._scheme; }
  
  /** @type {string} */
  public set scheme(value: string) {
    if ((typeof value !== 'string'))
      value = '' + value;
    if (value.length > 0 && !URI._schemeRe.test(value))
      throw new Error("Invalid scheme name value");
    this._scheme = value;
  }
  
  // #endregion

  // #region separator Property
  
  private _separator?: string;
  
  /**
   * Gets or sets the password.
   * @type {(string | undefined)}
   * @memberof URI
   * @public
   */
  public get separator(): string | undefined { return this._separator; }
  
  /** @type {(string | undefined)} */
  public set separator(value: string | undefined) {
    if (typeof value !== 'string') {
      if (typeof value === 'undefined' || value === null) {
        this._separator = undefined;
        return;
      }
      value = '' + value;
    }
    if (value.length > 0 && !URI._separatorRe.test(value))
      throw new Error("Invalid separator value");
    this._separator = value;
  }
  
  // #endregion

  // #region authority Property
  
  private _authority?: UriAuthority;
  
  /**
   * Gets or sets the authority.
   * @type {(UriAuthority | undefined)}
   * @memberof URI
   * @public
   */
  public get authority(): UriAuthority | undefined { return this._authority; }
  
  /** @type {(UriAuthority | undefined)} */
  public set authority(value: UriAuthority | undefined) {
    this._authority = (typeof value === 'object' && value !== null && value instanceof UriAuthority) ? value : undefined;
  }
  
  // #endregion

  // #region path Property
  
  private _path: string;
  
  /**
   * Gets or sets the host name.
   * @type {string}
   * @memberof URI
   * @public
   */
  public get path(): string { return this._path; }
  
  /** @type {string} */
  public set path(value: string) {
    if ((typeof value !== 'string'))
      value = '' + value;
    if (value.length > 0 && !URI._pathRe.test(value))
      throw new Error("Invalid path value");
    this._path = value;
  }
  
  // #endregion

  // #region query Property
  
  private _query?: UriQueryParameters;
  
  /**
   * Gets or sets the authority.
   * @type {(UriQueryParameters | undefined)}
   * @memberof URI
   * @public
   */
  public get query(): UriQueryParameters | undefined { return this._query; }
  
  /** @type {(UriQueryParameters | undefined)} */
  public set query(value: UriQueryParameters | undefined) {
    this._query = (typeof value === 'object' && value !== null && value instanceof UriQueryParameters) ? value : undefined;
  }

  // #endregion

  // #region fragment Property
  
  private _fragment?: string;
  
  /**
   * Gets or sets the password.
   * @type {(string | undefined)}
   * @memberof URI
   * @public
   */
  public get fragment(): string | undefined { return this._fragment; }
  
  /** @type {(string | undefined)} */
  public set fragment(value: string | undefined) {
    if (typeof value !== 'string')
      this._fragment = (typeof value === 'undefined' || value === null)  ? undefined : '' + value;
    else
      this.fragment = value;
  }
  
  // #endregion
  
  constructor(url: URL | string | URI) {
    if (typeof url === 'object') {
      if (url === null)
        url = "";
      else {
        if (url instanceof URI) {
          this._scheme = url.scheme;
          this._separator = url._separator;
          if (typeof url._authority !== 'undefined')
            this._authority = new UriAuthority(url._authority.host, url._authority.port, (typeof url._authority.userInfo === 'undefined') ? undefined : new UriUserInfo(url._authority.userInfo.username, url._authority.userInfo.password));
          this._path = url._path;
          this._query = (typeof url._query === 'undefined') ? undefined : new UriQueryParameters(url._query);
          this._fragment = url._fragment;
          return;
        }
        url = '' + url;
      }
    } else if (typeof url !== 'string')
      url = '' + url;
    if (url.length > 0) {
      var m = URI._uriRe.exec(url);
      if (m === null) {
        this._path = url;
        this._scheme = "";
      } else {
        this._scheme = (typeof m[1] === 'string') ? m[1] : '';
        if (typeof m[2] === 'string')
          this._separator = m[2];
        if (typeof m[5] === 'string')
          this._authority = new UriAuthority(m[5], m[6], (typeof m[3] === 'string') ? new UriUserInfo(m[3], m[4]) : undefined);
          this._path = m[7];
          if (typeof m[8] === 'string')
            this._query = UriQueryParameters.parse(m[8]);
          if (typeof m[9] === 'string')
            this._fragment = m[9];
      }
      return;
    }
    this._scheme = this._path = "";
  }
}
