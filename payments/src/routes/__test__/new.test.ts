import request from 'supertest';
import mongoose from 'mongoose';
import { OrderStatus } from '@e3gtickets/common';
import { app } from '../../app';
import { Order } from '../../models/Order';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

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

it('Should return a 400 when purchasing an cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    price: 20,
    status: OrderStatus.Cancelled,
    version: 0,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'dsadjasljd',
      orderId: order.id,
    })
    .expect(400);
});

it('Should return a 204 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    price: 20,
    status: OrderStatus.Created,
    version: 0,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);
  
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(order.price * 100);
  expect(chargeOptions.currency).toEqual('BRL');
});