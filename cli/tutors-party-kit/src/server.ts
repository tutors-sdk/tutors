import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly party: Party.Party) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log(`Tutors connection: id: ${conn.id} room: ${this.party.id} url: ${new URL(ctx.request.url).pathname}`);
  }

  onMessage(message: string, sender: Party.Connection) {
    console.log(`connection ${sender.id} sent message: ${message}`);
    this.party.broadcast(message);
  }
}

Server satisfies Party.Worker;
