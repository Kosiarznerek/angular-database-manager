// File information interface
import {IPaginatorState} from '../../../shared/paginator/paginator.component.models';

export interface IFileInformation {
  id: number;
  name: string;
  deletable: boolean;
}

// File data interface
export interface IFilesData extends IPaginatorState {
  values: IFileInformation[];
}
