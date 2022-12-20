const MyLogger = (() => {
  // By BetterLog, https://github.com/peterherrmann/BetterLog
  // default: 'INFO' level
  const init = (level = Settings.sheet.logger.level) => {
    if (Settings.sheet.logger.sheetId) {
      let logger = BetterLog.useSpreadsheet(...Object.values(Settings.sheet.logger));
      logger = BetterLog.setLevel(level);
      return logger;
    }

    return Logger;
  };

  return {
    init
  };
})();
