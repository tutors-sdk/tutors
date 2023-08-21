"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidCourseName = exports.readAllCourseIds = exports.readVisits = exports.readValue = exports.deleteNode = exports.initFirebase = void 0;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const database_1 = require("firebase/database");
const axios_1 = __importDefault(require("axios"));
async function initFirebase(keys) {
    try {
        if (keys.apiKey !== "XXX") {
            (0, app_1.initializeApp)(keys);
            const auth = (0, auth_1.getAuth)();
            await (0, auth_1.signInWithEmailAndPassword)(auth, keys.tutorsStoreId, keys.tutorsStoreSecret);
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.initFirebase = initFirebase;
async function deleteNode(root, url) {
    const db = (0, database_1.getDatabase)();
    let key = "";
    if (root) {
        key = `${root}/${url}`;
    }
    else {
        key = url;
    }
    const obj = (0, database_1.ref)(db, key);
    await (0, database_1.remove)(obj);
    console.log(`deleting: ${key}`);
}
exports.deleteNode = deleteNode;
async function readValue(key) {
    const dbRef = (0, database_1.ref)((0, database_1.getDatabase)());
    const snapShot = await (0, database_1.get)((0, database_1.child)(dbRef, key));
    return snapShot.val();
}
exports.readValue = readValue;
async function readVisits(courseId) {
    try {
        const visits = await readValue(`${courseId}/visits`);
        return parseInt(visits);
    }
    catch (error) {
        console.log(`TutorStore Error: ${error.message}`);
    }
}
exports.readVisits = readVisits;
async function readAllCourseIds(keys, root) {
    const courseList = [];
    const user = (0, auth_1.getAuth)().currentUser;
    if (user) {
        const token = await user.getIdToken(true);
        const url = `${keys.databaseURL}/${root}/.json?auth=${token}&shallow=true`;
        const response = await axios_1.default.get(url);
        const list = await response.data;
        for (const [key, value] of Object.entries(list)) {
            if (value)
                courseList.push(key);
        }
    }
    return courseList;
}
exports.readAllCourseIds = readAllCourseIds;
function isValidCourseName(course) {
    let isValid = true;
    if (course.length > 27 && course[24] == "-" && course[25] == "-") {
        isValid = false;
    }
    else {
        if (course.startsWith("main--") || course.startsWith("master--")) {
            isValid = false;
        }
        if (course.startsWith("deploy-preview")) {
            isValid = false;
        }
    }
    return isValid;
}
exports.isValidCourseName = isValidCourseName;
//# sourceMappingURL=filrebase-utils.js.map