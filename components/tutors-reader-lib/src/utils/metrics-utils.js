import { child, get, getDatabase, ref } from "firebase/database";
import { decrypt } from "./auth-utils";
function populateCalendar(user) {
    user.calendarActivity = [];
    const calendar = user.metrics.find((e) => e.id === "calendar");
    if (calendar) {
        for (const [key, value] of Object.entries(calendar)) {
            if (key.startsWith("20")) {
                const dayMeasure = {
                    date: key,
                    dateObj: Date.parse(key),
                    metric: value,
                };
                user.calendarActivity.push(dayMeasure);
            }
        }
    }
}
function populateLabUsage(user, allLabs) {
    user.labActivity = [];
    for (let lab of allLabs) {
        const labActivity = findInUser(lab.title, user);
        user.labActivity.push(labActivity);
    }
}
function findInUser(title, metric) {
    return findInMetrics(title, metric.metrics);
}
function findInMetrics(title, metrics) {
    let result = null;
    for (let metric of metrics) {
        if (metric.id === "ab" || metric.id === "alk" || metric.id === "ideo") {
            // console.log("ignoring spurious data"); as result of bug in types
            // since fixed, but bad data in some user dbs.
        }
        else {
            result = findInMetric(title, metric);
            if (result != null) {
                return result;
            }
        }
    }
    return result;
}
function findInMetric(title, metric) {
    if (title === metric.title) {
        return metric;
    }
    else if (metric.metrics.length > 0) {
        return findInMetrics(title, metric.metrics);
    }
    else {
        return null;
    }
}
function expandGenericMetrics(id, fbData) {
    let metric = {
        id: "",
        metrics: [],
    };
    metric.id = id;
    if (fbData) {
        Object.entries(fbData).forEach(([key, value]) => {
            if (typeof value === "object") {
                metric.metrics.push(expandGenericMetrics(key, value));
            }
            else {
                metric[key] = value;
            }
        });
    }
    return metric;
}
export async function fetchUserById(courseUrl, userId, allLabs) {
    const courseBase = courseUrl.substr(0, courseUrl.indexOf("."));
    const userEmail = decrypt(userId);
    const userEmailSanitised = userEmail.replace(/[`#$.\[\]\/]/gi, "*");
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `${courseBase}/users/${userEmailSanitised}`));
    let user = null;
    if (snapshot.exists()) {
        user = expandGenericMetrics("root", snapshot.val());
        populateCalendar(user);
        if (allLabs) {
            populateLabUsage(user, allLabs);
        }
    }
    return user;
}
export async function fetchAllUsers(courseUrl, allLabs) {
    const courseBase = courseUrl.substr(0, courseUrl.indexOf("."));
    const users = new Map();
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `${courseBase}`));
    if (snapshot.exists()) {
        const genericMetrics = expandGenericMetrics("root", snapshot.val());
        const usage = genericMetrics.metrics[0];
        for (let userMetric of genericMetrics.metrics[1].metrics) {
            if (userMetric.nickname) {
                const user = {
                    userId: userMetric.id,
                    email: userMetric.email,
                    name: userMetric.name,
                    picture: userMetric.picture,
                    nickname: userMetric.nickname,
                    onlineStatus: userMetric.onlineStatus,
                    id: "home",
                    title: userMetric.title,
                    count: userMetric.count,
                    last: userMetric.last,
                    duration: userMetric.duration,
                    metrics: userMetric.metrics,
                    labActivity: [],
                    calendarActivity: [],
                };
                if (user.onlineStatus == undefined) {
                    user.onlineStatus = "online";
                }
                populateCalendar(user);
                if (allLabs) {
                    populateLabUsage(user, allLabs);
                }
                users.set(user.nickname, user);
            }
        }
    }
    return users;
}
//# sourceMappingURL=metrics-utils.js.map