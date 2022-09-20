import { child, get, getDatabase, ref, runTransaction } from "firebase/database";
export function getNode(lotype, url, path) {
    let node = "";
    if (lotype !== "course") {
        node = sanatisePath(url, path);
    }
    return node;
}
export function updateLastAccess(root, key, title) {
    updateStr(`${root}/${key}/last`, new Date().toLocaleString());
    updateStr(`${root}/${key}/title`, title);
}
export function updateVisits(root, key, title) {
    updateCountValue(`${root}/${key}/visits`);
}
export function updateCount(root, key, title) {
    updateCountValue(`${root}/${key}/count`);
}
export function updateCountValue(key) {
    const db = getDatabase();
    const dbRef = ref(db, key);
    runTransaction(dbRef, function (count) {
        return (count || 0) + 1;
    });
}
export function updateStr(key, str) {
    const db = getDatabase();
    const dbRef = ref(db, key);
    runTransaction(dbRef, function () {
        return str;
    });
}
export function sanatisePath(url, path) {
    let node = path.replace(url, "");
    node = node.substr(node.indexOf("//") + 2, node.length);
    node = node.replace(/[`#$.\[\]]/gi, "*");
    return node;
}
export function updateCalendar(root) {
    var dateObj = new Date();
    var day = ("0" + dateObj.getDate()).slice(-2);
    var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    var year = dateObj.getFullYear();
    var date = year + "-" + month + "-" + day;
    updateCountValue(`${root}/calendar/${date}`);
}
export async function fetchAllCourseList() {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, "all-course-access"));
    const courseList = [];
    if (snapshot.exists()) {
        const courseObjs = snapshot.val();
        for (const [key, value] of Object.entries(courseObjs)) {
            const course = value;
            course.url = key;
            courseList.push(course);
        }
        courseList.sort((a, b) => Number(b.visits) - Number(a.visits));
    }
    return courseList;
}
//# sourceMappingURL=firebase-utils.js.map