import { Repositories } from "../Repositories";
import { Services } from "../Services";
import { eventBus } from "../../events/EventEmitterBus";

// Use Cases
import { AdminCreateUser } from "../../../application/useCases/AdminCreateUser";
import { UpdateUserProfile } from "../../../application/useCases/UpdateUserProfile";
import { UpdatePassword } from "../../../application/useCases/UpdatePassword";
import { UpdateUserProfileImage } from "../../../application/useCases/UpdateUserProfileImage";
import { GetAllUsers } from "../../../application/useCases/GetAllUsers";
import { ToggleUserBlockStatus } from "../../../application/useCases/ToggleUserBlockStatus";
import { AdminUpdateUser } from "../../../application/useCases/AdminUpdateUser";
import { GetAuditLogs } from "../../../application/useCases/GetAuditLogs";
import { GetUserProfile } from "../../../application/useCases/GetUserProfile";

// Controllers
import { UserController } from "../../../presentation/controllers/UserController";
import { AuditLogController } from "../../../presentation/controllers/AuditLogController";

export const createUserFactory = (repositories: Repositories, services: Services, getUserProfileUseCase: GetUserProfile) => {
  const adminCreateUserUseCase = new AdminCreateUser(
    repositories.userRepository,
    services.hashService,
    services.emailService,
    eventBus
  );
  
  const updateUserProfileUseCase = new UpdateUserProfile(repositories.userRepository, eventBus);
  const updatePasswordUseCase = new UpdatePassword(repositories.userRepository, services.hashService, eventBus);
  const updateProfileImageUseCase = new UpdateUserProfileImage(repositories.userRepository);
  const getAllUsersUseCase = new GetAllUsers(repositories.userRepository);
  const toggleUserBlockStatusUseCase = new ToggleUserBlockStatus(repositories.userRepository, eventBus);
  const adminUpdateUserUseCase = new AdminUpdateUser(repositories.userRepository, eventBus);
  const getAuditLogsUseCase = new GetAuditLogs(repositories.auditLogRepository);

  const userController = new UserController(
    adminCreateUserUseCase,
    getUserProfileUseCase, // Passed from authFactory
    updateUserProfileUseCase,
    updatePasswordUseCase,
    updateProfileImageUseCase,
    getAllUsersUseCase,
    toggleUserBlockStatusUseCase,
    adminUpdateUserUseCase
  );
  
  const auditLogController = new AuditLogController(getAuditLogsUseCase);

  return {
    userController,
    auditLogController
  };
};
