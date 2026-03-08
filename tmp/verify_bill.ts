import { Bill } from '../src/domain/entities/Bill';

const bill = new Bill(
    "123",
    "BL-001",
    "CONT-001",
    "MSCU",
    "C123",
    "CUST123",
    "Customer Name",
    [],
    1000,
    "pending",
    new Date(),
    "Remarks",
    undefined, // paidAt (13th)
    new Date("2021-01-01"), // createdAt (14th)
    new Date() // updatedAt (15th)
);

console.log("Bill ID:", bill.id);
console.log("Paid At:", bill.paidAt);
console.log("Created At:", bill.createdAt);

if (bill.paidAt !== undefined) {
    console.error("FAILED: paidAt should be undefined");
    process.exit(1);
}

if (bill.createdAt.getFullYear() !== 2021) {
    console.error("FAILED: createdAt should be from 2021");
    process.exit(1);
}

console.log("SUCCESS: Bill instantiation verification passed");
