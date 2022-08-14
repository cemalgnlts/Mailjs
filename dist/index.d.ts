import type * as type from "./types";
declare class Mailjs {
    private baseUrl;
    private token;
    id: string;
    address: string;
    constructor();
    /** Creates an Account resource. */
    register(address: string, password: string): type.RegisterResult;
    /** Get an Account resource by its id. */
    login(address: string, password: string): type.LoginResult;
    /** Login with user JWT token */
    loginWithToken(token: string): type.AccountResult;
    /** Retrieves a Account resource. */
    me(): type.AccountResult;
    /** Retrieves a Account resource. */
    getAccount(accountId: string): type.AccountResult;
    /** Deletes the Account resource. */
    deleteAccount(accountId: string): type.DeleteResult;
    /** Deletes the logged in account. */
    deleteMe(): type.DeleteResult;
    /** Returns a list of domains. */
    getDomains(): type.DomainListResult;
    /** Retrieve a domain by its id. */
    getDomain(domainId: string): type.DomainResult;
    /** Gets all the Message resources of a given page. */
    getMessages(page?: number): type.MessageListResult;
    /** Retrieves a Message resource with a specific id */
    getMessage(messageId: string): type.MessageResult;
    /** Deletes the Message resource. */
    deleteMessage(messageId: string): type.DeleteResult;
    /** Sets a message as readed or unreaded. */
    setMessageSeen(messageId: string, seen?: boolean): type.MessageResult;
    /** Gets a Message's Source resource */
    getSource(sourceId: string): type.SourceResult;
    /** Create random account. */
    createOneAccount(): type.CreateOneAccoutResult;
    /**
     * https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/14944262#14944262
     * @private
     */
    makeHash_(size: number): string;
    /** @private */
    send_(path: string, method?: type.Methods, body?: object): type.PromiseResult<any>;
}
export default Mailjs;
