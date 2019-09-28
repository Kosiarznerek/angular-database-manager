import {IPaginatorState} from '../../../shared/paginator/paginator.component.models';

// Files upload definitions
export interface IFilesUploadDefinition {
  allowUpload: boolean;
  acceptFileTypes: string[];
  maxFileSize: number;
}

// File information interface
export interface IFileInformation {
  id: number;
  name: string;
  deletable: boolean;
}

// File data interface
export interface IFilesData extends IPaginatorState {
  values: IFileInformation[];
}
