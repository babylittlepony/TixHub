import { Ticket } from "../ticket";

it("implements OCC", async () => {
  const ticket = Ticket.build({
    title: "ARIANA GRENADE CONCERTOOOO",
    price: 91,
    userId: "mamat",
  });
  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 69 });
  secondInstance!.set({ price: 9 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error("Should not reach this error");
});

it("increments the version number when saved", async () => {
  const ticket = Ticket.build({
    title: "ARIANA GRENADE CONCERTOOOO",
    price: 91,
    userId: "mamat",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
