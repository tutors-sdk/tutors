import PartySocket from "partysocket";
import type { LoEvent } from "$lib/services/types/presence";
import { getKeys } from "$lib/environment";
import { PUBLIC_party_kit_main_room } from "$env/static/public";
import { writable } from "svelte/store";

export const allStudentsOnline = writable(0);
export const allStudentsOnlineList = writable<LoEvent[]>([]);

const partyKitServer = getKeys().partyKit.mainRoom;

let partyKitSimulator = <PartySocket>{};

if (PUBLIC_party_kit_main_room !== "XXX") {
  partyKitSimulator = new PartySocket({
    host: partyKitServer,
    room: "tutors-simulator-access"
  });
}

export const presenceSimulatorService = {
  studentEventMap: new Map<string, LoEvent>(),
  studentLos: new Array<LoEvent>(),

  courseEventMap: new Map<string, LoEvent>(),
  courseLos: new Array<LoEvent>(),

  allStudentEventMap: new Map<string, LoEvent>(),
  allStudentLos: new Array<LoEvent>(),

  currentUserId: "",

  simulateLoEvent(lo: LoEvent) {
    const loJson = JSON.stringify(lo);
    partyKitSimulator.send(loJson);
  },

  startSimulatorPresenceService() {
    partyKitSimulator.addEventListener("message", (event) => {
      try {
        const nextStudentEvent = JSON.parse(event.data);
        let studentEvent = this.allStudentEventMap.get(nextStudentEvent.user.id);
        if (!studentEvent) {
          this.allStudentLos.push(nextStudentEvent);
          this.allStudentEventMap.set(nextStudentEvent.user.id, nextStudentEvent);
        } else {
          refreshLoEvent(studentEvent, nextStudentEvent);
        }
        this.allStudentLos = [...this.allStudentLos];
        allStudentsOnlineList.set([...this.allStudentLos]);
        allStudentsOnline.set(this.allStudentLos.length);
      } catch (e) {
        console.log(e);
      }
    });
  }
};

function refreshLoEvent(loEvent: LoEvent, nextLoEvent: LoEvent) {
  loEvent.loRoute = `https://tutors.dev${nextLoEvent.loRoute}`;
  loEvent.title = nextLoEvent.title;
  if (nextLoEvent.icon) {
    loEvent.icon = nextLoEvent.icon;
    loEvent.img = undefined;
  } else {
    loEvent.img = nextLoEvent.img;
    loEvent.icon = undefined;
  }
}
