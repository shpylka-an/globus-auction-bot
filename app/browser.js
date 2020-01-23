const puppeteer = require('puppeteer');
const config = require('config');

async function connectToBrowser(wsChromeEndpointUrl) {
  try {
    return await puppeteer.connect({
      browserWSEndpoint: wsChromeEndpointUrl,
    });
  } catch (err) {
    throw err;
  }
}

async function openPage(browser, url) {
  try {
    const pages = await browser.pages();
    let page = pages.find(page => page.url() === url);

    if (page === undefined) {
      page = await browser.newPage();

      await page.setViewport({
        width: config.get('browser.viewport.width'),
        height: config.get('browser.viewport.height')
      });

      await page.goto(url);
    }

    return page;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  connectToBrowser,
  openPage
};
