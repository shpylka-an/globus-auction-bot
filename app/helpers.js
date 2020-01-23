const moment = require('moment');
const axios = require('axios').default;
const chalk = require('chalk');

async function getWebSocketDebuggerUrl() {
  try {
    let response = await axios.get('http://127.0.0.1:9222/json/version');
    return response.data.webSocketDebuggerUrl;
  } catch (e) {
    console.log(chalk.red('Can\'t connect to browser, please open Google Chrome with --remote-debugging-port=9222'));
    process.exit()
  }
}

function calcTimeDiffToNow(dateStr) {
  const now = moment();
  const date = moment(dateStr, 'YYYY-MM-DD HH:mm:ss');

  return now.diff(date, 'days', true);
}

module.exports = {
  getWebSocketDebuggerUrl,
  calcTimeDiffToNow
};
