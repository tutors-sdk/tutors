export interface LearningInteraction {
    loid: string,
    courseid: string,
    studentid: string,
    date: Date;
    pageLoads: number;
    timeActive: number;
};

export interface HeatMapSeriesData {
    name: string;
    type: string;
    top: string;
    data: number[][];
    label: { show: boolean; };
};






