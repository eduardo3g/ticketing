import { Ticket } from '../Ticket';

it ('Should implement optimistic concurrency control', async (done) => {
  const ticket = await Ticket.build({
    title: 'Concert',
    price: 20,
    userId: '123',
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance?.set({ price: 10 });
  secondInstance?.set({ price: 10 });

  await firstInstance?.save();

  try {
    await secondInstance?.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');
});