import path from 'path-browserify';
export function injectCourseUrl(lo, url) {
    if (lo.route)
        lo.route = lo.route.replace('{{COURSEURL}}', url);
    if (lo.img)
        lo.img = lo.img.replace('{{COURSEURL}}', url);
    if (lo.video)
        lo.video = lo.video.replace('{{COURSEURL}}', url);
    if (lo.pdf)
        lo.pdf = lo.pdf.replace('{{COURSEURL}}', url);
    if (lo.los) {
        lo.los.forEach((lo) => {
            injectCourseUrl(lo, url);
        });
    }
}
export function flattenLos(los) {
    let result = [];
    los.forEach((lo) => {
        result.push(lo);
        if (lo.los)
            result = result.concat(flattenLos(lo.los));
    });
    return result;
}
function removeLastDirectory(the_url) {
    var the_arr = the_url.split('/');
    the_arr.pop();
    return the_arr.join('/');
}
export function removeLeadingHashes(str) {
    if (str.includes('#')) {
        const i = str.lastIndexOf('#');
        str = str.substr(str.lastIndexOf('#') + 1);
    }
    return str;
}
export function findCourseUrls(labUrl) {
    let topicUrl = removeLastDirectory(labUrl);
    if (path.basename(topicUrl).startsWith('unit') && topicUrl.includes('topic')) {
        topicUrl = removeLastDirectory(topicUrl);
    }
    const courseUrl = removeLastDirectory(topicUrl);
    return [courseUrl, topicUrl];
}
export function lastSegment(url) {
    var parts = url.split('/');
    var lastSegment = parts.pop() || parts.pop();
    return lastSegment;
}
export function threadLos(parent) {
    parent.los.forEach((lo) => {
        lo.parentLo = parent;
        if (lo.los) {
            threadLos(lo);
        }
    });
}
export function findLos(los, lotype) {
    let result = [];
    los.forEach((lo) => {
        if (lo.type === lotype) {
            result.push(lo);
        }
        if (lo.type == 'unit') {
            result = result.concat(findLos(lo.los, lotype));
        }
    });
    return result;
}
export function findVideoLos(los) {
    let result = [];
    los.forEach((lo) => {
        if (lo.video) {
            result.push(lo);
        }
        if (lo.type == 'unit') {
            result = result.concat(findVideoLos(lo.los));
        }
    });
    return result;
}
export function allLos(lotype, los) {
    let allLos = [];
    for (let topic of los) {
        allLos = allLos.concat(findLos(topic.los, lotype));
    }
    return allLos;
}
export function allVideoLos(los) {
    let allLos = [];
    for (let topic of los) {
        allLos = allLos.concat(findVideoLos(topic.los));
    }
    return allLos;
}
export function fixRoutes(lo) {
    if (lo.route && lo.route[0] == '#') {
        lo.route = lo.route.slice(1);
        lo.route = '/#/' + lo.route;
    }
    if (lo.video && lo.video[0] == '#') {
        lo.video = lo.video.slice(1);
        lo.video = '/#/' + lo.video;
    }
    if (lo.route.endsWith('md') && lo.video) {
        lo.route = lo.video;
    }
}
export function getSortedUnits(los) {
    const allUnits = los.filter((lo) => lo.type == 'unit');
    for (let unit of allUnits) {
        const panelVideos = unit.los.filter((lo) => lo.type == 'panelvideo');
        const panelTalks = unit.los.filter((lo) => lo.type == 'paneltalk');
        const standardLos = unit.los.filter((lo) => lo.type !== 'unit' && lo.type !== 'panelvideo' && lo.type !== 'paneltalk');
        const sortedLos = [];
        sortedLos.push(...panelVideos);
        sortedLos.push(...panelTalks);
        sortedLos.push(...standardLos);
        unit.los = sortedLos;
    }
    return allUnits;
}
//# sourceMappingURL=lo-utils.js.map