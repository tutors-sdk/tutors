// import { getTutorsTimeId } from "../presence";
import type { LoUser } from "../types/presence";


const femaleFirstNames = [
    "Ava","Olivia","Emma",
    "Isabella","Sophia","Mia",
    "Amelia","Harper","Evelyn",
    "Abigail","Emily","Ella",
    "Madison","Scarlett","Grace"
  ];
  
  const malefirstNames = [
    "Liam","Noah","Jackson",
    "Aiden","Lucas","Oliver",
    "Ethan","Caden", "Dean",
    "Elijah","Paul", "Raymond",
    "Avery","Benjamin", "David",
    "Seamus", "Damien", "Bradley"
  ];
  
  const lastNames = [
    "Smith","Johnson","Williams",
    "Jones","Brown","Davis",
    "Miller","Wilson","Moore",
    "Taylor","Anderson","Thomas",
    "Jackson","White","Harris",
    "Martin","Thompson","Garcia",
    "Martinez","Robinson","Clark",
    "Rodriguez","Lewis","Lee",
    "Walker","Hall","Allen",
    "Young","Hernandez","King"
  ];
  
  export function generateMaleTest(): string {
  
  
    const randomFirstName = malefirstNames[Math.floor(Math.random() * malefirstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
    const maleFullName = `${randomFirstName} ${randomLastName}`;
  
    return maleFullName;
  }
  
  function generateFemaleTest(): string {
  
    const randomFirstName = femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
    const femaleFullName = `${randomFirstName} ${randomLastName}`;
  
    return femaleFullName;
  
  }
  
  function generateTestAvatar(gender: string): string {
    const profileDirectory = gender === 'male' ? 'maleProfiles' : 'femaleProfiles';
    const profileImages = ['image1.jpg', 'image2.jpg', 'image3.jpg']; // Add actual image filenames
  
    const randomImage = profileImages[Math.floor(Math.random() * profileImages.length)];
    const avatarUrl = `static/${profileDirectory}/${randomImage}`;
  
    return avatarUrl;
  }
  
  function generateTestNameAndAvatar(): { fullName: string; avatar: string } {
    const randomGender = Math.random() < 0.5 ? 'male' : 'female';
    let fullName, avatar;
  
    if (randomGender === 'male') {
      fullName = generateMaleTest();
    } else {
      fullName = generateFemaleTest();
    }
  
    avatar = generateTestAvatar(randomGender);
  
    return { fullName, avatar };
  }
  
  

  export function getTestUser() {
    const { fullName, avatar } = generateTestNameAndAvatar();
  
    const user = {
      "fullName": `${fullName}`,
      "avatar": `${avatar}`,
      "id": "1ab5b1b5-1be1-439b-98b6-e968a194d351"
    };
  
    return user;
  }
  