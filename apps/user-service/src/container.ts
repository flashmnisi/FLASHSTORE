// apps/user-service/src/container.ts


import { UserService } from './application/services/user.service';
import { AuthService } from './application/services/auth.service';
import { AddressService } from './application/services/address.service';
import { OutboxService } from './infrastructure/outbox/outbox.service';
import logger from '@org/shared-logger';
import { OutboxRepositoryImpl } from './infrastructure/persistence/repositories/outbox.repository.impl';
import { UserRepositoryImpl } from './infrastructure/persistence/repositories/user.repository.impl';

// Repositories
const userRepository = new UserRepositoryImpl();
const outboxRepository = new OutboxRepositoryImpl();

export const outboxService = new OutboxService(outboxRepository);
export const authService = new AuthService(userRepository, outboxService);
export const addressService = new AddressService(userRepository);
export const userService = new UserService(userRepository, outboxService);



logger.info('✅ Dependency Injection Container initialized');