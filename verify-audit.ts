import 'dotenv/config';
import { MongoAuditLogRepository } from './src/infrastructure/repositories/MongoAuditLogRepository';
import { CreateContainerRequest } from './src/application/useCases/CreateContainerRequest';
import { ContainerRequestRepository } from './src/infrastructure/repositories/ContainerRequestRepository';
import { UserRepository } from './src/infrastructure/repositories/UserRepository';
import mongoose from 'mongoose';

async function verifyAuditLogs() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ctrack');
    console.log('Connected to MongoDB');

    const auditLogRepo = new MongoAuditLogRepository();
    const containerRequestRepo = new ContainerRequestRepository();
    const userRepo = new UserRepository();

    const createUseCase = new CreateContainerRequest(containerRequestRepo, userRepo, auditLogRepo);

    const userContext = {
        userId: 'test-user-id',
        userName: 'Test User',
        userRole: 'customer',
        ipAddress: '127.0.0.1'
    };

    console.log('Executing CreateContainerRequest...');
    try {
        await createUseCase.execute({
            customerId: 'test-user-id',
            type: 'stuffing',
            containerSize: '20ft',
            containerType: 'standard',
            remarks: 'Audit log test'
        }, userContext);

        console.log('Request created. Checking audit logs...');

        // Wait a bit for DB consistency if needed, though Mongo is usually fast enough here
        await new Promise(resolve => setTimeout(resolve, 1000));

        const logs = await auditLogRepo.findAll({ actionType: 'REQUEST_CREATED' as any });
        const latestLog = logs[logs.length - 1];

        if (latestLog && latestLog.userId === 'test-user-id' && latestLog.action === 'REQUEST_CREATED') {
            console.log('✅ Audit log verification SUCCESSFUL!');
            console.log('Log details:', JSON.stringify(latestLog, null, 2));
        } else {
            console.log('❌ Audit log verification FAILED!');
        }
    } catch (error) {
        console.error('Error during verification:', error);
    } finally {
        await mongoose.connection.close();
    }
}

verifyAuditLogs();
