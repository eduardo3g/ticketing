import request from 'supertest';
import { app } from '../../app';

it('Should return a 201 status code on successfull signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
});

it('Should return a 400 status code with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'invalidmail',
      password: 'password'
    })
    .expect(400);
});

it('Should return a 400 status code with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1'
    })
    .expect(400);
});

it('Should return a 400 status code with missing email and password', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
  })
  .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: '1234'
    })
    .expect(400);
});

it('Should NOT allow duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1234'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1234'
    })
    .expect(400);    
});

it('Should set a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1234'
    })
    .expect(201);
  
    expect(response.get('Set-Cookie')).toBeDefined(); // Check the headers
});