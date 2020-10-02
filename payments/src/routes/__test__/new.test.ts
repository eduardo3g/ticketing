import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

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