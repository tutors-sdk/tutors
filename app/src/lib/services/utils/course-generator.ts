import validCourses from "../../../routes/(time)/gallery/+page";

validCourses;

// const courses = [ 'Workshop 1 & 3',
//     'Semester 2 - Future Work Skills',
//     'Website Development 2',
//     'HCI and Web Design',
//     'Programming Fundamentals 2 - Information Technology',
//     'Agile Software Development',
//     'Web Development',
//     'Mobile Application Development (HDip)',
//     'Higher Diploma in Computer Science 2022',
//     'Web Programming',
//     'Web Development II',
//     'Web Design for eCommerce',
//     "Business Analytics II",
//     "Career Development Skills",
//     "Audio Production",
//     "Professional Communications",
//     "Introdcution to Security & Forensics",
//     "Placement & Project",
//     "Life etc...",
//     "ICT for Forestry",
//     "Network Forensics",
//     "Sem 1 Computing",
//     "Device Forensics",
//     "Operating System Forensics",
//     "SQL",
//     "Programming Fundamentals 1",
//     "Mobile App Development 2022",
//     "File System Forensics",
//     "Developer Operations",
//     "Functional Programming using Haskell",
//     "Database",
//     "Advanced Full Stack Web Development",
//     "Web App Development 2",
//     "Online Forensics",
//     "Project 2 2022",
//     "ICT for Scientists",
//     "Design Patterns",
//     "Semester 1 - Technologische Fähigkeiten",
//     "Computer Systems & Networks",
//     "Software Development Tools",
//     "Workshop 2 & 4",
//     "Software Security",
//     "IoT Protocols and Standards 2022",
//     "Relational Databases",
//     "Mobile Game Development",
//     "Software Testing",
//     "Programming Fundamentals",
//     "Website Development 1",
//     "Data Structures and Algorithms 1"]

    export function randomCourseName(){

        const randomCourseID = validCourses[Math.floor(Math.random() * validCourses.length)];

        return randomCourseID;
    }

    // export function courseID(courseName: string){
    //     function replaceSpacesWithHyphens(input: string): string {
    //         return input.replace(/\s+/g, '-');
    //     }
        
        
    //     const modifiedString = replaceSpacesWithHyphens(courseName);
    //     return modifiedString;
    //     // const randomCourse = randomCourseName();
    //     // const courseId = courseID(randomCourse);
    // }



    
