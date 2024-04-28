import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'address-search',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './address-search.component.html',
  styleUrl: './address-search.component.scss'
})
export class AddressSearchComponent {
  searchForm : FormGroup;

  @Output() searchEventEmit: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private fb: FormBuilder,
  ){
    this.searchForm = this.fb.group({
      searchText: ['', Validators.required]
    });
  }

  searchEvent() {
    this.searchEventEmit.emit(this.searchForm.controls['searchText'].value);
  }
}
