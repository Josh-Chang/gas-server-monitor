const runAppFromMenu_ = () => App({ context: 'menu' });

const App = (options) => {
  try {
    let message;
    Logger = MyLogger.init();

    // open the default sheet and convert to sheet object
    const mySheet = new MySheet({ ...Settings.sheet.default });
    const shob = new SheetObject({ mySheet });
    
    // get sheet data
    const {
      interval: columnNameInterval,
      slackWebhook: columnNameSlackWebhook,
    } = Settings.sheet.default.column;
    const interval = shob.data[0][columnNameInterval];
    const slackWebhook = shob.data[0][columnNameSlackWebhook];

    // stop monitoring
    if (interval.toString().toLowerCase() === 'stop') {
      Monitor.stop();

      message = 'Monitor stopped';
      Logger.log(message);
      if (options && options.context === 'menu') SpreadsheetApp.getUi().alert(message);

      return;
    }

    // do data validations
    if (
      slackWebhook.toString().replace(/\s/g, '') !== ''
      && !Validator.isURL(slackWebhook)
    ) {
      throw `[Slack Webhook]: "${slackWebhook}" is not a url`;
    }

    const invalidURLs = [];
    const servers = shob.data.map(obj => ({ url: obj.URL }));
    servers.forEach((server) => {
      if (!Validator.isURL(server.url)) invalidURLs.push(server.url);
    });
    if (invalidURLs.length > 0) throw `Invalid URL: ${invalidURLs}`;

    // start monitoring
    Monitor.start({ interval, servers, slackWebhook });
    message = 'Monitor started with the configuration';
    Logger.log(message);
    if (options && options.context === 'menu') SpreadsheetApp.getUi().alert(message);
  } catch (err) {
    Logger.severe('App, err = %s', err);
    if (options && options.context === 'menu') SpreadsheetApp.getUi().alert(err);
  }
};
