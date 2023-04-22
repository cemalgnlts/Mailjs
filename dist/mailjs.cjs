'use strict';

var fetch = require('node-fetch');
var EventSource = require('eventsource');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);
var EventSource__default = /*#__PURE__*/_interopDefaultLegacy(EventSource);

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
            password,
        };
        return this.send_("/accounts", "POST", data);
    }
    /** Get an Account resource by its id. */
    async login(address, password) {
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
        // Checking if valid events 
        if (!allowedEvents.includes(event)) {
            return;
        }
        if (!this.listener) {
            this.listener = new EventSource__default["default"](`${this.baseMercure}?topic=/accounts/${this.id}`, {
                headers: {
                    "Authorization": `Bearer ${this.token}`,
                }
            });
            for (let i = 0; i < 3; i++) {
                this.events[allowedEvents[i]] = (_data) => { };
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
        // 1) Get a domain name.
        let domain = await this.getDomains();
        if (!domain.status)
            return domain;
        else
            domain = domain.data[0].domain;
        // 2) Generate a username (test@domain.com).
        const username = `${this.makeHash_(5)}@${domain}`;
        // 3) Generate a password and register.
        const password = this.makeHash_(8);
        let registerRes = await this.register(username, password);
        if (!registerRes.status)
            return registerRes;
        else
            registerRes = registerRes.data;
        // 4) Login.
        let loginRes = await this.login(username, password);
        if (!loginRes.status)
            return loginRes;
        else
            loginRes = loginRes.data;
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
    makeHash_(size) {
        return Array.from({ length: size }, () => (function (charset) {
            return charset.charAt(Math.floor(Math.random() * charset.length));
        })("abcdefghijklmnopqrstuvwxyz0123456789")).join("");
    }
    /** @private */
    async send_(path, method = "GET", body) {
        const options = {
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
        const res = await fetch__default["default"](this.baseUrl + path, options);
        let data;
        const contentType = res.headers.get("content-type");
        if (contentType === null || contentType === void 0 ? void 0 : contentType.startsWith("application/json"))
            data = await res.json();
        else
            data = await res.text();
        return {
            status: res.ok,
            message: res.ok ? "ok" : data.message || data.detail,
            data: data,
        };
    }
}

module.exports = Mailjs;
