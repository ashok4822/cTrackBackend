import { Repositories } from "../Repositories";
import { Services } from "../Services";
import { IConfigService } from "../../../application/services/IConfigService";

import { GetPDA } from "../../../application/useCases/GetPDA";
import { CreateRazorpayPDAOrder } from "../../../application/useCases/CreateRazorpayPDAOrder";
import { VerifyRazorpayPDAPayment } from "../../../application/useCases/VerifyRazorpayPDAPayment";
import { PDAController } from "../../../presentation/controllers/PDAController";

export const createPDAFactory = (repositories: Repositories, services: Services, appConfig: IConfigService) => {
  const getPDAUseCase = new GetPDA(repositories.pdaRepository, repositories.userRepository, appConfig);
  const createRazorpayPDAOrderUseCase = new CreateRazorpayPDAOrder(services.paymentService);
  const verifyRazorpayPDAPaymentUseCase = new VerifyRazorpayPDAPayment(repositories.pdaRepository, services.paymentService);
  
  const pdaController = new PDAController(
    getPDAUseCase,
    createRazorpayPDAOrderUseCase,
    verifyRazorpayPDAPaymentUseCase
  );

  return {
    pdaController
  };
};
