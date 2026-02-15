import { Request, Response } from "express";
import { AdminCreateUser } from "../../application/useCases/AdminCreateUser";
import { GetUserProfile } from "../../application/useCases/GetUserProfile";
import { UpdateUserProfile } from "../../application/useCases/UpdateUserProfile";
import { UpdatePassword } from "../../application/useCases/UpdatePassword";
import { UpdateUserProfileImage } from "../../application/useCases/UpdateUserProfileImage";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class UserController {
  constructor(
    private adminCreateUserUseCase: AdminCreateUser,
    private getUserProfileUseCase: GetUserProfile,
    private updateUserProfileUseCase: UpdateUserProfile,
    private updatePasswordUseCase: UpdatePassword,
    private updateProfileImageUseCase: UpdateUserProfileImage
  ) { }

  async createUser(req: Request, res: Response) {
    try {
      const { email, password, role, name } = req.body;
      await this.adminCreateUserUseCase.execute(email, password, role, name);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: `${role} created successfully` });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occured";
      return res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }

      const user = await this.getUserProfileUseCase.execute(userId);

      // Don't send password in response
      return res.status(HttpStatus.OK).json({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
        profileImage: user.profileImage,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occured";
      return res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }

      const { name, phone } = req.body;
      const updatedUser = await this.updateUserProfileUseCase.execute(userId, {
        name,
        phone,
      });

      return res.status(HttpStatus.OK).json({
        message: "Profile updated successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
          name: updatedUser.name,
          phone: updatedUser.phone,
          profileImage: updatedUser.profileImage,
        },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occured";
      return res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }

      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (!currentPassword || !newPassword || !confirmPassword) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "All password fields are required" });
      }

      await this.updatePasswordUseCase.execute(
        userId,
        currentPassword,
        newPassword,
        confirmPassword
      );

      return res
        .status(HttpStatus.OK)
        .json({ message: "Password updated successfully" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occured";
      return res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async updateProfileImage(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }

      if (!req.file) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "No image file provided" });
      }

      const imageUrl = `/uploads/profiles/${req.file.filename}`;
      const updatedUser = await this.updateProfileImageUseCase.execute(
        userId,
        imageUrl
      );

      return res.status(HttpStatus.OK).json({
        message: "Profile image updated successfully",
        profileImage: updatedUser.profileImage,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occured";
      return res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }
}
