// Paginator state interface
export interface IPaginatorState {
    totalPages: number;
    currentPage: number;
    currentPageSize: number;
    totalRecords: number;
    pageSizeOptions: number[];
}
