import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderStatus, OrderCancelledEvent } from '@e3gtickets/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/Order';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
    },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    data,
    message,
    order,
  };
};

it('Should update the status of the order', async () => {
  const { listener, data, message, order } = await setup();

  await listener.onMessage(data, message);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('Should ack the message', async () => {
  const { listener, data, message } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});