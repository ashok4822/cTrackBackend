"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
const ResponseMessage_1 = require("../constants/ResponseMessage");
class ApiResponse {
    success;
    message;
    data;
    constructor(success, message, data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    static success(data, message = ResponseMessage_1.ResponseMessage.SUCCESS) {
        return new ApiResponse(true, message, data);
    }
    static error(message, data) {
        return new ApiResponse(false, message, data);
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map