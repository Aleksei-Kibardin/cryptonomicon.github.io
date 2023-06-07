const API_KEY =
  "bbb253ca77586e7f3446f77050df127e8ebf0eca7bb8a3401f9013e446c00e45";

let tickersHandlers = new Map();

const bc = new BroadcastChannel("bc-api");

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const AGGREGATE_INDEX = "5";

bc.addEventListener("message", (e) => {
  tickersHandlers = e.data;
  console.log(tickersHandlers);
});

socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
  } = JSON.parse(e.data);
  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }
  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice, type));
});

//TODO: refactor to use URLSearchParams
function sendToWs(message) {
  const stringifyMassage = JSON.stringify(message);
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifyMassage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifyMassage);
    },
    { once: true }
  );
}

function subscribeToTickersOnWs(ticker) {
  sendToWs({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

function unsubscribeFromTickersOnWs(ticker) {
  sendToWs({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

export const subscribeToTickers = (ticker, cb) => {
  console.log(tickersHandlers);
  const subsribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subsribers, cb]);
  subscribeToTickersOnWs(ticker);
  console.log(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickersOnWs(ticker);
};

export function Broadcast() {
  bc.postMessage(tickersHandlers);
}
