import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { IConfigService } from "../../application/services/IConfigService";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

import { IUploadProvider } from "../../presentation/ports/IUploadProvider";

/**
 * Factory function that creates and returns an IUploadProvider instance
 * configured with Cloudinary, using credentials sourced from IConfigService.
 *
 * Must be called from the composition root (server.ts) and the resulting
 * provider injected into route factories that need it.
 */
export const createUploadProvider = (config: IConfigService): IUploadProvider => {
    cloudinary.config({
        cloud_name: config.get("CLOUDINARY_CLOUD_NAME"),
        api_key: config.get("CLOUDINARY_API_KEY"),
        api_secret: config.get("CLOUDINARY_API_SECRET"),
    });

    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (_req: Request, file: Express.Multer.File) => {
            return {
                folder: "profiles",
                allowed_formats: ["jpg", "jpeg", "png", "webp"],
                public_id: `profile-${Date.now()}-${file.originalname.split(".")[0]}`,
            };
        },
    });

    const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error(ResponseMessage.ONLY_IMAGES_ALLOWED));
        }
    };

    const multerInstance = multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024, // 5 MB limit
        },
    });

    return {
        single: (fieldName: string) => multerInstance.single(fieldName),
        array: (fieldName: string, maxCount?: number) => multerInstance.array(fieldName, maxCount),
    };
};
