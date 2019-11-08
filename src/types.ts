export interface ITrack {
    id: string;
    name: string;
    height: number;
}

export interface IItem {
    id: string;
    track: string;
    start: number;
    end: number;
    selected: boolean;
}

export interface IViewItem extends IItem {
    inDanger: boolean;
    selected: boolean;
}

export type DragDirection = "left"|"right"|"both";
export type ItemArea = "leftHandle"|"center"|"rightHandle";
