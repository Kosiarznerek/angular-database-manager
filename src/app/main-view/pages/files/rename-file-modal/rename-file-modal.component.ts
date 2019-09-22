import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {IFileInformation} from '../../../services/files/files.service.models';

@Component({
  templateUrl: './rename-file-modal.component.html',
  styleUrls: ['./rename-file-modal.component.scss']
})
export class RenameFileModalComponent implements OnInit {

  public newFileName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public file: IFileInformation,
  ) {
  }

  ngOnInit(): void {
    this.newFileName = this.file.name;
  }

}
