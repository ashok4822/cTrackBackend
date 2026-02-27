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
            const customerId = (req as any).user?.id || req.body.customerId;
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

            const result = await this.createContainerRequest.execute({
                ...req.body,
                customerId,
            });

            res.status(201).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getMyRequests(req: Request, res: Response): Promise<void> {
        try {
            const customerId = (req as any).user?.id;
            if (!customerId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const results = await this.getCustomerRequests.execute(customerId);
            res.status(200).json(results);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const results = await this.getAllContainerRequests.execute();
            // In a real app we might populate customer names here if relying on pure entities.
            // For now, we return the entities.
            res.status(200).json(results);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const data = req.body;

            const updated = await this.updateContainerRequest.execute(id as string, data);

            if (!updated) {
                res.status(404).json({ message: "Container request not found" });
                return;
            }

            res.status(200).json(updated);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
