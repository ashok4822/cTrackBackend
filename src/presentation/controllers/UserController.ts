import { Request, Response } from "express";
import { AdminCreateUser } from "../../application/useCases/AdminCreateUser";
import { GetUserProfile } from "../../application/useCases/GetUserProfile";
import { UpdateUserProfile } from "../../application/useCases/UpdateUserProfile";
import { UpdatePassword } from "../../application/useCases/UpdatePassword";
import { UpdateUserProfileImage } from "../../application/useCases/UpdateUserProfileImage";
import { GetAllUsers } from "../../application/useCases/GetAllUsers";
import { ToggleUserBlockStatus } from "../../application/useCases/ToggleUserBlockStatus";
import { AdminUpdateUser } from "../../application/useCases/AdminUpdateUser";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class UserController {
  constructor(
    private adminCreateUserUseCase: AdminCreateUser,
    private getUserProfileUseCase: GetUserProfile,
    private updateUserProfileUseCase: UpdateUserProfile,
    private updatePasswordUseCase: UpdatePassword,
    private updateProfileImageUseCase: UpdateUserProfileImage,
    private getAllUsersUseCase: GetAllUsers,
    private toggleUserBlockStatusUseCase: ToggleUserBlockStatus,
    private adminUpdateUserUseCase: AdminUpdateUser
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
        companyName: user.companyName,
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

      const { name, phone, companyName } = req.body;
      const updatedUser = await this.updateUserProfileUseCase.execute(userId, {
        name,
        phone,
        companyName,
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
          companyName: updatedUser.companyName,
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

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.getAllUsersUseCase.execute();
      return res.status(HttpStatus.OK).json(
        users.map((user) => ({
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          phone: user.phone,
          profileImage: user.profileImage,
          companyName: user.companyName,
          isBlocked: user.isBlocked,
        }))
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occured";
      return res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async toggleBlockStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedUser = await this.toggleUserBlockStatusUseCase.execute(id as string);
      return res.status(HttpStatus.OK).json({
        message: `User ${updatedUser.isBlocked ? "blocked" : "unblocked"} successfully`,
        user: {
          id: updatedUser.id,
          isBlocked: updatedUser.isBlocked,
        },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occured";
      return res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, role, organization } = req.body;
      const updatedUser = await this.adminUpdateUserUseCase.execute(id as string, {
        name,
        role,
        companyName: organization,
      });

      return res.status(HttpStatus.OK).json({
        message: "User updated successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
          name: updatedUser.name,
          organization: updatedUser.companyName,
        },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occured";
      return res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }
}
