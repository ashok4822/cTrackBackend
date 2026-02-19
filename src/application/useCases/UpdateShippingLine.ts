import { IShippingLineRepository } from "../../domain/repositories/IShippingLineRepository";
import { ShippingLine } from "../../domain/entities/ShippingLine";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";
import { UserContext } from "./AdminCreateUser";

interface UpdateShippingLineData {
    name?: string;
    code?: string;
}

export class UpdateShippingLine {
    constructor(
        private shippingLineRepository: IShippingLineRepository,
        private auditLogRepository: IAuditLogRepository
    ) { }

    async execute(id: string, data: UpdateShippingLineData, userContext: UserContext): Promise<void> {
        const shippingLine = await this.shippingLineRepository.findById(id);
        if (!shippingLine) {
            throw new Error("Shipping Line not found");
        }

        const updatedShippingLine = new ShippingLine(
            shippingLine.id,
            data.name !== undefined ? data.name : shippingLine.shipping_line_name,
            data.code !== undefined ? data.code : shippingLine.shipping_line_code
        );

        await this.shippingLineRepository.save(updatedShippingLine);

        // Log audit event
        const changes: string[] = [];
        if (data.name !== undefined) changes.push(`name: ${data.name}`);
        if (data.code !== undefined) changes.push(`code: ${data.code}`);

        await this.auditLogRepository.save(new AuditLog(
            null,
            userContext.userId,
            userContext.userRole,
            userContext.userName,
            "SHIPPING_LINE_UPDATED",
            "ShippingLine",
            id,
            JSON.stringify({ changes }),
            userContext.ipAddress
        ));
    }
}
