const mongoose = require('mongoose');

// Mock User Model
const UserSchema = new mongoose.Schema({ companyName: String, name: String });
const UserModel = mongoose.model('User', UserSchema);

// Mock Bill Schema
const BillSchema = new mongoose.Schema({
    billNumber: String,
    containerNumber: String,
    containerId: mongoose.Types.ObjectId,
    customer: String,
    lineItems: Array,
    totalAmount: Number,
    status: String,
    dueDate: Date,
    remarks: String
}, { timestamps: true });
const BillModel = mongoose.model('Bill', BillSchema);

async function testFetch() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ctracklocal');

        const docs = await BillModel.find().lean();
        console.log(`Found ${docs.length} bills in DB.`);

        const customerIds = [...new Set(docs.map(d => d.customer).filter(Boolean))];
        console.log(`Unique customer IDs: ${JSON.stringify(customerIds)}`);

        // Simulate BillRepository behavior
        let users = [];
        try {
            users = await UserModel.find({ _id: { $in: customerIds } }).select('_id companyName name').lean();
            console.log(`Found ${users.length} associated users.`);
        } catch (err) {
            console.error('Error during User lookup:', err.message);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

testFetch();
