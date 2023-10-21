import EventSource from 'eventsource';

class Mailjs {
    events;
    baseUrl;
    baseMercure;
    listener;
    token;
    id;
    address;
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
    register(address, password) {
        const data = {
            address,
            password,
        };
        return this._send("/accounts", "POST", data);
    }
    /** Get an Account resource by its id. */
    async login(address, password) {
        const data = {
            address,
            password,
        };
        const res = await this._send("/token", "POST", data);
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
            return res;
        this.id = res.data.id;
        this.address = res.data.address;
        return res;
    }
    /** Retrieves a Account resource. */
    me() {
        return this._send("/me");
    }
    /** Retrieves a Account resource. */
    getAccount(accountId) {
        return this._send("/accounts/" + accountId);
    }
    /** Deletes the Account resource. */
    deleteAccount(accountId) {
        this.off();
        return this._send("/accounts/" + accountId, "DELETE");
    }
    /** Deletes the logged in account. */
    deleteMe() {
        return this.deleteAccount(this.id);
    }
    // Domain
    /** Returns a list of domains. */
    getDomains() {
        return this._send("/domains?page=1");
    }
    /** Retrieve a domain by its id. */
    getDomain(domainId) {
        return this._send("/domains/" + domainId);
    }
    // Message
    /** Gets all the Message resources of a given page. */
    getMessages(page = 1) {
        return this._send(`/messages?page=${page}`);
    }
    /** Retrieves a Message resource with a specific id */
    getMessage(messageId) {
        return this._send("/messages/" + messageId);
    }
    /** Deletes the Message resource. */
    deleteMessage(messageId) {
        return this._send("/messages/" + messageId, "DELETE");
    }
    /** Sets a message as readed or unreaded. */
    setMessageSeen(messageId, seen = true) {
        return this._send("/messages/" + messageId, "PATCH", { seen });
    }
    // Source
    /** Gets a Message's Source resource */
    getSource(sourceId) {
        return this._send("/sources/" + sourceId);
    }
    // Events
    /** Open an event listener to messages and error */
    on(event, callback) {
        if (!EventSource) {
            console.error("EventSourcePolyfill is required for this feature. https://github.com/cemalgnlts/Mailjs/#quickstart");
            return;
        }
        // Checking if valid events.
        if (!["seen", "delete", "arrive", "error", "open"].includes(event)) {
            console.error("Unknown event name:", event);
            return;
        }
        if (!this.listener) {
            this.listener = new EventSource(`${this.baseMercure}?topic=/accounts/${this.id}`, {
                headers: { "Authorization": `Bearer ${this.token}` }
            });
            this.events = {
                arrive: () => { },
                seen: () => { },
                delete: () => { },
                error: () => { }
            };
            const onMessage = (msg) => {
                let data = JSON.parse(msg.data);
                // We don't want account details.
                if (data["@type"] === "Account")
                    return;
                let eventType = "arrive";
                if (data.isDeleted)
                    eventType = "delete";
                else if (data.seen)
                    eventType = "seen";
                this.events[eventType](data);
            };
            const onError = (err) => {
                this.events["error"](err);
            };
            this.listener.onmessage = onMessage;
            this.listener.onerror = onError;
            if (event === "open")
                this.listener.onopen = callback;
        }
        if (event !== "open")
            this.events[event] = callback;
    }
    /** Clears the events and safely closes event listener. */
    off() {
        if (this.listener)
            this.listener.close();
        this.events = {};
        this.listener = null;
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
        const username = `${this._makeHash(5)}@${domain}`;
        // 3) Generate a password and register.
        const password = this._makeHash(8);
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
            message: "ok",
            data: {
                username,
                password,
            },
        };
    }
    /** @private */
    _makeHash(size) {
        const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
        const select = () => charset.charAt(Math.floor(Math.random() * charset.length));
        return Array.from({ length: size }, select).join("");
    }
    /** @private */
    async _send(path, method = "GET", body) {
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
        const res = await fetch(this.baseUrl + path, options);
        let data;
        const contentType = res.headers.get("content-type");
        if (contentType?.startsWith("application/json"))
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

export { Mailjs as default };
