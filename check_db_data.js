const mongoose = require('mongoose');

async function checkData() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ctracklocal');

        console.log('--- AUTO-GENERATED BILLS ---');
        const bills = await mongoose.connection.collection('bills').find({ remarks: /REQ-/ }).toArray();
        for (const bill of bills) {
            console.log(`Bill: ${bill.billNumber}, Customer: ${JSON.stringify(bill.customer)}, Type: ${typeof bill.customer}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkData();
