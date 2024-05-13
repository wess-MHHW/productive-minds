import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-base-sticky',
  templateUrl: './base-sticky.component.html',
  styleUrl: './base-sticky.component.css',
})
export class BaseStickyComponent {
  @Input() state: string = '';
  @Output() create: EventEmitter<string> = new EventEmitter();
  contentControl = new FormControl();
  onClick() {
    this.contentControl.setValue('');
    this.state = 'create';
  }

  reset() {
    this.state = '';
  }

  createSticky() {
    if (this.contentControl.value.trim().length !== 0) {
      this.create.emit(this.contentControl.value.trim());
      this.state = '';
    }
  }
}
