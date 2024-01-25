import PartySocket from "partysocket";
import type { LoEvent } from "$lib/services/types/presence";
import { getKeys } from "$lib/environment";
import { PUBLIC_party_kit_main_room } from "$env/static/public";

const partyKitServer = getKeys().partyKit.mainRoom;

let partyKitAll = <PartySocket>{};

if (PUBLIC_party_kit_main_room !== "XXX") {
  partyKitAll = new PartySocket({
    host: partyKitServer,
    room: "tutors-all-course-access"
  });
}

export function simulateLoEvent(lo: LoEvent) {
  const loJson = JSON.stringify(lo);
  partyKitAll.send(loJson);
}
