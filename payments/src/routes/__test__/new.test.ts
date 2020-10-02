import request from 'supertest';
import mongoose from 'mongoose';
import { OrderStatus } from '@e3gtickets/common';
import { app } from '../../app';
import { Order } from '../../models/Order';

it('Should return a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'dsadjasljd',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('Should return a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    version: 0,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'dsadjasljd',
      orderId: order.id,
    })
    .expect(401);
});
