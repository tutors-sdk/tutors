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

// TODO fix this to be more dynamic
function generateAvatar(gender: string): string {
  const profileDirectory = gender === 'male' ? 'maleProfiles' : 'femaleProfiles';
  const profileImages = ['image1.jpg', 'image2.jpg', 'image3.jpg']; // Add actual image filenames

  const randomImage = getRandomFromList(profileImages);
  const avatarUrl = `static/${profileDirectory}/${randomImage}`;

  return avatarUrl;

  return avatarUrl;
}
