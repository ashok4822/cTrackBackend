import { Repositories } from "../Repositories";

import { GetNotifications } from "../../../application/useCases/GetNotifications";
import { MarkNotificationRead } from "../../../application/useCases/MarkNotificationRead";
import { MarkAllNotificationsRead } from "../../../application/useCases/MarkAllNotificationsRead";
import { DeleteNotification } from "../../../application/useCases/DeleteNotification";
import { NotificationController } from "../../../presentation/controllers/NotificationController";

export const createNotificationFactory = (repositories: Repositories) => {
  const getNotificationsUseCase = new GetNotifications(repositories.notificationRepository);
  const markNotificationReadUseCase = new MarkNotificationRead(repositories.notificationRepository);
  const markAllNotificationsReadUseCase = new MarkAllNotificationsRead(repositories.notificationRepository);
  const deleteNotificationUseCase = new DeleteNotification(repositories.notificationRepository);
  
  const notificationController = new NotificationController(
    getNotificationsUseCase,
    markNotificationReadUseCase,
    markAllNotificationsReadUseCase,
    deleteNotificationUseCase
  );

  return {
    notificationController
  };
};
