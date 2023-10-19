import Mailjs from "./dist/mail.mjs";

const mailjs = new Mailjs();
const acc = await mailjs.createOneAccount();
const lgn = await mailjs.login("", "");
lgn.