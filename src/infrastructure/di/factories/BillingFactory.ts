import { Repositories } from "../Repositories";
import { Services } from "../Services";
import { eventBus } from "../../events/EventEmitterBus";
import { IConfigService } from "../../../application/services/IConfigService";

import { GetActivities } from "../../../application/useCases/GetActivities";
import { CreateActivity } from "../../../application/useCases/CreateActivity";
import { UpdateActivity } from "../../../application/useCases/UpdateActivity";
import { GetCharges } from "../../../application/useCases/GetCharges";
import { CreateCharge } from "../../../application/useCases/CreateCharge";
import { GetChargeHistory } from "../../../application/useCases/GetChargeHistory";
import { UpdateChargeRate } from "../../../application/useCases/UpdateChargeRate";
import { GetBills } from "../../../application/useCases/GetBills";
import { MarkBillPaid } from "../../../application/useCases/MarkBillPaid";
import { CreateBill } from "../../../application/useCases/CreateBill";
import { PayBillWithPDA } from "../../../application/useCases/PayBillWithPDA";
import { GetBillById } from "../../../application/useCases/GetBillById";
import { GetCargoCategories } from "../../../application/useCases/GetCargoCategories";
import { CreateCargoCategory } from "../../../application/useCases/CreateCargoCategory";
import { UpdateCargoCategory } from "../../../application/useCases/UpdateCargoCategory";
import { CreateRazorpayOrder } from "../../../application/useCases/CreateRazorpayOrder";
import { VerifyRazorpayPayment } from "../../../application/useCases/VerifyRazorpayPayment";
import { GetBillTransactions } from "../../../application/useCases/GetBillTransactions";
import { GetOverdueStatus } from "../../../application/useCases/GetOverdueStatus";

import { ActivityController } from "../../../presentation/controllers/ActivityController";
import { ChargeController } from "../../../presentation/controllers/ChargeController";
import { CargoCategoryController } from "../../../presentation/controllers/CargoCategoryController";
import { BillingController } from "../../../presentation/controllers/BillingController";

export const createBillingFactory = (repositories: Repositories, services: Services, appConfig: IConfigService) => {
  const getActivitiesUseCase = new GetActivities(repositories.activityRepository);
  const createActivityUseCase = new CreateActivity(repositories.activityRepository);
  const updateActivityUseCase = new UpdateActivity(repositories.activityRepository);
  const getChargesUseCase = new GetCharges(repositories.chargeRepository);
  const createChargeUseCase = new CreateCharge(repositories.chargeRepository);
  const getChargeHistoryUseCase = new GetChargeHistory(repositories.chargeHistoryRepository);
  const updateChargeRateUseCase = new UpdateChargeRate(repositories.chargeRepository, eventBus);
  const getBillsUseCase = new GetBills(repositories.billRepository);
  const markBillPaidUseCase = new MarkBillPaid(repositories.billRepository);
  const createBillUseCase = new CreateBill(repositories.billRepository);
  
  const payBillWithPDAUseCase = new PayBillWithPDA(
    repositories.billRepository,
    repositories.pdaRepository,
    eventBus,
    services.notificationService,
    appConfig,
    repositories.billTransactionRepository
  );
  
  const getBillByIdUseCase = new GetBillById(repositories.billRepository);
  const getCargoCategoriesUseCase = new GetCargoCategories(repositories.cargoCategoryRepository);
  const createCargoCategoryUseCase = new CreateCargoCategory(repositories.cargoCategoryRepository);
  const updateCargoCategoryUseCase = new UpdateCargoCategory(repositories.cargoCategoryRepository);
  
  const createRazorpayOrderUseCase = new CreateRazorpayOrder(
    repositories.billRepository,
    repositories.billTransactionRepository,
    services.paymentService
  );
  
  const verifyRazorpayPaymentUseCase = new VerifyRazorpayPayment(
    repositories.billRepository,
    services.paymentService,
    services.notificationService,
    eventBus,
    repositories.billTransactionRepository
  );
  
  const getBillTransactionsUseCase = new GetBillTransactions(repositories.billTransactionRepository);
  const getOverdueStatusUseCase = new GetOverdueStatus(repositories.billRepository);

  const activityController = new ActivityController(
    getActivitiesUseCase,
    createActivityUseCase,
    updateActivityUseCase
  );
  
  const chargeController = new ChargeController(
    getChargesUseCase,
    createChargeUseCase,
    getChargeHistoryUseCase,
    updateChargeRateUseCase
  );
  
  const cargoCategoryController = new CargoCategoryController(
    getCargoCategoriesUseCase,
    createCargoCategoryUseCase,
    updateCargoCategoryUseCase
  );
  
  const billingController = new BillingController(
    getBillsUseCase,
    markBillPaidUseCase,
    createBillUseCase,
    payBillWithPDAUseCase,
    getBillByIdUseCase,
    createRazorpayOrderUseCase,
    verifyRazorpayPaymentUseCase,
    getBillTransactionsUseCase,
    getOverdueStatusUseCase
  );

  return {
    activityController,
    chargeController,
    cargoCategoryController,
    billingController,
    getOverdueStatusUseCase // Exported for routers
  };
};
