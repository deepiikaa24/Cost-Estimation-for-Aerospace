const { google } = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const keys = require('C:/Users/dell/Downloads/Cost-Estimation-for-Aerospace/src/backend/costestimation-440406-a3f38b06c750.json');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Google Sheets API client setup
const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key.replace(/\\n/g, '\n'), // Handles formatting of private key
  ['https://www.googleapis.com/auth/spreadsheets']
);

// Headers for the Google Sheet
const headers = [
  'Length', 'Width', 'Thickness', 'Diameter', 'Form', 'Material',
  'Alloy', 'Temper', 'Density', 'Volume', 'Weight', 'Quantity',
  'Predicted Price', 'Net Price', 'Net Value' ,'Freight Charge', 'Rejection Charge'
];

// Function to update Google Sheet
const updateSheet = async (formData) => {
  try {
    // Connect to Google Sheets
    await client.authorize();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Define the spreadsheet ID and the range to update
    const spreadsheetId = '1tEoUY1HXB9arjl0mt7trGWLG3ts5cwRbR0HHrhCfGhs';
    const headerRange = 'Sheet1!A1:O1'; // Example range for headers
    const dataRange = 'Sheet1!A2:Q'; // Range for appending data

    // Check if headers are already present
    const headerCheck = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: headerRange,
    });

    // If headers are not present, add them
    if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: headerRange,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [headers],
        },
      });
    }

    // Prepare the data to be added (must be a 2D array)
    const values = [
      [
        formData.length,
        formData.width,
        formData.thickness,
        formData.diameter,
        formData.form,
        formData.material,
        formData.alloy,
        formData.temper,
        formData.density,
        formData.volume,
        formData.weight,
        formData.quantity,
        formData.predictedPrice,
        formData.netPrice,
        formData.netValue,
        formData.freightCharge,   
        formData.rejectionCharge
      ],
    ];

    const request = {
      spreadsheetId,
      range: dataRange,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values,
      },
    };

    const response = await sheets.spreadsheets.values.append(request);
    console.log('Sheet updated successfully', response.data);
  } catch (error) {
    console.error('Error updating Google Sheet', error);
  }
};

// Endpoint to update Google Sheet
app.post('/update-sheet', async (req, res) => {
  const formData = req.body;

  try {
    await updateSheet(formData);
    res.status(200).send({ message: 'Sheet updated successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error updating Google Sheet', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;


