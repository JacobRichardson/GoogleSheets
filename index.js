/** 
 * This module is a wrapper for google sheets
 * in order to access a spreadsheet, get rows,
 * query rows, create a row, update a row, and
 * delete a row.
 */

//Imports.
const GoogleSpreadsheet = require('google-spreadsheet');
const promisify = require('util').promisify;
const creds = require('./client_secret.json');

/** 
 * This function gets access to the spreadsheet.
 * @param {String} spreadSheetId The spreadsheet id.
 * This can be found in the spreadsheet's url.
 * @returns {Object} The sheet.
 */
module.exports.accessSpreadsheet = async function accessSpreadsheet (spreadSheetId) {

  //Retrieve the doc by using the spreadsheet id.
  const doc = new GoogleSpreadsheet(spreadSheetId);

  //Use the creds to authorize.
  await promisify(doc.useServiceAccountAuth)(creds);

  //Get the info from the doc.
  const info = await promisify(doc.getInfo)();

  //Retrieve the first sheet.
  const sheet = info.worksheets[0];

  //Return the sheet.
  return sheet;
}

/** 
 * This function retrieves all the rows of a sheet.
 * @param {Object} sheet The google sheet.
 * @return {Array} An array of google sheet rows.
 */
module.exports.getRows = async function getRows (sheet) {
  return await promisify(sheet.getRows)({
    offset: 0
  });
}

/** 
 * This function filters a sheet based
 * on the query string.
 * @param {Object} sheet a reference to the
 * google sheet.
 * @param {String} query The query string.
 * @return {Array} Matched rows.
 */
module.exports.getQueriedRows = async function getQueriedRows (sheet, query) {
  return await promisify(sheet.getRows)({
    query
  });
}

/** 
 * This function updates a row by copying
 * the values from the these values object
 * onto the row if the value exists on the row.
 * @param {Object} row A reference to
 * the google sheets row.
 * @param {Object} values An object that
 * contains the values to be updated.
 */
module.exports.updateRow = function updateRow (row, values) {

  //For each in key in values.
  Object.keys(values).forEach(key => {

    //If the row has the key.
    if (row[key]) {

      //Update the value of the key on the row.
      row[key] = values[key];
    }
  });

  //Save the row.
  row.save();
}

/** 
 * This function creates a row.
 * @param {Object} sheet A reference to the 
 * google sheet.
 * @param {Object} data The data of the row.
 */
module.exports.createRow = async function createRow (sheet, data) {
  await promisify(sheet.addRow)(data);
}

/** 
 * This function deletes a row.
 * @param {Object} row A reference to the
 * google sheets row.
 */
module.exports.deleteRow = function deleteRow (row) {
  if (row.del && typeof (row.del) === 'function') {
    row.del();
  }
}