import { IBlockRepository } from "../../domain/repositories/IBlockRepository";
import { Block } from "../../domain/entities/Block";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";
import { UserContext } from "./AdminCreateUser";

interface UpdateBlockData {
    name?: string;
    capacity?: number;
}

export class UpdateBlock {
    constructor(
        private blockRepository: IBlockRepository,
        private auditLogRepository: IAuditLogRepository
    ) { }

    async execute(id: string, data: UpdateBlockData, userContext: UserContext): Promise<void> {
        const block = await this.blockRepository.findById(id);
        if (!block) {
            throw new Error("Block not found");
        }

        const updatedBlock = new Block(
            block.id,
            data.name !== undefined ? data.name : block.name,
            data.capacity !== undefined ? data.capacity : block.capacity,
            block.occupied
        );

        await this.blockRepository.save(updatedBlock);

        // Log audit event
        const changes: string[] = [];
        if (data.name !== undefined) changes.push(`name: ${data.name}`);
        if (data.capacity !== undefined) changes.push(`capacity: ${data.capacity}`);

        await this.auditLogRepository.save(new AuditLog(
            null,
            userContext.userId,
            userContext.userRole,
            userContext.userName,
            "BLOCK_UPDATED",
            "Block",
            id,
            JSON.stringify({ changes }),
            userContext.ipAddress
        ));
    }
}
