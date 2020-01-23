const cheerio = require('cheerio');
const moment = require('moment');
const config = require('config');
const chalk = require('chalk');

function onLotsUpdated(auctionPage, callback) {
  auctionPage.on('response', async (response) => {
    try {
      if (response.url() === config.get('globus.getAuctionAjaxUrl')) {
        const {d: data, b: balance} = await response.json();
        callback(data, balance);
      }
    } catch (err) {
      throw err;
    }
  });
}

async function handleBid(page, lotId, balance) {
  try {
    let bodyHTML = await page.evaluate(() => document.body.innerHTML);
    const $ = cheerio.load(bodyHTML);

    const currency = $(`#last_bid_${lotId} span.currency.brand-color-text.strong`).text();

    if (balance > (parseFloat(currency) + 0.1)) {
      await page.click(`#cart_${lotId}`, {delay: 20});
      console.log(chalk.green(`Clicked on user ${chalk.blue(lotId)} ${moment().toString()}`));
    }
  } catch (err) {
    console.log(err);
  }
}

async function markLotRed(page, lotId) {
  try {
    await page.$eval(`#lot_${lotId}`, el => {
      el.setAttribute('style', 'border-left: 3px solid red');
    });
  } catch (err) {
    throw err;
  }
}

module.exports = {
  onLotsUpdated,
  handleBid,
  markLotRed
};
