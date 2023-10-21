import test from "node:test";
import Mailjs from "./dist/mailjs.mjs";

const mailjs = new Mailjs();

test("Get a domain, create an account and log in.", async () => {
    const { status, message } = await mailjs.createOneAccount();

    if (!status) throw message;
});

test("Get account data.", async () => {
    const { status, message } = await mailjs.me();

    if (!status) throw message;
});

test("List messages.", async () => {
    const { status, message } = await mailjs.getMessages();

    if (!status) throw message;
});

test("Log in with JWT token.", async () => {
    const token = mailjs.token;

    const { status, message } = await mailjs.loginWithToken(token);

    if(!status) throw message;
});

test("Test listener.", (_, done) => {
    const onOpen = () => {
        mailjs.off();
        done();
    };

    const onError = err => done(err);

    mailjs.on("open", onOpen);
    mailjs.on("error", onError);
});

test("Delete account.", async () => {
    const { status, message } = await mailjs.deleteMe();

    if (!status) throw message;
});