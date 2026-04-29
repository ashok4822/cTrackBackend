"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseMessage = void 0;
var ResponseMessage;
(function (ResponseMessage) {
    // Common Success
    ResponseMessage["SUCCESS"] = "Success";
    ResponseMessage["FETCH_SUCCESS"] = "Data fetched successfully";
    ResponseMessage["UPDATE_SUCCESS"] = "Data updated successfully";
    ResponseMessage["CREATE_SUCCESS"] = "Data created successfully";
    ResponseMessage["DELETE_SUCCESS"] = "Data deleted successfully";
    // Auth & Profile
    ResponseMessage["LOGIN_SUCCESS"] = "Login successful";
    ResponseMessage["LOGOUT_SUCCESS"] = "Logged out successfully";
    ResponseMessage["SIGNUP_INITIATED"] = "OTP sent to email. Please verify to complete signup.";
    ResponseMessage["SIGNUP_SUCCESS"] = "User registered successfully";
    ResponseMessage["PASSWORD_UPDATE_SUCCESS"] = "Password changed successfully";
    ResponseMessage["PASSWORD_RESET_LINK_SENT"] = "Password reset link sent to your email";
    ResponseMessage["PASSWORD_RESET_OTP_SENT"] = "Password reset OTP sent to email";
    ResponseMessage["PASSWORD_RESET_SUCCESS"] = "Password reset successfully";
    ResponseMessage["OTP_VERIFIED"] = "OTP verified successfully";
    ResponseMessage["PROFILE_UPDATE_SUCCESS"] = "Profile updated successfully";
    ResponseMessage["PROFILE_IMAGE_UPDATE_SUCCESS"] = "Profile image updated successfully";
    ResponseMessage["USER_UPDATED"] = "User updated successfully";
    ResponseMessage["USER_BLOCK_TOGGLED"] = "User block status toggled successfully";
    ResponseMessage["USER_BLOCKED"] = "User blocked successfully";
    ResponseMessage["USER_UNBLOCKED"] = "User unblocked successfully";
    // Account / PDA
    ResponseMessage["DEPOSIT_SUCCESS"] = "Deposit successful";
    ResponseMessage["PAYMENT_VERIFIED"] = "Payment verified successfully";
    ResponseMessage["BILL_PAID_SUCCESS"] = "Bill paid successfully";
    // Yard / Operations
    ResponseMessage["BLOCK_CREATED"] = "Block created successfully";
    ResponseMessage["BLOCK_UPDATED"] = "Block updated successfully";
    ResponseMessage["CONTAINER_CREATED"] = "Container created successfully";
    ResponseMessage["CONTAINER_UPDATED"] = "Container updated successfully";
    ResponseMessage["CONTAINER_BLACKLISTED"] = "Container blacklisted successfully";
    ResponseMessage["CONTAINER_UNBLACKLISTED"] = "Container unblacklisted successfully";
    ResponseMessage["GATE_OPERATION_SUCCESS"] = "Gate operation recorded successfully";
    ResponseMessage["REQUEST_CREATED"] = "Container request created successfully";
    ResponseMessage["REQUEST_UPDATED"] = "Container request updated successfully";
    ResponseMessage["EQUIPMENT_CREATED"] = "Equipment created successfully";
    ResponseMessage["EQUIPMENT_UPDATED"] = "Equipment updated successfully";
    ResponseMessage["EQUIPMENT_DELETED"] = "Equipment deleted successfully";
    ResponseMessage["VEHICLE_CREATED"] = "Vehicle created successfully";
    ResponseMessage["VEHICLE_UPDATED"] = "Vehicle updated successfully";
    ResponseMessage["VEHICLE_DELETED"] = "Vehicle deleted successfully";
    ResponseMessage["SHIPPING_LINE_CREATED"] = "Shipping line created successfully";
    ResponseMessage["SHIPPING_LINE_UPDATED"] = "Shipping line updated successfully";
    // Billing
    ResponseMessage["BILL_CREATED"] = "Bill created successfully";
    ResponseMessage["ACTIVITY_CREATED"] = "Activity created successfully";
    ResponseMessage["ACTIVITY_UPDATED"] = "Activity updated successfully";
    ResponseMessage["CHARGE_CREATED"] = "Charge created successfully";
    ResponseMessage["CHARGE_UPDATED"] = "Charge updated successfully";
    ResponseMessage["CARGO_CATEGORY_CREATED"] = "Cargo category created successfully";
    ResponseMessage["CARGO_CATEGORY_UPDATED"] = "Cargo category updated successfully";
    // Support
    ResponseMessage["SUPPORT_QUERY_SUCCESS"] = "Query processed successfully";
    ResponseMessage["NOTIFICATION_READ"] = "Notification marked as read";
    ResponseMessage["NOTIFICATION_ALL_READ"] = "All notifications marked as read";
    ResponseMessage["NOTIFICATION_DELETED"] = "Notification deleted successfully";
    // Notification Titles
    ResponseMessage["PAYMENT_SUCCESSFUL_TITLE"] = "Payment Successful";
    ResponseMessage["PAYMENT_SUCCESSFUL_PDA_TITLE"] = "Payment Successful (PDA)";
    ResponseMessage["LOW_PDA_BALANCE_ALERT_TITLE"] = "Low PDA Balance Alert";
    ResponseMessage["REQUEST_STATUS_UPDATED_TITLE"] = "Request Status Updated";
    ResponseMessage["EQUIPMENT_STATUS_UPDATED_TITLE"] = "Equipment Status Updated";
    ResponseMessage["NEW_GATE_MOVEMENT_TITLE"] = "New Gate Movement";
    ResponseMessage["CONTAINER_STATUS_CHANGED_TITLE"] = "Container Status Changed";
    ResponseMessage["NEW_CONTAINER_ADDED_TITLE"] = "New Container Added";
    ResponseMessage["CONTAINER_BLACKLISTED_TITLE"] = "Container Blacklisted";
    ResponseMessage["PENDING_APPROVALS_TITLE"] = "Pending Approvals";
    ResponseMessage["DAMAGED_CONTAINER_TITLE"] = "Damaged Container";
    ResponseMessage["EQUIPMENT_DOWN_TITLE"] = "Equipment Down";
    ResponseMessage["EQUIPMENT_MAINTENANCE_TITLE"] = "Equipment Maintenance";
    // Errors (Generic)
    ResponseMessage["UNAUTHORIZED"] = "Unauthorized";
    ResponseMessage["USER_NOT_FOUND"] = "User not found";
    ResponseMessage["PASSWORD_MISMATCH"] = "Passwords do not match";
    ResponseMessage["NO_FILE_UPLOADED"] = "No image file provided";
    ResponseMessage["FORBIDDEN"] = "Access denied";
    ResponseMessage["NOT_FOUND"] = "Resource not found";
    ResponseMessage["CONTAINER_NOT_FOUND"] = "Container not found";
    ResponseMessage["CONTAINER_REQUEST_NOT_FOUND"] = "Container request not found";
    ResponseMessage["FORBIDDEN_COMPLETE_ONLY"] = "Customers can only mark requests as completed.";
    ResponseMessage["FORBIDDEN_OWN_ONLY"] = "You can only update your own requests.";
    ResponseMessage["AI_CONFIG_ERROR"] = "AI Service Configuration Error";
    ResponseMessage["INTERNAL_SERVER_ERROR"] = "Internal Server Error";
    // Auth Errors
    ResponseMessage["INVALID_CREDENTIALS"] = "Invalid credentials";
    ResponseMessage["USER_ALREADY_EXISTS"] = "User already exists";
    ResponseMessage["GOOGLE_AUTH_FAILED"] = "Failed to authenticate with Google";
    ResponseMessage["UNAUTHORIZED_ROLE"] = "Access denied: Unauthorized role for this portal";
    ResponseMessage["USER_ACCOUNT_BLOCKED"] = "Your account has been blocked. Please contact admin.";
    ResponseMessage["INVALID_REFRESH_TOKEN"] = "Invalid refresh token";
    ResponseMessage["PASSWORDS_DO_NOT_MATCH"] = "Passwords do not match";
    ResponseMessage["OAUTH_USER_PASSWORD_ERROR"] = "Cannot update password for OAuth users";
    ResponseMessage["INCORRECT_CURRENT_PASSWORD"] = "Current password is incorrect";
    // OTP Errors
    ResponseMessage["INVALID_OTP"] = "Invalid OTP";
    ResponseMessage["OTP_EXPIRED"] = "OTP has expired";
    // Billing / PDA Errors
    ResponseMessage["BILL_NOT_FOUND"] = "Bill not found";
    ResponseMessage["BILL_OWNERSHIP_ERROR"] = "Unauthorized: This bill does not belong to you";
    ResponseMessage["BILL_ALREADY_PAID"] = "Bill is already paid";
    ResponseMessage["PDA_INSUFFICIENT_BALANCE"] = "Insufficient balance in PDA";
    ResponseMessage["BILL_STATUS_UPDATE_FAILED"] = "Failed to update bill status";
    ResponseMessage["BILL_ID_REQUIRED"] = "Bill ID is required";
    ResponseMessage["RAZORPAY_ORDER_FAILED"] = "Razorpay Order Creation Failed";
    ResponseMessage["INVALID_PAYMENT_SIGNATURE"] = "Invalid payment signature";
    ResponseMessage["PDA_NOT_FOUND"] = "PDA not found for user";
    ResponseMessage["INSUFFICIENT_FUNDS"] = "Insufficient PDA balance";
    // Operation Errors
    ResponseMessage["BLOCK_NOT_FOUND"] = "Block not found";
    ResponseMessage["BLOCK_FULL"] = "Block is at full capacity";
    ResponseMessage["CONTAINER_OUTSIDE_TERMINAL"] = "Container must be inside terminal for this operation";
    ResponseMessage["SHIPPING_LINE_NOT_FOUND"] = "Shipping Line not found";
    ResponseMessage["VEHICLE_NOT_FOUND"] = "Vehicle not found";
    ResponseMessage["EQUIPMENT_NOT_FOUND"] = "Equipment not found";
    ResponseMessage["CARGO_CATEGORY_NOT_FOUND"] = "Cargo Category not found";
    ResponseMessage["BLOCK_NAME_REQUIRED"] = "Block name is required";
    ResponseMessage["INVALID_CAPACITY"] = "Capacity must be greater than 0";
    ResponseMessage["ACTIVITY_ALREADY_EXISTS"] = "Activity with this code already exists";
    ResponseMessage["INVALID_NAME_LENGTH"] = "Name must be between 3 and 50 characters";
    ResponseMessage["INVALID_PHONE_FORMAT"] = "Invalid phone number format";
    ResponseMessage["INVALID_PASSWORD_FORMAT"] = "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
    // New Tokens & General Errors
    ResponseMessage["TOKEN_MISSING"] = "Refresh token missing";
    ResponseMessage["SOCKET_NOT_INITIALIZED"] = "Socket.io not initialized!";
    ResponseMessage["GOOGLE_ID_TOKEN_FAILED"] = "Failed to retrieve ID token from Google";
    ResponseMessage["INVALID_GOOGLE_PAYLOAD"] = "Invalid Google token payload";
    ResponseMessage["ENTITY_NOT_FOUND_UPDATE"] = "Entity not found for update";
    ResponseMessage["TRANSACTION_NOT_FOUND"] = "Transaction not found";
    ResponseMessage["CONFIG_KEY_MISSING"] = "Configuration key is missing";
    ResponseMessage["CONFIG_KEY_NOT_NUMBER"] = "Configuration key must be a number";
    // PDA / Payments (Additional)
    ResponseMessage["INVALID_AMOUNT"] = "Invalid amount provided";
    ResponseMessage["PDA_ORDER_FAILED"] = "Razorpay PDA Order Creation Failed";
    // Operation Errors (Additional)
    ResponseMessage["VEHICLE_ALREADY_IN_YARD"] = "Vehicle is already in the yard";
    ResponseMessage["CONTAINER_ALREADY_IN_TERMINAL"] = "Container is already inside terminal or in an invalid state";
    ResponseMessage["PENDING_BILLS_ERROR"] = "Cannot gate-out due to pending/overdue bills";
    ResponseMessage["CONTAINER_BLACKLISTED_ERROR"] = "Container is blacklisted";
    ResponseMessage["CHARGE_ALREADY_EXISTS_ERROR"] = "Charge rate already exists for this configuration";
    ResponseMessage["DUPLICATE_DESTUFF_REQUEST"] = "An active destuffing request already exists for this container";
    ResponseMessage["NOT_READY_FOR_DISPATCH_ERROR"] = "Container is allocated to a customer and must be \"Ready for Dispatch\" status before gate-out.";
    // Notifications
    ResponseMessage["NEW_CONTAINER_REQUEST_TITLE"] = "New Container Request";
    ResponseMessage["NEW_CONTAINER_REQUEST_MESSAGE"] = "A new request has been submitted by a customer";
    ResponseMessage["PAYMENT_RECEIVED_MESSAGE"] = "Your payment has been received successfully";
    ResponseMessage["PDA_PAYMENT_PROCESSED_MESSAGE"] = "Your payment has been processed successfully using your PDA balance";
    ResponseMessage["LOW_PDA_BALANCE_MESSAGE"] = "Your PDA balance is low. Please recharge to avoid payment delays.";
    ResponseMessage["GATE_OPERATION_NOT_FOUND"] = "Gate operation not found";
    ResponseMessage["NO_TOKEN"] = "No token provided";
    ResponseMessage["INVALID_TOKEN"] = "Invalid or expired token";
    ResponseMessage["INSUFFICIENT_PERMISSIONS"] = "Access denied: Insufficient permissions";
    ResponseMessage["OVERDUE_BILLS_ERROR"] = "Access Denied: You have overdue bills. Please settle them to access this feature.";
    // History & Audit Actions
    ResponseMessage["ACTION_GATE_IN"] = "Gate In";
    ResponseMessage["ACTION_GATE_OUT"] = "Gate Out";
    ResponseMessage["ACTION_CREATED"] = "Created";
    ResponseMessage["ACTION_BLACKLISTED"] = "Blacklisted";
    ResponseMessage["ACTION_UNBLACKLISTED"] = "Unblacklisted";
    ResponseMessage["ACTION_PROCESSED"] = "Processed";
    ResponseMessage["ACTION_UPDATED"] = "Updated";
    ResponseMessage["DETAILS_GATE_IN"] = "Processed Gate In operation";
    ResponseMessage["DETAILS_GATE_OUT"] = "Processed Gate Out operation";
    ResponseMessage["DETAILS_INITIALIZED"] = "Resource initialized successfully";
    ResponseMessage["DETAILS_BLACKLISTED"] = "Container has been blacklisted";
    ResponseMessage["DETAILS_UNBLACKLISTED"] = "Container has been unblacklisted";
    ResponseMessage["DETAILS_NO_CHANGES"] = "No changes specified";
    // Audit Log Actions
    ResponseMessage["AUDIT_GATE_IN"] = "CONTAINER_GATE_IN";
    ResponseMessage["AUDIT_GATE_OUT"] = "CONTAINER_GATE_OUT";
    ResponseMessage["AUDIT_BLACKLISTED"] = "CONTAINER_BLACKLISTED";
    ResponseMessage["AUDIT_UNBLACKLISTED"] = "CONTAINER_UNBLACKLISTED";
    ResponseMessage["AUDIT_PROFILE_UPDATED"] = "PROFILE_UPDATED";
    ResponseMessage["AUDIT_PASSWORD_UPDATED"] = "PASSWORD_UPDATED";
    ResponseMessage["AUDIT_USER_LOGIN"] = "USER_LOGIN";
    ResponseMessage["AUDIT_USER_LOGIN_GOOGLE"] = "USER_LOGIN_GOOGLE";
    ResponseMessage["AUDIT_USER_CREATED"] = "USER_CREATED";
    ResponseMessage["AUDIT_USER_UPDATED"] = "USER_UPDATED";
    ResponseMessage["AUDIT_CONTAINER_CREATED"] = "CONTAINER_CREATED";
    ResponseMessage["AUDIT_CONTAINER_UPDATED"] = "CONTAINER_UPDATED";
    ResponseMessage["AUDIT_BLOCK_CREATED"] = "BLOCK_CREATED";
    ResponseMessage["AUDIT_BLOCK_UPDATED"] = "BLOCK_UPDATED";
    ResponseMessage["AUDIT_SHIPPING_LINE_CREATED"] = "SHIPPING_LINE_CREATED";
    ResponseMessage["AUDIT_SHIPPING_LINE_UPDATED"] = "SHIPPING_LINE_UPDATED";
    ResponseMessage["AUDIT_EQUIPMENT_CREATED"] = "EQUIPMENT_CREATED";
    ResponseMessage["AUDIT_BILL_PAID"] = "BILL_PAID";
    ResponseMessage["AUDIT_REQUEST_CREATED"] = "REQUEST_CREATED";
    ResponseMessage["AUDIT_REQUEST_UPDATED"] = "REQUEST_UPDATED";
    ResponseMessage["AUDIT_SIGNUP"] = "SIGNUP";
    // Specific Action Labels
    ResponseMessage["ACTION_STUFFING_DISPATCH"] = "Stuffing dispatch";
    ResponseMessage["ACTION_DESTUFFING_DISPATCH"] = "Destuffing dispatch";
    ResponseMessage["ACTION_RAZORPAY_DEPOSIT"] = "Razorpay Deposit";
    ResponseMessage["ACTION_STATUS_CHANGED"] = "Status Changed";
    ResponseMessage["ACTION_LOCATION_UPDATED"] = "Location Updated";
    ResponseMessage["ACTION_SHIFT_OPERATION"] = "Shift Operation";
    ResponseMessage["ACTION_WEIGHT_UPDATED"] = "Weight Updated";
    ResponseMessage["ACTION_SEAL_NUMBER_UPDATED"] = "Seal Number Updated";
    ResponseMessage["ACTION_DAMAGE_STATUS_UPDATED"] = "Damage Status Updated";
    // Yard Actions (Internal/Event-driven)
    ResponseMessage["YARD_ACTION_CREATE"] = "CREATE";
    ResponseMessage["YARD_ACTION_UPDATE"] = "UPDATE";
    ResponseMessage["YARD_ACTION_DELETE"] = "DELETE";
    // Server / Infrastructure
    ResponseMessage["NOT_ALLOWED_BY_CORS"] = "Not allowed by CORS";
    ResponseMessage["SERVER_HEALTHY"] = "Server is healthy";
    ResponseMessage["ONLY_IMAGES_ALLOWED"] = "Only images are allowed";
    // Rate Limiting
    ResponseMessage["TOO_MANY_REQUESTS"] = "Too many requests from this IP, please try again after 15 minutes";
    ResponseMessage["TOO_MANY_LOGIN_ATTEMPTS"] = "Too many login attempts from this IP, please try again after an hour";
    // Resource Types for Audit Logs
    ResponseMessage["RESOURCE_USER"] = "User";
    ResponseMessage["RESOURCE_CONTAINER"] = "Container";
    ResponseMessage["RESOURCE_BLOCK"] = "Block";
    ResponseMessage["RESOURCE_REQUEST"] = "Request";
    ResponseMessage["RESOURCE_BILL"] = "Bill";
    ResponseMessage["RESOURCE_PROFILE"] = "Profile";
    ResponseMessage["RESOURCE_AUTH"] = "Auth";
    ResponseMessage["RESOURCE_SHIPPING_LINE"] = "ShippingLine";
    ResponseMessage["RESOURCE_ACTIVITY"] = "Activity";
    ResponseMessage["RESOURCE_CHARGE"] = "Charge";
    ResponseMessage["RESOURCE_EQUIPMENT"] = "Equipment";
    ResponseMessage["RESOURCE_VEHICLE"] = "Vehicle";
})(ResponseMessage || (exports.ResponseMessage = ResponseMessage = {}));
//# sourceMappingURL=ResponseMessage.js.map