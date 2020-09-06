import request from 'supertest';
import { app } from '../../app';

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
  // Add in a check to make sure a ticket was saved

  await request(app)
  .post('/api/tickets')
  .send({
    title: 'Valid title',
    price: 20,
  })
  .expect(201);
});