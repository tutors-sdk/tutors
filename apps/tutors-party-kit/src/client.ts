import "./styles.css";
import PartySocket from "partysocket";

declare const PARTYKIT_HOST: string;
const output = document.getElementById("app") as HTMLDivElement;

function add(text: string) {
  output.appendChild(document.createTextNode(text));
  output.appendChild(document.createElement("br"));
}

const conn = new PartySocket({
  host: PARTYKIT_HOST,
  room: "tutors-all-course-access"
});

conn.addEventListener("message", (event) => {
  add(`Received -> ${event.data}`);
});

conn.addEventListener("open", () => {
  add("Connected to Tutors Party");
});
