import { IShippingLineRepository } from "../../domain/repositories/IShippingLineRepository";
import { ShippingLine } from "../../domain/entities/ShippingLine";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";
import { UserContext } from "./AdminCreateUser";

export class CreateShippingLine {
    constructor(
        private shippingLineRepository: IShippingLineRepository,
        private auditLogRepository: IAuditLogRepository
    ) { }

    async execute(name: string, code: string, userContext: UserContext): Promise<void> {
        const shippingLine = new ShippingLine(null, name, code);
        const savedShippingLine = await this.shippingLineRepository.save(shippingLine);

        // Log audit event
        await this.auditLogRepository.save(new AuditLog(
            null,
            userContext.userId,
            userContext.userRole,
            userContext.userName,
            "SHIPPING_LINE_CREATED",
            "ShippingLine",
            savedShippingLine.id,
            JSON.stringify({ name, code }),
            userContext.ipAddress
        ));
    }
}
