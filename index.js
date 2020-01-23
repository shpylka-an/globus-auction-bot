const config = require('config');
const { connectToBrowser, openPage } = require('./app/browser');
const { handleBid, onLotsUpdated } = require('./app/auction');
const { calcTimeDiffToNow, getWebSocketDebuggerUrl } = require('./app/helpers');

async function main() {
  try {
    const WEB_SOCKET_DEBUGGER_URL = await getWebSocketDebuggerUrl();

    const browser = await connectToBrowser(WEB_SOCKET_DEBUGGER_URL);
    const page = await openPage(browser, config.get('globus.auctionPageUrl'));

    onLotsUpdated(page, async (lots, balance) => {
        try {
          lots = lots
            .filter(lot => calcTimeDiffToNow(lot.lot_user_datetime_reg) > config.get('globus.minDaysAgoRegistered'))
            .filter(lot => calcTimeDiffToNow(lot.lot_user_datetime_act) < config.get('globus.maxDaysAgoWasActive'))
            .filter(lot => lot.bid_amount < config.get('globus.maxBid') && lot.bid_amount < balance)
            .filter(lot => !config.get('globus.ignoreBidders').includes(lot.bidder_name))
            .sort((a, b) => a.bid_timespan - b.bid_timespan);
        } catch (e) {}

        if (lots && lots[0]) {
          setTimeout(async () => {
            await handleBid(page, lots[0].lot_user_id, balance);
          }, 2500)
        }
    });

  } catch (err) {
    console.log(err)
  }
}

main();
