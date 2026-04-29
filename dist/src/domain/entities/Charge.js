"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charge = void 0;
class Charge {
    id;
    activityId;
    activityName;
    containerSize;
    containerType;
    rate;
    currency;
    effectiveFrom;
    active;
    cargoCategoryId;
    cargoCategoryName;
    effectiveTo;
    constructor(id, activityId, activityName, containerSize, containerType, rate, currency, effectiveFrom, active, cargoCategoryId, cargoCategoryName, effectiveTo) {
        this.id = id;
        this.activityId = activityId;
        this.activityName = activityName;
        this.containerSize = containerSize;
        this.containerType = containerType;
        this.rate = rate;
        this.currency = currency;
        this.effectiveFrom = effectiveFrom;
        this.active = active;
        this.cargoCategoryId = cargoCategoryId;
        this.cargoCategoryName = cargoCategoryName;
        this.effectiveTo = effectiveTo;
    }
}
exports.Charge = Charge;
//# sourceMappingURL=Charge.js.map