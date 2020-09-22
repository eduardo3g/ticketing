import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';
import { Order, OrderStatus } from '../../models/Order';

it('Should mark an order as cancelled', async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
  });

  await ticket.save();

  const user = global.signin();

   const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo('Should emit a order cancelled event');