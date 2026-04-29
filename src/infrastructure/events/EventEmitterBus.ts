import { EventEmitter } from "events";
import { IEventBus, DomainEvents } from "../../domain/events/IEventBus";

export class EventEmitterBus extends EventEmitter implements IEventBus {
  private static instance: EventEmitterBus;

  private constructor() {
    super();
  }

  public static getInstance(): EventEmitterBus {
    if (!EventEmitterBus.instance) {
      EventEmitterBus.instance = new EventEmitterBus();
    }
    return EventEmitterBus.instance;
  }

  public emit(event: DomainEvents, ...args: any[]): boolean {
    console.log(`[EventBus] Emitting event: ${String(event)}`);
    return super.emit(event, ...args);
  }

  // Support for 'on' method as defined in interface
  public on(event: DomainEvents, listener: (...args: any[]) => void): this {
      return super.on(event, listener);
  }
}

export const eventBus = EventEmitterBus.getInstance();
