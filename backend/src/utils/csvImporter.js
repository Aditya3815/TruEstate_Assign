const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { sequelize } = require('../config/database');
const Sale = require('../models/Sale');

const CSV_FILE_PATH = path.join(__dirname, '../../data/sales_data.csv');
const BATCH_SIZE = 1000;

const importCSV = async () => {
  console.log('='.repeat(50));
  console.log('STARTING CSV IMPORT PROCESS');
  console.log('='.repeat(50));

  try {
    // Check if CSV file exists
    console.log('\nChecking CSV file...');
    console.log('   Path:', CSV_FILE_PATH);

    if (!fs.existsSync(CSV_FILE_PATH)) {
      console.error('ERROR: CSV file not found!');
      console.error('   Looking for:', CSV_FILE_PATH);
      process.exit(1);
    }

    console.log('CSV file found!');
    const stats = fs.statSync(CSV_FILE_PATH);
    console.log(`   File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    // Connect to database
    console.log('\nConnecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully!');

    // Sync database (create tables)
    console.log('\nCreating database tables...');
    await sequelize.sync({ force: true });
    console.log('Tables created successfully!');

    console.log('\nReading and parsing CSV file...');
    console.log('   This may take a few moments...\n');

    let batch = [];
    let totalRecords = 0;
    let processedRecords = 0;
    const batches = [];

    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv())
        .on('data', (row) => {
          totalRecords++;

          // Show first row keys to confirm structure
          if (totalRecords === 1) {
            console.log('First record parsed successfully!');
            console.log('Sample fields:', Object.keys(row).slice(0, 5).join(', '), '...');
          }

          // Prepare sale record
          const saleRecord = {
            transactionId: row['Transaction ID'] || row['transaction_id'] || null,
            customerId: row['Customer ID'] || row['customer_id'],
            customerName: row['Customer Name'] || row['customer_name'],
            phoneNumber: row['Phone Number'] || row['phone_number'],
            gender: row['Gender'] || row['gender'],
            age: row['Age'] ? parseInt(row['Age']) : null,
            customerRegion: row['Customer Region'] || row['customer_region'],
            customerType: row['Customer Type'] || row['customer_type'],
            productId: row['Product ID'] || row['product_id'],
            productName: row['Product Name'] || row['product_name'],
            brand: row['Brand'] || row['brand'],
            productCategory: row['Product Category'] || row['product_category'],
            tags: row['Tags'] || row['tags'],
            quantity: row['Quantity'] ? parseInt(row['Quantity']) : 1,
            pricePerUnit: row['Price per Unit'] || row['price_per_unit'] || 0,
            discountPercentage: row['Discount Percentage'] || row['discount_percentage'] || 0,
            totalAmount: row['Total Amount'] || row['total_amount'] || 0,
            finalAmount: row['Final Amount'] || row['final_amount'] || 0,
            date: row['Date'] || row['date'],
            paymentMethod: row['Payment Method'] || row['payment_method'],
            orderStatus: row['Order Status'] || row['order_status'],
            deliveryType: row['Delivery Type'] || row['delivery_type'],
            storeId: row['Store ID'] || row['store_id'],
            storeLocation: row['Store Location'] || row['store_location'],
            salespersonId: row['Salesperson ID'] || row['salesperson_id'],
            employeeName: row['Employee Name'] || row['employee_name']
          };

          batch.push(saleRecord);

          if (batch.length >= BATCH_SIZE) {
            batches.push([...batch]);
            batch = [];

            if (totalRecords % 100000 === 0) {
              console.log(`Parsed ${totalRecords.toLocaleString()} records so far...`);
            }
          }
        })
        .on('end', async () => {
          if (batch.length > 0) batches.push([...batch]);

          const parseTime = ((Date.now() - startTime) / 1000).toFixed(2);

          console.log('\n' + '='.repeat(50));
          console.log('CSV PARSING COMPLETED!');
          console.log('='.repeat(50));
          console.log(`Total records parsed: ${totalRecords.toLocaleString()}`);
          console.log(`Total batches: ${batches.length.toLocaleString()}`);
          console.log(`Parse time: ${parseTime} seconds`);
          console.log('\nStarting database insertion...\n');

          const insertStartTime = Date.now();

          // Insert batches
          for (let i = 0; i < batches.length; i++) {
            try {
              await Sale.bulkCreate(batches[i], { validate: false });
              processedRecords += batches[i].length;

              if ((i + 1) % 10 === 0 || i === batches.length - 1) {
                const percentage = Math.round((processedRecords / totalRecords) * 100);
                const elapsed = ((Date.now() - insertStartTime) / 1000).toFixed(1);
                console.log(`   [${percentage}%] Inserted ${processedRecords.toLocaleString()} / ${totalRecords.toLocaleString()} records (${elapsed}s)`);
              }
            } catch (err) {
              console.error(`Error inserting batch ${i + 1}:`, err.message);
            }
          }

          const insertTime = ((Date.now() - insertStartTime) / 1000).toFixed(2);
          const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

          console.log('\n' + '='.repeat(50));
          console.log('DATABASE INSERTION COMPLETED!');
          console.log('='.repeat(50));
          console.log(`Records inserted: ${processedRecords.toLocaleString()}`);
          console.log(`Insert time: ${insertTime} seconds`);
          console.log(`Total time: ${totalTime} seconds`);

          // Create indexes
          console.log('\nCreating database indexes...');
          await sequelize.sync({ alter: false });
          console.log('Indexes created successfully!');

          // CLOSE DB HERE — CORRECT PLACE
          console.log('\nClosing database connection...');
          await sequelize.close();
          console.log('Database closed.');

          console.log('='.repeat(50));
          console.log('IMPORT PROCESS FINISHED');
          console.log('='.repeat(50));

          resolve();
        })
        .on('error', (error) => {
          console.error('\nCSV READING ERROR:', error);
          reject(error);
        });
    });

  } catch (error) {
    console.error('\nIMPORT FAILED:', error);
    throw error;
  }
};

// Auto-run if file executed directly
if (require.main === module) {
  importCSV()
    .then(() => {
      console.log('\nSUCCESS! Import completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nFAILED! Import script failed');
      process.exit(1);
    });
}

module.exports = importCSV;
