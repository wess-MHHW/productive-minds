import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StickyWall } from '../../../../interfaces/sticky-wall';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sticky',
  templateUrl: './sticky.component.html',
  styleUrl: './sticky.component.css',
})
export class StickyComponent {
  @Input() sticky!: StickyWall;
  @Input() index!: number;
  state: string = '';
  colors: Array<string> = [
    'rgba(255, 107, 107,0.2)',
    'rgba(218, 119, 242,0.2)',
    'rgb(151, 117, 250,0.2)',
    'rgba(92, 124, 250,0.2)',
    'rgba(102, 217, 232,0.2)',
    'rgba(140, 233, 154,0.2)',
    'rgba(255, 212, 59,0.2)',
    'rgba(255, 146, 43,0.2)',
  ];
  contentControl = new FormControl();
  @Output() edit: EventEmitter<string> = new EventEmitter();
  @Output() delete: EventEmitter<string> = new EventEmitter();

  backgroundColor: string = '';

  ngOnInit() {
    this.backgroundColor = this.colors[this.index % this.colors.length];
  }

  resetSticky() {
    this.state = '';
  }

  deleteSticky() {
    this.delete.emit(this.sticky._id);
  }

  editSticky() {
    this.state = 'edit';
    this.contentControl.setValue(this.sticky.content);
  }

  saveSticky() {
    if (this.contentControl.value.trim().length !== 0) {
      this.state = '';
      this.edit.emit(this.contentControl.value.trim());
    }
  }
}
