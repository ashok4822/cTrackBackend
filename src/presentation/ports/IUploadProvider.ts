import { Request, Response, NextFunction } from "express";

export interface IUploadProvider {
    /**
     * Returns a middleware that handles a single file upload
     * @param fieldName The name of the form field containing the file
     */
    single(fieldName: string): (req: Request, res: Response, next: NextFunction) => void;

    /**
     * Returns a middleware that handles multiple file uploads
     * @param fieldName The name of the form field containing the files
     * @param maxCount Optional maximum number of files
     */
    array(fieldName: string, maxCount?: number): (req: Request, res: Response, next: NextFunction) => void;
}
