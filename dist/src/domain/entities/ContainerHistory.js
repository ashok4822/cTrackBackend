"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerHistory = void 0;
class ContainerHistory {
    id;
    containerId;
    activity;
    details;
    performedBy;
    timestamp;
    createdAt;
    updatedAt;
    constructor(id, containerId, activity, details, performedBy, timestamp, createdAt, updatedAt) {
        this.id = id;
        this.containerId = containerId;
        this.activity = activity;
        this.details = details;
        this.performedBy = performedBy;
        this.timestamp = timestamp;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.ContainerHistory = ContainerHistory;
//# sourceMappingURL=ContainerHistory.js.map