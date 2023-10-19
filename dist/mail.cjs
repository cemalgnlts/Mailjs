var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_node_fetch = __toESM(require("node-fetch"), 1);
var import_eventsource = __toESM(require("eventsource"), 1);
class Mailjs {
  constructor() {
    /** @private */
    this.callback_ = (raw) => {
      let data = JSON.parse(raw.data);
      if (data.isDeleted) {
        this.events["delete"](data);
        return;
      }
      if (data.seen) {
        this.events["seen"](data);
        return;
      }
      this.events["arrive"](data);
    };
    this.baseUrl = "https://api.mail.tm";
    this.baseMercure = "https://mercure.mail.tm/.well-known/mercure";
    this.listener = null;
    this.events = {};
    this.token = "";
    this.id = "";
    this.address = "";
  }
  // Account
  /** Creates an Account resource. */
  register(address, password) {
    const data = {
      address,
      password
    };
    return this.send_("/accounts", "POST", data);
  }
  /** Get an Account resource by its id. */
  async login(address, password) {
    const data = {
      address,
      password
    };
    const res = await this.send_("/token", "POST", data);
    if (res.status) {
      this.token = res.data.token;
      this.id = res.data.id;
      this.address = address;
    }
    return res;
  }
  /** Login with user JWT token */
  async loginWithToken(token) {
    this.token = token;
    const res = await this.me();
    if (!res.status)
      throw new Error(res.message);
    this.id = res.data.id;
    this.address = res.data.address;
    return res;
  }
  /** Retrieves a Account resource. */
  me() {
    return this.send_("/me");
  }
  /** Retrieves a Account resource. */
  getAccount(accountId) {
    return this.send_("/accounts/" + accountId);
  }
  /** Deletes the Account resource. */
  deleteAccount(accountId) {
    return this.send_("/accounts/" + accountId, "DELETE");
  }
  /** Deletes the logged in account. */
  deleteMe() {
    return this.deleteAccount(this.id);
  }
  // Domain
  /** Returns a list of domains. */
  getDomains() {
    return this.send_("/domains?page=1");
  }
  /** Retrieve a domain by its id. */
  getDomain(domainId) {
    return this.send_("/domains/" + domainId);
  }
  // Message
  /** open an eventlistener to messages and error */
  on(event, callback) {
    const allowedEvents = ["seen", "delete", "arrive", "error", "ready"];
    if (!allowedEvents.includes(event)) {
      return;
    }
    if (!this.listener) {
      this.listener = new import_eventsource.default(`${this.baseMercure}?topic=/accounts/${this.id}`, {
        headers: {
          "Authorization": `Bearer ${this.token}`
        }
      });
      for (let i = 0; i < 3; i++) {
        this.events[allowedEvents[i]] = (_data) => {
        };
      }
      this.listener.on("message", this.callback_);
    }
    if (event === "error" || event === "ready") {
      if (event === "ready") {
        event = "open";
      }
      this.listener.on(event, callback);
      return;
    }
    this.events[event] = callback;
  }
  /** Clears the events and safely closes eventlistener */
  close() {
    this.events = {};
    this.listener.close();
    this.listener = null;
  }
  /** Gets all the Message resources of a given page. */
  getMessages(page = 1) {
    return this.send_(`/messages?page=${page}`);
  }
  /** Retrieves a Message resource with a specific id */
  getMessage(messageId) {
    return this.send_("/messages/" + messageId);
  }
  /** Deletes the Message resource. */
  deleteMessage(messageId) {
    return this.send_("/messages/" + messageId, "DELETE");
  }
  /** Sets a message as readed or unreaded. */
  setMessageSeen(messageId, seen = true) {
    return this.send_("/messages/" + messageId, "PATCH", { seen });
  }
  // Source
  /** Gets a Message's Source resource */
  getSource(sourceId) {
    return this.send_("/sources/" + sourceId);
  }
  // Helper
  /** Create random account. */
  async createOneAccount() {
    let domain = await this.getDomains();
    if (!domain.status)
      return domain;
    else
      domain = domain.data[0].domain;
    const username = `${this.makeHash_(5)}@${domain}`;
    const password = this.makeHash_(8);
    let registerRes = await this.register(username, password);
    if (!registerRes.status)
      return registerRes;
    else
      registerRes = registerRes.data;
    let loginRes = await this.login(username, password);
    if (!loginRes.status)
      return loginRes;
    else
      loginRes = loginRes.data;
    return {
      status: true,
      data: {
        username,
        password
      }
    };
  }
  /**
   * https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/14944262#14944262
   * @private
   */
  makeHash_(size) {
    return Array.from(
      { length: size },
      () => function(charset) {
        return charset.charAt(Math.floor(Math.random() * charset.length));
      }("abcdefghijklmnopqrstuvwxyz0123456789")
    ).join("");
  }
  /** @private */
  async send_(path, method = "GET", body) {
    const options = {
      method,
      headers: {
        accept: "application/json",
        authorization: `Bearer ${this.token}`
      }
    };
    if (method === "POST" || method === "PATCH") {
      const contentType2 = method === "PATCH" ? "merge-patch+json" : "json";
      options.headers["content-type"] = `application/${contentType2}`;
      options.body = JSON.stringify(body);
    }
    const res = await (0, import_node_fetch.default)(this.baseUrl + path, options);
    let data;
    const contentType = res.headers.get("content-type");
    if (contentType?.startsWith("application/json"))
      data = await res.json();
    else
      data = await res.text();
    return {
      status: res.ok,
      message: res.ok ? "ok" : data.message || data.detail,
      data
    };
  }
}
var src_default = Mailjs;
