export interface LearningInteraction {
    loid: string,
    courseid: string,
    studentid: string,
    date: Date;
    pageloads: number;
    timeactive: number;
};

export interface HeatMapSeriesData {
    name: string;
    type: string;
    top: string;
    data: number[][];
    label: { show: boolean; };
};

export interface LearningObject {
    route: string;
    loTitle: string;
    parentLoTitle: string | undefined;
    date: Date;
    pageLoads: number;
    timeActive: number;
    nickname: string;
};

export interface CalendarMap {
    date: string;
    timeActive: number;
};

// export interface CalendarMapCollection {
//     [key: string]: CalendarMap[];
// };

export interface CalendarMapCollection {
    calendarMaps: CalendarMap[];
};