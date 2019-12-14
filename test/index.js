/**
 * This module tests the google spreadsheet wrapper.
 */

//Imports
require('dotenv').config();
const describe = require('riteway').describe;
const googleSheet = require('../index');

//Testing access spreadsheet.
describe('accessSpreadsheet()', async assert => {
  //Use the access spreadsheet function to retrieve the sheet.
  const sheet = await googleSheet.accessSpreadsheet(
    process.env.PURCHASES_JULY2019_ID
  );

  //Verify the url contains the id.
  assert({
    given: 'The spread sheet id',
    should: 'return the sheet with the url containing the id.',
    actual: sheet.url.includes(process.env.PURCHASES_JULY2019_ID),
    expected: true
  });
});

//Testing get rows.
describe('getRows()', async assert => {
  //Use the access spreadsheet function to retrieve the sheet.
  const sheet = await googleSheet.accessSpreadsheet(
    process.env.PURCHASES_JULY2019_ID
  );

  //Retrieve the rows using get rows.
  const rows = await googleSheet.getRows(sheet);

  //Verify rows were returned.
  assert({
    given: 'The sheet',
    should: 'return an array or rows.',
    actual: rows === undefined,
    expected: false
  });
});

//Testing get queried rows.
describe('getQueriedRows()', async assert => {
  //Use the access spreadsheet function to retrieve the sheet.
  const sheet = await googleSheet.accessSpreadsheet(
    process.env.PURCHASES_JULY2019_ID
  );

  //The query for finding a row.
  const query = 'price = 202.39';

  //The expected price of the row.
  let expected = '$202.39';

  //Retrieve a row based on the price.
  const row = (await googleSheet.getQueriedRows(sheet, query))[0];

  //Verify the rows price.
  assert({
    given: 'The sheet and the query of "' + query + '"',
    should: 'return an object with the correct price',
    actual: row.price,
    expected
  });
});

//Testing update row
describe('updateRow()', async assert => {
  //Use the access spreadsheet function to retrieve the sheet.
  const sheet = await googleSheet.accessSpreadsheet(
    process.env.PURCHASES_JULY2019_ID
  );

  //The query for finding a row.
  const query = 'price = 202.39';

  //Retrieve a row based on the price.
  let row = (await googleSheet.getQueriedRows(sheet, query))[0];

  //Value for what to update notes to.
  const notes = 'Test';

  //Update the row.
  await googleSheet.updateRow(row, {
    notes
  });

  //For some reason their was a race condition with updating and fetching again.
  setTimeout(async function() {
    //Retrieve the updated row.
    let updatedRow = (await googleSheet.getQueriedRows(sheet, query))[0];

    //Verify the rows notes.
    assert({
      given: 'The row and the value',
      should: 'update the row properly.',
      actual: updatedRow.notes,
      expected: notes
    });
  }, 200);
});

//Testing create row.
describe('createRow()', async assert => {
  //Use the access spreadsheet function to retrieve the sheet.
  const sheet = await googleSheet.accessSpreadsheet(
    process.env.PURCHASES_JULY2019_ID
  );

  const itemname = 'Test';

  //Data for the new row.
  const data = {
    itemname
  };

  //Use google sheets to create the row.
  await googleSheet.createRow(sheet, data);

  //Query used to find the row.
  const query = 'itemname = ' + itemname;

  //Retrieve a row based on the price.
  const row = (await googleSheet.getQueriedRows(sheet, query))[0];

  //Verify the rows name.
  assert({
    given: 'The data',
    should: 'create a row with the data.',
    actual: row.itemname,
    expected: itemname
  });
});

//Testing delete row.
describe('deleteRow()', async assert => {
  //Use the access spreadsheet function to retrieve the sheet.
  const sheet = await googleSheet.accessSpreadsheet(
    process.env.PURCHASES_JULY2019_ID
  );

  //The item name to search by.
  const itemname = 'Test';

  //Query used to find the row.
  const query = 'itemname = ' + itemname;

  //Retrieve a row based on the price.
  let row = (await googleSheet.getQueriedRows(sheet, query))[0];

  //Delete the row.
  googleSheet.deleteRow(row);

  //For some reason their was a race condition with deleting and fetching again.
  setTimeout(async function() {
    //Retrieve the updated row.
    let deletedRow = (await googleSheet.getQueriedRows(sheet, query))[0];

    //Verify the row was deleted.
    assert({
      given: 'The row',
      should: 'delete the row.',
      actual: deletedRow,
      expected: undefined
    });
  }, 100);
});
