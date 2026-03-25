import { ContainerRepository } from "../../infrastructure/repositories/ContainerRepository";
import { ContainerRequestRepository } from "../../infrastructure/repositories/ContainerRequestRepository";
import { BillRepository } from "../../infrastructure/repositories/BillRepository";
import { PDARepository } from "../../infrastructure/repositories/PDARepository";

const fmt = (d?: Date) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

const inr = (n?: number) => `₹${(n || 0).toLocaleString("en-IN")}`;

export class AIChatContextBuilder {
  // ─────────────────────────────────────────
  // CONTAINERS category
  // ─────────────────────────────────────────
  static async buildContainerContext(customerId: string): Promise<string> {
    const containerRepo = new ContainerRepository();
    const requestRepo = new ContainerRequestRepository();

    const [containers, requests] = await Promise.all([
      containerRepo.findAll({ customer: customerId }),
      requestRepo.findByCustomerId(customerId),
    ]);

    const lines: string[] = [];

    lines.push(`=== CUSTOMER CONTAINER OVERVIEW ===`);
    lines.push(`Total Containers on Record: ${containers.length}`);
    lines.push(``);

    if (containers.length === 0) {
      lines.push("No containers found for this customer.");
    } else {
      lines.push(`--- CONTAINER DETAILS ---`);
      for (const c of containers) {
        lines.push(
          `• ${c.containerNumber} | ${c.size} ${c.type} | Movement: ${c.movementType || "N/A"} | Status: ${c.status}` +
            ` | Shipping Line: ${c.shippingLine}` +
            (c.yardLocation?.block ? ` | Block: ${c.yardLocation.block}` : "") +
            (c.gateInTime ? ` | Gate-In: ${fmt(c.gateInTime)}` : "") +
            (c.gateOutTime ? ` | Gate-Out: ${fmt(c.gateOutTime)}` : "") +
            (c.dwellTime ? ` | Dwell: ${c.dwellTime} days` : "") +
            (c.cargoDescription ? ` | Cargo: ${c.cargoDescription}` : "") +
            (c.cargoWeight ? ` | Cargo Weight: ${c.cargoWeight} MT` : "") +
            (c.cargoCategory ? ` | Category: ${c.cargoCategory}` : "") +
            (c.hazardousClassification ? ` | ⚠ HAZARDOUS` : "") +
            (c.damaged
              ? ` | ⚠ DAMAGED${c.damageDetails ? `: ${c.damageDetails}` : ""}`
              : "") +
            (c.blacklisted ? ` | 🚫 BLACKLISTED` : "") +
            (c.empty ? ` | Empty` : " | Loaded"),
        );
      }
    }

    lines.push(``);
    lines.push(`--- CONTAINER REQUESTS (Stuffing / Destuffing) ---`);

    if (requests.length === 0) {
      lines.push("No container requests found for this customer.");
    } else {
      for (const r of requests) {
        const line = [
          `• Request ${r.id || ""}`,
          `  Type: ${r.type} | Status: ${r.status}`,
          r.containerNumber ? `  Container: ${r.containerNumber}` : "",
          r.containerSize
            ? `  Size: ${r.containerSize} ${r.containerType || ""}`
            : "",
          r.cargoDescription ? `  Cargo: ${r.cargoDescription}` : "",
          r.cargoWeight ? `  Cargo Weight: ${r.cargoWeight} MT` : "",
          r.preferredDate ? `  Preferred Date: ${fmt(r.preferredDate)}` : "",
          r.specialInstructions
            ? `  Instructions: ${r.specialInstructions}`
            : "",
          r.isHazardous ? `  ⚠ Hazardous Material` : "",
          r.createdAt ? `  Submitted: ${fmt(r.createdAt)}` : "",
          r.checkpoints && r.checkpoints.length > 0
            ? `  Checkpoints: ${r.checkpoints.map((cp) => `${cp.location} (${cp.status})`).join(" → ")}`
            : "",
        ]
          .filter(Boolean)
          .join("\n");
        lines.push(line);
      }
    }

    console.log("Container log:\n", lines.join("\n"));

    return lines.join("\n");
  }

  // ─────────────────────────────────────────
  // BILLS category
  // ─────────────────────────────────────────
  static async buildBillContext(customerId: string): Promise<string> {
    const billRepo = new BillRepository();
    const bills = await billRepo.findAll(customerId);

    const lines: string[] = [];
    lines.push(`=== CUSTOMER BILLING OVERVIEW ===`);

    const paid = bills.filter((b) => b.status === "paid");
    const pending = bills.filter((b) => b.status === "pending");
    const overdue = bills.filter((b) => b.status === "overdue");

    const totalUnpaid = [...pending, ...overdue].reduce(
      (s, b) => s + (b.totalAmount || 0),
      0,
    );
    const totalPaid = paid.reduce((s, b) => s + (b.totalAmount || 0), 0);

    lines.push(`Total Bills: ${bills.length}`);
    lines.push(`Paid: ${paid.length} (${inr(totalPaid)})`);
    lines.push(`Pending: ${pending.length}`);
    lines.push(`Overdue: ${overdue.length}`);
    lines.push(`Total Unpaid Amount: ${inr(totalUnpaid)}`);
    lines.push(``);

    if (bills.length === 0) {
      lines.push("No bills found for this customer.");
    } else {
      lines.push(`--- BILL DETAILS ---`);
      for (const b of bills) {
        lines.push(
          `• Bill #${b.billNumber} | Container: ${b.containerNumber} | Amount: ${inr(b.totalAmount)} | Status: ${b.status.toUpperCase()}` +
            ` | Due: ${fmt(b.dueDate)}` +
            (b.paidAt
              ? ` | Paid On: ${fmt(b.paidAt)} via ${b.paymentMethod || "N/A"}`
              : "") +
            (b.remarks ? ` | Remarks: ${b.remarks}` : ""),
        );
        if (b.lineItems && b.lineItems.length > 0) {
          for (const li of b.lineItems) {
            lines.push(
              `    - ${li.activityName} (${li.activityCode}): ${li.quantity} × ${inr(li.unitPrice)} = ${inr(li.amount)}`,
            );
          }
        }
      }
    }

    return lines.join("\n");
  }

  // ─────────────────────────────────────────
  // PDA category
  // ─────────────────────────────────────────
  static async buildPDAContext(userId: string): Promise<string> {
    const pdaRepo = new PDARepository();
    const pda = await pdaRepo.findByUserId(userId);

    const lines: string[] = [];
    lines.push(`=== CUSTOMER PDA (PRE-DEPOSIT ACCOUNT) OVERVIEW ===`);

    if (!pda) {
      lines.push("No PDA account found for this customer.");
      return lines.join("\n");
    }

    const transactions = await pdaRepo.findTransactionsByPdaId(pda.id);
    const credits = transactions.filter((t) => t.type === "credit");
    const debits = transactions.filter((t) => t.type === "debit");
    const totalCredited = credits.reduce((s, t) => s + t.amount, 0);
    const totalDebited = debits.reduce((s, t) => s + t.amount, 0);

    lines.push(`PDA Account Holder: ${pda.customer}`);
    lines.push(`Current Balance: ${inr(pda.balance)}`);
    lines.push(
      `Total Credited: ${inr(totalCredited)} (${credits.length} recharges)`,
    );
    lines.push(
      `Total Debited: ${inr(totalDebited)} (${debits.length} deductions)`,
    );
    lines.push(`Last Updated: ${fmt(pda.lastUpdated)}`);
    lines.push(``);

    const recent = [...transactions]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 50);

    if (recent.length === 0) {
      lines.push("No transactions found.");
    } else {
      lines.push(`--- TRANSACTION HISTORY (Most Recent 50) ---`);
      for (const t of recent) {
        lines.push(
          `• ${fmt(t.timestamp)} | ${t.type.toUpperCase()} | ${inr(t.amount)} | Balance After: ${inr(t.balanceAfter)} | ${t.description}`,
        );
      }
    }

    return lines.join("\n");
  }

  // ─────────────────────────────────────────
  // GENERAL / CROSS-QUERY category
  // ─────────────────────────────────────────
  static async buildGeneralContext(
    customerId: string,
    userId: string,
  ): Promise<string> {
    const containerRepo = new ContainerRepository();
    const requestRepo = new ContainerRequestRepository();
    const billRepo = new BillRepository();
    const pdaRepo = new PDARepository();

    const [containers, requests, bills, pda] = await Promise.all([
      containerRepo.findAll({ customer: customerId }),
      requestRepo.findByCustomerId(customerId),
      billRepo.findAll(customerId),
      pdaRepo.findByUserId(userId),
    ]);

    const activeContainers = containers.filter((c) =>
      ["gate-in", "in-yard", "in-transit", "at-port", "at-factory"].includes(
        c.status,
      ),
    );
    const pendingRequests = requests.filter((r) =>
      ["pending", "approved"].includes(r.status),
    );
    const overdueOrPendingBills = bills.filter(
      (b) => b.status === "pending" || b.status === "overdue",
    );
    const totalUnpaid = overdueOrPendingBills.reduce(
      (s, b) => s + (b.totalAmount || 0),
      0,
    );

    const lines: string[] = [];
    lines.push(`=== GENERAL CUSTOMER OVERVIEW ===`);
    lines.push(``);
    lines.push(`── CONTAINERS ──`);
    lines.push(`Total Containers: ${containers.length}`);
    lines.push(`Active (In Yard / Transit): ${activeContainers.length}`);
    lines.push(`Damaged: ${containers.filter((c) => c.damaged).length}`);
    lines.push(
      `Blacklisted: ${containers.filter((c) => c.blacklisted).length}`,
    );
    lines.push(``);
    lines.push(`── REQUESTS ──`);
    lines.push(`Total Requests: ${requests.length}`);
    lines.push(`Active (Pending/Approved): ${pendingRequests.length}`);
    lines.push(
      `Stuffing Requests: ${requests.filter((r) => r.type === "stuffing").length}`,
    );
    lines.push(
      `Destuffing Requests: ${requests.filter((r) => r.type === "destuffing").length}`,
    );
    lines.push(``);
    lines.push(`── BILLING ──`);
    lines.push(`Total Bills: ${bills.length}`);
    lines.push(`Paid: ${bills.filter((b) => b.status === "paid").length}`);
    lines.push(
      `Pending: ${bills.filter((b) => b.status === "pending").length}`,
    );
    lines.push(
      `Overdue: ${bills.filter((b) => b.status === "overdue").length}`,
    );
    lines.push(`Total Unpaid: ${inr(totalUnpaid)}`);
    lines.push(``);
    lines.push(`── PDA WALLET ──`);
    lines.push(`Current Balance: ${pda ? inr(pda.balance) : "No PDA account"}`);

    return lines.join("\n");
  }
}
