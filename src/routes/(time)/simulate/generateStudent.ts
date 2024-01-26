import type { LoUser } from "$lib/services/types/presence";

// Female first names, selected at random
const femaleFirstNames = ["Ava", "Olivia", "Emma", "Isabella", "Sophia", "Mia", "Amelia", "Harper", "Evelyn", "Abigail", "Emily", "Ella", "Madison", "Scarlett", "Grace"];

// Male first names, selected at random
const maleFirstNames = [
  "Liam",
  "Noah",
  "Jackson",
  "Aiden",
  "Lucas",
  "Oliver",
  "Ethan",
  "Caden",
  "Dean",
  "Elijah",
  "Paul",
  "Raymond",
  "Avery",
  "Benjamin",
  "David",
  "Seamus",
  "Damien",
  "Bradley"
];

// Last names, matched at random with first names
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Jones",
  "Brown",
  "Davis",
  "Miller",
  "Wilson",
  "Moore",
  "Taylor",
  "Anderson",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Martin",
  "Thompson",
  "Garcia",
  "Martinez",
  "Robinson",
  "Clark",
  "Rodriguez",
  "Lewis",
  "Lee",
  "Walker",
  "Hall",
  "Allen",
  "Young",
  "Hernandez",
  "King"
];

// Create a fake student
export function generateStudent(): LoUser {
  // Pick a gender
  const randomGender = Math.random() < 0.5 ? "male" : "female";

  // Get a full name
  let fullName;
  if (randomGender === "male") {
    fullName = `${getRandomFromList(maleFirstNames)} ${getRandomFromList(lastNames)}`;
  } else {
    fullName = `${getRandomFromList(femaleFirstNames)} ${getRandomFromList(lastNames)}`;
  }

  // this is the user
  return {
    fullName: `${fullName}`,
    avatar: getAvatar(randomGender),
    id: generateId() // these are actually Github IDs in the real system
  };
}

function getAvatar(gender: string) {
  // Pick a random image name
  const randomNumber = Math.floor(Math.random() * 16); // Generates a random number between 0 and 15
  const twoDigitString = randomNumber.toString(16).padStart(2, "0"); // Converts the random number to a 2-digit hexadecimal string
  const img = `image-${twoDigitString}.jpg`;
  // Images are stored on a github repo
  if (gender === "male") {
    return `https://github.com/tutors-sdk/tutors-simulator-assets/blob/main/profiles/maleProfiles/${img}/?raw=true`;
  } else {
    return `https://github.com/tutors-sdk/tutors-simulator-assets/blob/main/profiles/femaleProfiles/${img}/?raw=true`;
  }
}

function getRandomFromList(list: any) {
  return list[Math.floor(Math.random() * list.length)];
}

export function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
