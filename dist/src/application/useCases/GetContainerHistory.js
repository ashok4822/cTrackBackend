"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetContainerHistory = void 0;
const ContainerHistoryMapper_1 = require("../mappers/ContainerHistoryMapper");
class GetContainerHistory {
    historyRepository;
    constructor(historyRepository) {
        this.historyRepository = historyRepository;
    }
    async execute(containerId) {
        const history = await this.historyRepository.findByContainerId(containerId);
        return ContainerHistoryMapper_1.ContainerHistoryMapper.toCollectionResponseDto(history);
    }
}
exports.GetContainerHistory = GetContainerHistory;
//# sourceMappingURL=GetContainerHistory.js.map