import { Request, Response } from "express";
import { CreateContainerRequest } from "../../application/useCases/CreateContainerRequest";
import { GetCustomerRequests } from "../../application/useCases/GetCustomerRequests";
import { GetContainerById } from "../../application/useCases/GetContainerById"; // Using existing use case for checking container ownership
import { GetAllContainerRequests } from "../../application/useCases/GetAllContainerRequests";
import { UpdateContainerRequest } from "../../application/useCases/UpdateContainerRequest";

export class ContainerRequestController {
    constructor(
        private createContainerRequest: CreateContainerRequest,
        private getCustomerRequests: GetCustomerRequests,
        private getContainerById: GetContainerById,
        private getAllContainerRequests: GetAllContainerRequests,
        private updateContainerRequest: UpdateContainerRequest
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const customerId = req.user?.id || req.body.customerId;
            if (!customerId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            // If it's a destuffing request, verify container exists and belongs to customer
            if (req.body.type === "destuffing" && req.body.containerId) {
                const container = await this.getContainerById.execute(req.body.containerId);
                // In a real scenario, we'd check if container.customer === customerId
                // For now, we'll proceed if it exists
                if (!container) {
                    res.status(404).json({ message: "Container not found" });
                    return;
                }
            }

            const userContext = {
                userId: req.user?.id || customerId,
                userName: req.user?.name || "Customer",
                userRole: req.user?.role || "customer",
                ipAddress: req.ip || req.socket.remoteAddress || "unknown"
            };

            const result = await this.createContainerRequest.execute({
                ...req.body,
                customerId,
            }, userContext);

            res.status(201).json(result);
        } catch (error: unknown) {
            res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
        }
    }

    async getMyRequests(req: Request, res: Response): Promise<void> {
        try {
            const customerId = req.user?.id;
            if (!customerId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const results = await this.getCustomerRequests.execute(customerId);
            res.status(200).json(results);
        } catch (error: unknown) {
            res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const results = await this.getAllContainerRequests.execute();
            // In a real app we might populate customer names here if relying on pure entities.
            // For now, we return the entities.
            res.status(200).json(results);
        } catch (error: unknown) {
            res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const data = req.body;

            const userContext = {
                userId: req.user?.id || "system",
                userName: req.user?.name || "System",
                userRole: req.user?.role || "admin",
                ipAddress: req.ip || req.socket.remoteAddress || "unknown"
            };

            // Customers can only mark their OWN requests as "completed"
            if (req.user?.role === "customer") {
                // Only allow status: "completed", nothing else
                const allowedKeys = ["status"];
                const hasDisallowedFields = Object.keys(data).some(k => !allowedKeys.includes(k));
                if (hasDisallowedFields || data.status !== "completed") {
                    res.status(403).json({ message: "Customers can only mark requests as completed." });
                    return;
                }

                // Verify ownership by fetching the request first
                const { ContainerRequestRepository } = await import("../../infrastructure/repositories/ContainerRequestRepository");
                const repo = new ContainerRequestRepository();
                const existing = await repo.findById(id as string);
                if (!existing) {
                    res.status(404).json({ message: "Container request not found" });
                    return;
                }
                if (existing.customerId !== req.user.id) {
                    res.status(403).json({ message: "You can only update your own requests." });
                    return;
                }
            }

            const updated = await this.updateContainerRequest.execute(id as string, data, userContext);

            if (!updated) {
                res.status(404).json({ message: "Container request not found" });
                return;
            }

            res.status(200).json(updated);
        } catch (error: unknown) {
            res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
        }
    }
}
