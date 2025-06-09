const Imap = require("node-imap");
const { simpleParser } = require("mailparser");

const imap = new Imap({
  user: "yashlalwani661@gmail.com", 
  password: "mcsvdhzhpuggnert",      
  host: "imap.gmail.com",           
  port: 993,                       
  tls: true
});

// Open inbox
function openInbox(cb) {
  imap.openBox("INBOX", true, cb); // Open in readonly mode
}

imap.once("ready", () => {
  openInbox((err, box) => {
    if (err) throw err;

    const total = box.messages.total;
    if (total === 0) {
      console.log("No emails found.");
      imap.end();
      return;
    }

    const fetchRange = `${Math.max(total - 5, 1)}:${total}`; // Last 5 emails
    const f = imap.seq.fetch(fetchRange, { bodies: "", struct: true });

    f.on("message", (msg, seqno) => {
      console.log(`\n📩 Message #${seqno}`);
      let buffer = "";

      msg.on("body", (stream) => {
        stream.on("data", (chunk) => {
          buffer += chunk.toString("utf8");
        });

        stream.once("end", async () => {
          try {
            const parsed = await simpleParser(buffer);
            console.log("From:", parsed.from?.text || "N/A");
            console.log("To:", parsed.to?.text || "N/A");
            console.log("Subject:", parsed.subject || "No subject");
            console.log("Date:", parsed.date?.toString() || "No date");
            console.log("Body Preview:", (parsed.text || "").substring(0, 200));
          } catch (err) {
            console.error("❌ Error parsing message:", err);
          }
        });
      });
    });

    f.once("error", (err) => {
      console.error("❌ Fetch error:", err);
    });

    f.once("end", () => {
      console.log("\n✅ Done fetching emails.");
      imap.end();
    });
  });
});

imap.once("error", (err) => {
  console.error("❌ Connection error:", err);
});

imap.once("end", () => {
  console.log("📴 Connection ended.");
});

imap.connect();
