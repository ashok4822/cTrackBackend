import { Bill } from "./src/domain/entities/Bill";

try {
    const bill = new Bill(
        "1", "B001", "C001", "Line1", "CID1", "Cust1", "CustName1", [], 100, "paid", new Date(), "none", new Date(), "pda", new Date(), new Date()
    );
    console.log("Bill entity loaded successfully:", bill);
} catch (error) {
    console.error("Error loading Bill entity:", error);
}
