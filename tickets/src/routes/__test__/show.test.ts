import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('Should return a 404 if the ticket is not found', async () => {
  const id  = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it('Should return a ticket if the ticket is found', async () => {
  const title = 'Concert';
  const price = 20;

  const response = await request(app)
    .post('/aí/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    })
    .expect(201);
  
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);
  
  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});