const femaleFirstNames = [
  "Ava", "Olivia", "Emma",
  "Isabella", "Sophia", "Mia",
  "Amelia", "Harper", "Evelyn",
  "Abigail", "Emily", "Ella",
  "Madison", "Scarlett", "Grace"
];

const maleFirstNames = [
  "Liam", "Noah", "Jackson",
  "Aiden", "Lucas", "Oliver",
  "Ethan", "Caden", "Dean",
  "Elijah", "Paul", "Raymond",
  "Avery", "Benjamin", "David",
  "Seamus", "Damien", "Bradley"
];

const lastNames = [
  "Smith", "Johnson", "Williams",
  "Jones", "Brown", "Davis",
  "Miller", "Wilson", "Moore",
  "Taylor", "Anderson", "Thomas",
  "Jackson", "White", "Harris",
  "Martin", "Thompson", "Garcia",
  "Martinez", "Robinson", "Clark",
  "Rodriguez", "Lewis", "Lee",
  "Walker", "Hall", "Allen",
  "Young", "Hernandez", "King"
];

const maleProfiles = Object.values(import.meta.glob('@assets/profiles/maleProfiles/*.{png,jpg,jpeg,PNG,JPEG}', { eager: true, as: 'url' }));
const femaleProfiles = Object.values(import.meta.glob('@assets/profiles/femaleProfiles/*.{png,jpg,jpeg,PNG,JPEG}', { eager: true, as: 'url' }));

export function generateUser() {
  const randomGender = Math.random() < 0.5 ? 'male' : 'female';
  let fullName, avatar;

  if (randomGender === 'male') {
    fullName = generateMaleName();
  } else {
    fullName = generateFemaleName();
  }

  avatar = generateAvatar(randomGender);

  const user = {
    "fullName": `${fullName}`,
    "avatar": `${avatar}`,
    "id": generateId()
  };

  return user;
}

export function getRandomFromList(list: any) {
  return list[Math.floor(Math.random() * list.length)];
}

function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateMaleName(): string {
  return `${getRandomFromList(maleFirstNames)} ${getRandomFromList(lastNames)}`;
}

function generateFemaleName(): string {
  return `${getRandomFromList(femaleFirstNames)} ${getRandomFromList(lastNames)}`;
}

function generateAvatar(gender: string): string {
  if (gender === 'male') {
    return getRandomFromList(maleProfiles);
  }
  else {
    return getRandomFromList(femaleProfiles);
  }
}