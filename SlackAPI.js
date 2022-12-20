/**
 * An example of sending messages into Slack. See:
 * https://developers.google.com/google-ads/scripts/docs/features/third-party-apis
 */
const SlackAPI = (() => {
  const send = (webhook, text) => {
    const options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify({ text }),
    };
    
    UrlFetchApp.fetch(webhook, options);
  };

  return {
    send,
  };
})();
