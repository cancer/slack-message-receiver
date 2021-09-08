import app from "polka";
import WebSocket from "websocket";

const CHANNEL = "C360N1AH2";

let socket = null;
const connect = () => {
  if (socket !== null) Promise.resolve(socket);
  return new Promise((resolve) => {
    const client = new WebSocket.w3cwebsocket('ws://localhost:50002/');
    client.onopen = () => {
      socket = client;
      resolve(socket);
    };
  });
}

const jsonParser = (req, res, next) => {
  let data = "";
  req.on("data", (chunk) => data += chunk);
  req.on("end", () => {
    req.body = JSON.parse(data)
    next();
  })
};

const speak = (client, text) => {
  const opts = [100, 100, 100, 0];
  // 棒読みちゃんプラグインのデリミタ
  const delimiter = "<bouyomi>" 
  
  client.send([...opts, text].join(delimiter));
}

app().use(jsonParser).post("/", async (req, res) => {
  if (req.body.challenge !== undefined) return res.end(req.body.challenge);

  const {event} = req.body;
  const [_, __, ...params] = process.argv;
  const verbose = params.includes("--verbose");

  if (event.channel !== CHANNEL) {
    if (verbose) console.log("(Message is not in specific channel.)")
    return res.end("ok");
  }

  if (verbose) console.log(`[${event.type}]`, event.text);
  speak(await connect(), event.text);
  res.end("ok");
}).listen(8787)
