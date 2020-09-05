import request from 'supertest';
import { app } from '../../app';

it('Should have a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});
  
  expect(response.status).not.toEqual(404);
});

it('Should only be accessed if the user is logged in', async () => {});

it('Should return an error if an invalid title is provided', async () => {});

it('Should return an error if an invalid price is provided', async () => {});

it('Should create a ticket with valid inputs', async () => {});