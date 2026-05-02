// import { ProcessPaymentDto } from '../dtos/process-payment.dto';
// import { PaymentEntity } from '../../domain/entities/payment.entity';
// import { Money } from '../../domain/value-objects/money.vo';

// export const mapToPaymentEntity = (dto: ProcessPaymentDto): PaymentEntity => {
//   const money = Money.fromDecimal(dto.amount, dto.currency);

//   return new PaymentEntity(
//     '',
//     dto.orderId,
//     dto.userId,
//     money,
//     'pending',
//     dto.paymentMethod,
//     undefined,
//     dto.metadata
//   );
// };