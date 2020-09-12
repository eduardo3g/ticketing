import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';

jest.mock('../../nats-wrapper');

it('Should have a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});
  
  expect(response.status).not.toEqual(404);
});

it('Should only be accessed if the user is logged in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});

it('Should return a status different of 401 if user is authenticated', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('Should return an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10
    })
    .expect(400);
});

it('Should return an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Valid title',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Valid title',
    })
    .expect(400);  
});

it('Should create a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'Valid title';

  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title,
    price: 20,
  })
  .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});