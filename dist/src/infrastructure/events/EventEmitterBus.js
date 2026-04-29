"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventBus = exports.EventEmitterBus = void 0;
const events_1 = require("events");
class EventEmitterBus extends events_1.EventEmitter {
    static instance;
    constructor() {
        super();
    }
    static getInstance() {
        if (!EventEmitterBus.instance) {
            EventEmitterBus.instance = new EventEmitterBus();
        }
        return EventEmitterBus.instance;
    }
    emit(event, ...args) {
        console.log(`[EventBus] Emitting event: ${String(event)}`);
        return super.emit(event, ...args);
    }
    // Support for 'on' method as defined in interface
    on(event, listener) {
        return super.on(event, listener);
    }
}
exports.EventEmitterBus = EventEmitterBus;
exports.eventBus = EventEmitterBus.getInstance();
//# sourceMappingURL=EventEmitterBus.js.map