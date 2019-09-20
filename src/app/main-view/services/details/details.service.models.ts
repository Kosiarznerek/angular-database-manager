// Detail interface
export interface IDetail {
    displayName: string;
    values: string[] | null;
    subDetails: IDetail[];
}
