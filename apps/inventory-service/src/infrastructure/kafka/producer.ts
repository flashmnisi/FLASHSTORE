// // apps/inventory-service/src/infrastructure/kafka/producer.ts

// import { OutboxService } from '../outbox/outbox.service';
// import { EVENTS, TOPICS } from '@org/shared-kafka';

// export class InventoryProducer {
//   constructor(
//     private readonly outboxService: OutboxService
//   ) {}

//   async stockReserved(payload: any) {
//     await this.outboxService.write({
//       topic: TOPICS.INVENTORY,
//       event: EVENTS.STOCK_RESERVED,
//       data: payload,
//       key: payload.productId,
//     });
//   }

//   async stockReleased(payload: any) {
//     await this.outboxService.write({
//       topic: TOPICS.INVENTORY,
//       event: EVENTS.STOCK_RELEASED,
//       data: payload,
//       key: payload.productId,
//     });
//   }

//   async stockDeducted(payload: any) {
//     await this.outboxService.write({
//       topic: TOPICS.INVENTORY,
//       event: EVENTS.STOCK_DEDUCTED,
//       data: payload,
//       key: payload.productId,
//     });
//   }

//   async inventoryAdjusted(payload: any) {
//     await this.outboxService.write({
//       topic: TOPICS.INVENTORY,
//       event: EVENTS.INVENTORY_ADJUSTED,
//       data: payload,
//       key: payload.productId,
//     });
//   }
// }