import mongoose, {Schema, Document} from 'mongoose';
import {IOrder} from '../type/Params';

const orderSchema: Schema<IOrder> = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {type: String, required: true},
        quantity: {type: Number, required: true},
        price: {type: Number, required: true},
        image: {type: String, required: false},
      },
    ],
    shippingAddress: {
      name: {type: String, required: true},
      surname: {type: String},
      phone: {type: String, required: true},
      city: {type: String, required: true},
      houseNo: {type: String, required: true},
      streetName: {type: String, required: true},
      postalCode: {type: String, required: true},
      country: {type: String, required: true},
    },
    paymentMethod: {type: String, required: true},
    paymentStatus: {type: String, default: 'Pending'},
    isPaid: {type: Boolean, default: false},
    paidAt: {type: Date},
    isDelivered: {type: Boolean, default: false},
    deliveredAt: {type: Date},
    deliveryOption: {type: String, required: true},
    itemsPrice: {type: Number, required: true},
    shippingPrice: {type: Number, required: true},
    totalPrice: {type: Number, required: true},

    paymentData: {
      paymentIntentId: {type: String},
    },
  },
  {timestamps: true},
);

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
// import mongoose, {Schema} from 'mongoose';
// import {IOrder} from '../type/Params';

// const orderSchema: Schema<IOrder> = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   orderItems: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true,
//       },
//       name: {
//         type: String,
//         required: true,
//       },

//       quantity: {
//         type: Number,
//         required: true,
//       },
//       price: {
//         type: Number,
//         required: true,
//       },
//       image: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
//   shippingAddress: {
//     name: {
//       type: String,
//       required: true,
//     },
//     city: {
//       type: String,
//       required: true,
//     },
//     country: {
//       type: String,
//       required: true,
//     },
//   },
//   paymentMethod: {
//     type: String,
//     required: true,
//   },
//   paymentStatus: {
//     type: String,
//     default: 'Pending',
//   },
//   isPaid: {
//     type: Boolean,
//     default: false,
//   },
//   paidAt: {
//     type: Date,
//   },
//   isDelivered: {
//     type: Boolean,
//     default: false,
//   },
//   deliveryOption: {
//   type: String,
//   required: true,
// },
//   deliveredAt: {
//     type: Date,
//   },
//   totalPrice: {
//     type: Number,
//     required: true,
//   },
// });

// const Order = mongoose.model<IOrder>('Order', orderSchema);
// module.exports = Order;
