import PartySocket from "partysocket";
import type { LoEvent } from "$lib/services/types/presence";
import { getKeys } from "$lib/environment";
import { PUBLIC_party_kit_main_room } from "$env/static/public";
import { writable } from "svelte/store";
import { generateId } from "./generateStudent";

// This store is a list of all students we have recieved events for
export const allStudentsOnlineList = writable<LoEvent[]>([]);

const partyKitServer = getKeys().partyKit.mainRoom;
let partyKitSimulator = <PartySocket>{};

if (PUBLIC_party_kit_main_room !== "XXX") {
  // Create the partykit room
  partyKitSimulator = new PartySocket({
    host: partyKitServer,
    // Make the room unique, otherwise simulations initiated in different browsers will overlap
    room: `tutors-simulator-${generateId()}`
  });
}

// The interface to Partykit
export const partykitGateway = {
  // For each student we see, place their latestEvent in a map,
  allStudentEventMap: new Map<string, LoEvent>(),

  // Keep track of all the latest Los per student in an array.
  allStudentLos: new Array<LoEvent>(),

  // Sen an LoEvent to the partykit serivce
  sendLoEvent(lo: LoEvent) {
    const loJson = JSON.stringify(lo);
    partyKitSimulator.send(loJson);
  },

  startListentingForEvents() {
    // We have a new event, lets make sense of it
    partyKitSimulator.addEventListener("message", (event) => {
      try {
        // deserialize
        const nextStudentEvent = JSON.parse(event.data);
        // Have we seen this student before?
        let studentEvent = this.allStudentEventMap.get(nextStudentEvent.user.id);
        if (!studentEvent) {
          // Nope, new student in the map and in the array
          this.allStudentLos.push(nextStudentEvent);
          this.allStudentEventMap.set(nextStudentEvent.user.id, nextStudentEvent);
        } else {
          // We have seen this student already, refresh our record for this student
          refreshLoEvent(studentEvent, nextStudentEvent);
        }
        // update the store - this is a svelte way of reactively updating an array
        allStudentsOnlineList.set([...this.allStudentLos]);
      } catch (e) {
        console.log(e);
      }
    });
  }
};

// Refresh what we know about the students activity
function refreshLoEvent(loEvent: LoEvent, nextLoEvent: LoEvent) {
  loEvent.loRoute = `https://tutors.dev${nextLoEvent.loRoute}`;
  loEvent.title = nextLoEvent.title;
  loEvent.type = nextLoEvent.type;
  if (nextLoEvent.icon) {
    loEvent.icon = nextLoEvent.icon;
    loEvent.img = undefined;
  } else {
    loEvent.img = nextLoEvent.img;
    loEvent.icon = undefined;
  }
}
