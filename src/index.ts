import fetch from "node-fetch";
import EventSource from "eventsource";
import type * as type from "./types";

class Mailjs {
  private events: object;
  private baseUrl: string;
  private baseMercure: string;
  private listener: any;
  private token: string;
  id: string;
  address: string;

  constructor() {
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
  register(address: string, password: string): type.RegisterResult {
    const data = {
      address,
      password,
    };

    return this.send_("/accounts", "POST", data);
  }

  /** Get an Account resource by its id. */
  async login(address: string, password: string): type.LoginResult {
    const data = {
      address,
      password,
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
  async loginWithToken(token: string): type.AccountResult {
    this.token = token;

    const res = await this.me();

    if (!res.status) throw new Error(res.message);

    this.id = res.data.id;
    this.address = res.data.address;

    return res;
  }

  /** Retrieves a Account resource. */
  me(): type.AccountResult {
    return this.send_("/me");
  }

  /** Retrieves a Account resource. */
  getAccount(accountId: string): type.AccountResult {
    return this.send_("/accounts/" + accountId);
  }

  /** Deletes the Account resource. */
  deleteAccount(accountId: string): type.DeleteResult {
    return this.send_("/accounts/" + accountId, "DELETE");
  }

  /** Deletes the logged in account. */
  deleteMe(): type.DeleteResult {
    return this.deleteAccount(this.id);
  }

  // Domain

  /** Returns a list of domains. */
  getDomains(): type.DomainListResult {
    return this.send_("/domains?page=1");
  }

  /** Retrieve a domain by its id. */
  getDomain(domainId: string): type.DomainResult {
    return this.send_("/domains/" + domainId);
  }

  // Message

  /** open an eventlistener to messages and error */
  on(event:string , callback: type.MessageCallback | type.EmptyCallback | type.ErrorCallback){

    const allowedEvents = ["seen" , "delete" , "arrive" , "error" , "ready"];
    // Checking if valid events 
    if(!allowedEvents.includes(event)){
      return;
    }

    if(!this.listener){
      this.listener = new EventSource(`${this.baseMercure}?topic=/accounts/${this.id}` , {
        headers : {
          "Authorization" : `Bearer ${this.token}`,
        }
      });
      
      for(let i=0;i<3;i++){
        this.events[allowedEvents[i]] = (_data)=>{};
      }
      this.listener.on("message" , this.callback_);
    }

    if(event==="error" || event==="ready"){

      if(event==="ready"){
        event = "open"
      }

      this.listener.on(event , callback);
      return;
    }

    this.events[event] = callback;
  }

  /** Clears the events and safely closes eventlistener */
  close(){
    this.events = {};
    this.listener.close();
    this.listener = null;
  }


  /** Gets all the Message resources of a given page. */
  getMessages(page = 1): type.MessageListResult {
    return this.send_(`/messages?page=${page}`);
  }

  /** Retrieves a Message resource with a specific id */
  getMessage(messageId: string): type.MessageResult {
    return this.send_("/messages/" + messageId);
  }

  /** Deletes the Message resource. */
  deleteMessage(messageId: string): type.DeleteResult {
    return this.send_("/messages/" + messageId, "DELETE");
  }

  /** Sets a message as readed or unreaded. */
  setMessageSeen(messageId: string, seen = true): type.MessageResult {
    return this.send_("/messages/" + messageId, "PATCH", { seen });
  }

  // Source

  /** Gets a Message's Source resource */
  getSource(sourceId: string): type.SourceResult {
    return this.send_("/sources/" + sourceId);
  }

  // Helper

  /** Create random account. */
  async createOneAccount(): type.CreateOneAccountResult {
    // 1) Get a domain name.
    let domain: any = await this.getDomains();
    if (!domain.status) return domain;
    else domain = domain.data[0].domain;

    // 2) Generate a username (test@domain.com).
    const username = `${this.makeHash_(5)}@${domain}`;

    // 3) Generate a password and register.
    const password = this.makeHash_(8);
    let registerRes: any = await this.register(username, password);
    if (!registerRes.status) return registerRes;
    else registerRes = registerRes.data;

    // 4) Login.
    let loginRes: any = await this.login(username, password);
    if (!loginRes.status) return loginRes;
    else loginRes = loginRes.data;

    return {
      status: true,
      data: {
        username,
        password,
      },
    };
  }

  /**
   * https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/14944262#14944262
   * @private
   */
  makeHash_(size: number) {
    return Array.from({ length: size }, () =>
      (function (charset) {
        return charset.charAt(Math.floor(Math.random() * charset.length));
      })("abcdefghijklmnopqrstuvwxyz0123456789")
    ).join("");
  }

  /** @private */
  async send_(
    path: string,
    method: type.Methods = "GET",
    body?: object
  ): type.PromiseResult<any> {
    const options: type.IRequestObject = {
      method,
      headers: {
        accept: "application/json",
        authorization: `Bearer ${this.token}`,
      },
    };

    if (method === "POST" || method === "PATCH") {
      const contentType = method === "PATCH" ? "merge-patch+json" : "json";
      options.headers["content-type"] = `application/${contentType}`;
      options.body = JSON.stringify(body);
    }

    const res: Response = await fetch(this.baseUrl + path, options);
    let data: any;

    const contentType = res.headers.get("content-type");

    if (contentType?.startsWith("application/json")) data = await res.json();
    else data = await res.text();

    return {
      status: res.ok,
      message: res.ok ? "ok" : data.message || data.detail,
      data: data,
    };
  }

  /** @private */
  callback_ = (raw:any) => {

    let data = JSON.parse(raw.data);

    if(data.isDeleted){
      this.events["delete"](data);
      return;
    }

    if(data.seen){
      this.events["seen"](data);
      return;
    }

    this.events["arrive"](data);
  }

}


export default Mailjs;
