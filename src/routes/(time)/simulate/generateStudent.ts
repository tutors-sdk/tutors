import type { LoUser } from "$lib/services/types/presence";

const imageNames = [
  "image-00.jpg",
  "image-01.jpg",
  "image-02.jpg",
  "image-03.jpg",
  "image-04.jpg",
  "image-05.jpg",
  "image-06.jpg",
  "image-07.jpg",
  "image-08.jpg",
  "image-09.jpg",
  "image-0a.jpg",
  "image-0b.jpg",
  "image-0c.jpg",
  "image-0d.jpg",
  "image-0e.jpg",
  "image-0f.jpg"
];

// Female first names, selected at random
const femaleFirstNames = [
  "Ava",
  "Olivia",
  "Clodagh",
  "Alka",
  "Emma",
  "Isabella",
  "Sophia",
  "Mia",
  "Amelia",
  "Harper",
  "Evelyn",
  "Abigail",
  "Emily",
  "Ella",
  "Madison",
  "Scarlett",
  "Grace"
];

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
  "Bradley",
  "Rylan"
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
export async function generateStudent(): Promise<LoUser> {
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
    avatar: await (async () => {
      return (await getAvatar(randomGender)) || getDefaultAvatar();
    })(), // Immediately-invoked async function
    id: generateId()
  };
}

// This is the profiles we've already generated
const usedImages: string[] = [];

function fetchImageNames(gender: string): string[] {
  return imageNames;
}

// async function fetchImageNames(gender: string): Promise<string[]> {
// try {
//   const response = await fetch(`https://api.github.com/repos/tutors-sdk/tutors-simulator-assets/contents/profiles/${gender}Profiles`);
//   if (!response.ok) {
//     throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
//   }

//   const res = await response.json();

//   return res.map((img: { download_url: string }) => img.download_url);
// } catch (error) {
//   console.error("Error fetching image names:", (error as Error).message);
//   return [];
// }
//}

function getRandomIndex(max: number): number {
  return Math.floor(Math.random() * max);
}

function getRandomImage(images: string[], gender: string): string | null {
  const availableImages = images.filter((image) => !usedImages.includes(image));

  if (availableImages.length === 0) {
    console.log(`No more available images for ${gender} gender.`);
    return null;
  }

  const randomIndex = getRandomIndex(availableImages.length);
  const selectedImage = availableImages[randomIndex];
  usedImages.push(selectedImage);

  return `/profiles/${gender}Profiles/${selectedImage}`;
}

async function getAvatar(gender: string): Promise<string | null> {
  try {
    if (gender === "male") {
      const maleImageNames = fetchImageNames("male");
      // const maleImageNames = await fetchImageNames("male");
      return getRandomImage(maleImageNames, "male");
    } else {
      const femaleImageNames = fetchImageNames("female");
      //const femaleImageNames = await fetchImageNames("female");
      return getRandomImage(femaleImageNames, "female");
    }
  } catch (error) {
    console.error("Error fetching avatar:", (error as Error).message);
    return null;
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
function getDefaultAvatar(): string {
  return "/profile-placeholder.png";
}
