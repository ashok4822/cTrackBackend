const mongoose = require('mongoose');

const actSchema = new mongoose.Schema({ code: String, name: String });
const chargeSchema = new mongoose.Schema({
    activityId: mongoose.Schema.Types.ObjectId,
    rate: Number,
    containerSize: String,
    containerType: String
});

const Activity = mongoose.model('Activity', actSchema);
const Charge = mongoose.model('Charge', chargeSchema);

async function run() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ctrack');
        const actCodes = ['STUF', 'DEST', 'STUFFING', 'DESTUFFING', 'STOR'];
        const activities = await Activity.find({ code: { $in: actCodes } });
        console.log('MATCHING ACTIVITIES:', JSON.stringify(activities));

        for (const act of activities) {
            const charges = await Charge.find({ activityId: act._id });
            console.log('CHARGES FOR ' + act.code + ':', JSON.stringify(charges));
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
