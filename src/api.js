const API_KEY =
  "bbb253ca77586e7f3446f77050df127e8ebf0eca7bb8a3401f9013e446c00e45";

const tickersHandlers = new Map();

//TODO: refactor to use URLSearchParams
const loadTickers = () => {
  if (tickersHandlers.size === 0) {
    return;
  }

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys(),
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((r) => r.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach((fn) => fn(newPrice));
      });
    });
};
export const subscribeToTickers = (ticker, cb) => {
  const subsribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subsribers, cb]);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
};

setInterval(() => {
  loadTickers();
}, 5000);
