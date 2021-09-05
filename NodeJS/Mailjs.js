/**
 * Mailjs Class
 * V1 - 18 MAY 2021
 * https://mail.tm/
 * A JavaScript class around the mail.tm web api.
 * https://github.com/cemalgnlts/Mailjs
 */
const fetch = require("node-fetch")

class Mailjs 
{
    /** @constructor */
    constructor() {
        /** @private */
        this.baseUrl = "https://api.mail.tm";
        this.token = "";
        this.id = "";
        this.address = "";
    }

    /***** Account *****/

    /**
     * Creates a Account resource.
     * @param {String} address 
     * @param {String} password 
     * @returns 
     */
    async register(address, password) {
        const data = {
            address,
            password
        };

        return this.send_("/accounts", "POST", data);
    }

    /**
     * Login a Account.
     * @param {String} address 
     * @param {String} password 
     * @returns
     */
    async login(address, password) {
        const data = {
            address,
            password
        };

        const res = await this.send_("/token", "POST", data);

        if (res.status) {
            this.token = res.data.token;
            this.id = res.data.id;
        }

        return res;
    }

    /**
     * Retrieves a Account resource.
     * @returns 
     */
    async me() {
        return this.send_("/me");
    }

    /**
     * Retrieves a Account resource.
     * @param {String} accountId Resource identifier
     * @returns 
     */
     async getAccount(accountId) {
        return this.send_("/accounts/" + accountId);
    }

    /**
     * Deletes the Account resource.
     * @param {String} accountId Resource identifier
     */
    async deleteAccount(accountId) {
        return this.send_("/accounts/" + accountId, "DELETE");
    }

    /**
     * Deletes the logged in account.
     * @param {String} accountId Resource identifier
     */
     async deleteMe() {
        return this.deleteAccount(this.id);
    }

    /***** Domain *****/

    /**
     * Retrieves the collection of Domain resources.
     * @returns 
     */
    async getDomains() {
        return this.send_("/domains?page=1");
    }

    /**
     * Retrieves a Domain resource.
     * @param {String} domainId Resource identifier
     * @returns 
     */
    async getDomain(domainId) {
        return this.send_("/domains/" + domainId)
    }

    /***** Message *****/

    /**
     * Retrieves the collection of Message resources.
     * @param {Number} page The collection page number (Default: 1)
     * @returns 
     */
    async getMessages(page = 1) {
        return this.send_(`/messages?page=${page}`);
    }

    /**
     * Retrieves a Message resource.
     * @param {String} messageId Resource identifier
     * @returns 
     */
    async getMessage(messageId) {
        return this.send_("/messages/" + messageId);
    }

    /**
     * Removes the Message resource.
     * @param {String} messageId Resource identifier
     */
    async deleteMessage(messageId) {
        return this.send_("/messages/" + messageId, "DELETE");
    }

    /**
     * Sets a message as read or unread.
     * @param {String} messageId Resource identifier
     * @param {Boolean} seen Default true
     */
    async setMessageSeen(messageId, seen = true) {
        return this.send_("/messages/" + messageId, "PATCH", { seen })
    }

    /***** Source *****/

    /**
     * Retrieves a Source resource.
     * @param {String} sourceId Resource identifier
     */
    async getSource(sourceId) {
        return this.send_("/sources/" + sourceId);
    }
    
    /***** Helper *****/
    
    async createOneAccount() {
        // First create a name.
        let name = this.makeHash_(5);
        
        // Second get a domain name.
        let domain = await this.getDomains();
        if(!domain.status)
            return domain;
        else
            domain = domain.data[0].domain;
        
        const username = `${name}@${domain}`;
        
        // Third generate a password and register.
        const password = this.makeHash_(8);
        let registerRes = await this.register(username, password);
        if(!registerRes.status)
            return registerRes;
        else
            registerRes = registerRes.data;
        
        // Fourth login.
        let loginRes = await this.login(username, password);
        if(!loginRes.status)
            return loginRes;
        else
            loginRes = loginRes.data;
        
        return {
            status: true,
            data: {
                username,
                password
            }
        }
    }
    
    /**
     * https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/14944262#14944262
     * @param {Number} size Hash size.
     * @private
     */
    makeHash_(size) {
        return Array.apply(0, Array(size))
            .map(function () {
                return (function (charset) {
                    return charset.charAt(Math.floor(Math.random() * charset.length));
                })("abcdefghijklmnopqrstuvwxyz0123456789");
            })
            .join("");
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
            const contentType = method === "PATCH" ? "merge-patch+json" : "json";
            options.headers["content-type"] = `application/${contentType}`;
            options.body = JSON.stringify(body);
        }

        const res = await fetch(this.baseUrl + path, options);
        let data;

        const contentType = res.headers.get("content-type");

        if (contentType && contentType.startsWith("application/json"))
            data = await res.json();
        else
            data = await res.text();

        return {
            status: res.ok,
            message: res.ok ? "ok" : data.message,
            data: data
        };
    }
}

module.exports = Mailjs;
