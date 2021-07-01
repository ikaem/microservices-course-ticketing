// tickets\src\models\__test__\ticket.test.ts

import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  await ticket.save();

  const t1 = await Ticket.findById(ticket.id);
  const t2 = await Ticket.findById(ticket.id);

  t1!.set({ price: 10 });
  t2!.set({ price: 15 });

  await t1!.save();

  //   await t2!.save(); // this should fail bc versions dont match
  /* 
  
  VersionError: No matching document found for id "60d1b229f25fd61d40c3e57c" version 0 modifiedPaths ""
  
      19 |
      20 |   await t1!.save();
      > 21 |   await t2!.save(); // this should fail bc versions dont match
      |             ^
      22 | });
      
      */

  //   expect(t2!.save).toThrow();

  try {
    await t2!.save();
  } catch (err) {
    return done();
    // if we return at this point, there is no error thrown and all is good
  }

  //   this should not be reachable by the code bc we returned in the catch above
  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
