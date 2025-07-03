import Mailjs from "@cemalgnlts/mailjs";

const mailjs = new Mailjs();
let username = "<empty>";

console.log("[1/4] An account is being created...");

// Create a random account.
const acc = await mailjs.createOneAccount();
if (!acc.status) throw res.message;

username = acc.data.username;

mailjs.on("open", onOpen);
mailjs.on("arrive", onNewMessage);

function onOpen() {
  console.log("[2/4]", "A new mail is expected to arrive.");
  console.log("[2/4]", "Go to this site: https://sendtestemail.com/ type this address:", username);
}

// It is triggered when a new mail arrives.
function onNewMessage(msg) {
  console.log("[3/4]", "A new message has been received:");
  console.log(msg);

  // Stop listening.
  mailjs.off();

  // The created account is no longer needed.
  mailjs.deleteMe()
    .then(res => {
      if (!res.status) throw res.message;

      console.log("[4/4]", "Created account deleted.");
    });
}