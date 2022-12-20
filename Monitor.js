// For use with ScriptApp.newTrigger
const OnTimerHandler = () => Monitor.check();

const Monitor = (() => {
  const Connected = 'connected';
  const Disconnected = 'disconnected';
  const ValidIntervals = [1, 5, 10, 15, 30];
  const PropertyKeyServers = 'SERVERS';
  const PropertyKeySlackWebhook = 'SLACK_WEBHOOK';
  const ScriptProperties = PropertiesService.getScriptProperties();

  const start = ({
    interval,
    servers,
    slackWebhook,
  }) => {
    // time-driven triggers every n minutes
    if (!ValidIntervals.includes(Number(interval))) {
      throw `[${Settings.sheet.default.column.interval}] has to be one of "${ValidIntervals}"`;
    }

    ScriptProperties.setProperty(PropertyKeyServers, JSON.stringify(servers));
    ScriptProperties.setProperty(PropertyKeySlackWebhook, slackWebhook);

    ScriptApp.newTrigger('OnTimerHandler')
      .timeBased()
      .everyMinutes(interval)
      .create();

    // init server status first
    check();
  };

  const stop = () => {
    // Deletes all triggers
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach((trigger) => {
      try{
        ScriptApp.deleteTrigger(trigger);
      } catch(err) {
        throw new Error(err.message);
      };
    });

    ScriptProperties.deleteProperty(PropertyKeyServers);
    ScriptProperties.deleteProperty(PropertyKeySlackWebhook);
  };

  const check = () => {
    Logger = MyLogger.init();

    const value = ScriptProperties.getProperty(PropertyKeyServers);
    if (!value) {
      Logger.server(`No "${PropertyKeyServers}" in Script Properties`)
    }

    let urlToCheck;
    const servers = JSON.parse(value);
    try {
      for (const server of servers) {
        const { url } = server;
        urlToCheck = url;
        const response = UrlFetchApp.fetch(url, {
          muteHttpExceptions: true, // doesn't throw an exception if the response code indicates failure
          validateHttpsCertificates: false, // ignores any invalid certificates for HTTPS requests
          followRedirects: true, // automatically follow HTTP redirects
        });

        if (response) {
          const status = response.getResponseCode();

          // Debug
          Logger.fine(`${url}(code:${status})`);

          if (status === 200) {
            if (server.status !== Connected) {
              server.status = Connected;
              server.statusChanged = true;
            }
          } else if (
            status === 403
            || status === 404
            || status === 500
          ) {
            if (server.status !== Disconnected) {
              server.status = Disconnected;
              server.statusChanged = true;
            }
          }
        } else {
          if (server.status !== Disconnected) {
            server.status = Disconnected;
            server.statusChanged = true;
          }
        }
      }
    } catch (e) {
      // Find the origin
      const server = servers.find(server => server.url === urlToCheck);
      if (server && server.status !== Disconnected) {
        server.status = Disconnected;
        server.statusChanged = true;
      }
    } finally {
      save(servers);
    }
  };

  // update servers
  const save = (servers) => {
    const servers_ = [...servers];
    
    let changed;
    for (const server of servers_) {
      const { statusChanged, url, status } = server;
      if (statusChanged) {
        changed = true;
        server.statusChanged = false;

        const text = `"${url}" is ${status}`;
        const emoji = (server.status === Connected)? '🟢' : '🔴';

        Logger.log(`${emoji} ${text}`);

        const webhook = ScriptProperties.getProperty(PropertyKeySlackWebhook);
        if (webhook) SlackAPI.send(webhook, `${emoji} ${text}`);
        else Logger.fine('Slack webhook is empty');
      }
    }
    
    if (changed) {
      ScriptProperties.setProperty(PropertyKeyServers, JSON.stringify(servers_));
    }

    // const value = ScriptProperties.getProperty(PropertyKeyServers);
    // Logger.fine(`servers:${value}`);
  };

  return {
    check,
    start,
    stop,
  };
})();
