/**
 * The event handler triggered when opening the spreadsheet.
 * @param {Event} e The onOpen event.
 * @see https://developers.google.com/apps-script/guides/triggers#onopene
 * 
 * Alternative way to create an onOpen trigger by script:
 *   ScriptApp.newTrigger('addCustomMenu_')
 *     .forSpreadsheet(SpreadsheetApp.getActive())
 *     .onOpen()
 *     .create();
 */
function onOpen(e) {
  addCustomMenu_();
}

// Add a custom menu to the spreadsheet
const addCustomMenu_ = () => {
  SpreadsheetApp.getUi() // Or DocumentApp, SlidesApp, or FormApp.
    .createMenu('[Menu]')
    .addItem('Update', 'runAppFromMenu_')
    .addToUi();
};
