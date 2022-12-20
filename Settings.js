const Settings = (() => {
  return {
    sheet: {
      logger: {
        sheetId: '', // Leave empty for not logging to sheet
        sheetName: 'log', // You may change
        level: 'INFO', // Use "INFO" or "FINE" for this app
      },
      default: {
        sheetId: SpreadsheetApp.getActive().getId(),
        sheetName: 'Sheet1', // You may change corresponding to the sheet name
        column: {
          url: 'URL',
          interval: 'Interval(minutes)',
          logSheet: 'Log sheet ID',
          slackWebhook: 'Slack Webhook',
        },
      },
    },
  }
})();
