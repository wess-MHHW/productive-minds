import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Category } from '../../../../interfaces/category';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent {
  @Input() options!: Array<Category> | undefined;
  @Input() selected!: Category | undefined;
  @ViewChild('dropdownContainer')
  dropdownContainer!: ElementRef;
  @Output() selectedChange: EventEmitter<Category | undefined> =
    new EventEmitter<Category | undefined>();

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (
      this.show &&
      !this.dropdownContainer.nativeElement.contains(event.target)
    ) {
      this.show = false;
    }
  }
  show: boolean = false;
  display(category?: Category) {
    if (category) {
      this.selected = category;
      this.selectedChange.emit(category);
    }
    this.show = !this.show;
  }
}
