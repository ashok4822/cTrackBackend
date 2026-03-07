import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ctrack';

async function debugPDA() {
    let output = "";
    const log = (msg: string) => {
        console.log(msg);
        output += msg + "\n";
    };

    try {
        await mongoose.connect(mongoUri);
        log('Connected to MongoDB');

        const User = mongoose.model('User', new mongoose.Schema({
            email: String,
            name: String,
            companyName: String,
            role: String
        }));

        const PDA = mongoose.model('PDA', new mongoose.Schema({
            userId: mongoose.Schema.Types.ObjectId,
            customer: String,
            balance: Number
        }));

        const customers = await User.find({ role: 'customer' });
        log(`\nFound ${customers.length} customers:`);

        for (const user of customers) {
            log(`\nCustomer: ${user.name} (${user.email}) | Company: ${user.companyName} | ID: ${user._id}`);

            const pda = await PDA.findOne({ userId: user._id });
            if (pda) {
                log(`  PDA Found: Balance = ${pda.balance} | Customer Field = ${pda.customer}`);
            } else {
                log(`  PDA NOT FOUND for this userId.`);

                // Try searching by customer name just in case
                const pdaByName = await PDA.findOne({ customer: user.companyName });
                if (pdaByName) {
                    log(`  Found PDA by companyName instead: Balance = ${pdaByName.balance} | PDA userId = ${pdaByName.userId}`);
                } else if (user.name) {
                    const pdaByUserName = await PDA.findOne({ customer: user.name });
                    if (pdaByUserName) {
                        log(`  Found PDA by name instead: Balance = ${pdaByUserName.balance} | PDA userId = ${pdaByUserName.userId}`);
                    }
                }
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        log('Error: ' + error);
    } finally {
        fs.writeFileSync(path.join(__dirname, 'debug_pda_result.txt'), output);
    }
}

debugPDA();
