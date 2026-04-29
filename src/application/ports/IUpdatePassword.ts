import { UserContext } from "./IAdminCreateUser";

export interface IUpdatePassword {
    execute(
        userId: string,
        currentPassword: string,
        newPassword: string,
        confirmPassword: string,
        userContext: UserContext
    ): Promise<void>;
}
