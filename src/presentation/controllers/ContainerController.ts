import { Request, Response } from "express";
import { CreateContainer } from "../../application/useCases/CreateContainer";
import { GetAllContainers } from "../../application/useCases/GetAllContainers";
import { GetContainerById } from "../../application/useCases/GetContainerById";
import { UpdateContainer } from "../../application/useCases/UpdateContainer";
import { BlacklistContainer } from "../../application/useCases/BlacklistContainer";
import { UnblacklistContainer } from "../../application/useCases/UnblacklistContainer";
import { GetContainerHistory } from "../../application/useCases/GetContainerHistory";
import { GetCustomerContainers } from "../../application/useCases/GetCustomerContainers";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class ContainerController {
    constructor(
        private createContainerUseCase: CreateContainer,
        private getAllContainersUseCase: GetAllContainers,
        private getContainerByIdUseCase: GetContainerById,
        private updateContainerUseCase: UpdateContainer,
        private blacklistContainerUseCase: BlacklistContainer,
        private unblacklistContainerUseCase: UnblacklistContainer,
        private getContainerHistoryUseCase: GetContainerHistory,
        private getCustomerContainersUseCase: GetCustomerContainers
    ) { }

    async createContainer(req: Request, res: Response) {
        try {
            await this.createContainerUseCase.execute(req.body);
            return res.status(HttpStatus.CREATED).json({ message: "Container created successfully" });
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async getAllContainers(req: Request, res: Response) {
        try {
            const filters = req.query as any;
            const containers = await this.getAllContainersUseCase.execute(filters);
            return res.status(HttpStatus.OK).json(containers);
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async getContainerById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const container = await this.getContainerByIdUseCase.execute(id as string);
            if (!container) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: "Container not found" });
            }
            return res.status(HttpStatus.OK).json(container);
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async updateContainer(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { equipment: equipmentName, ...data } = req.body;
            const performedBy = req.user?.name || req.user?.email || "System";
            await this.updateContainerUseCase.execute(id as string, data, equipmentName, performedBy);
            return res.status(HttpStatus.OK).json({ message: "Container updated successfully" });
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async blacklistContainer(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.blacklistContainerUseCase.execute(id as string);
            return res.status(HttpStatus.OK).json({ message: "Container blacklisted successfully" });
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async unblacklistContainer(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.unblacklistContainerUseCase.execute(id as string);
            return res.status(HttpStatus.OK).json({ message: "Container unblacklisted successfully" });
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async getContainerHistory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const history = await this.getContainerHistoryUseCase.execute(id as string);
            return res.status(HttpStatus.OK).json(history);
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async getCustomerContainers(req: Request, res: Response) {
        try {
            const customerName = req.user?.name;
            if (!customerName) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
            }
            const containers = await this.getCustomerContainersUseCase.execute(customerName);
            return res.status(HttpStatus.OK).json(containers);
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }
}
