export interface VideoIdentifier {
    service: string;
    id: string;
}
export interface VideoIdentifiers {
    videoid: string;
    videoIds: VideoIdentifier[];
}
export declare function readVideoIds(): VideoIdentifiers;
