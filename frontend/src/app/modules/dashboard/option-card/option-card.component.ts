import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-option-card',
  templateUrl: './option-card.component.html',
  styleUrls: ['./option-card.component.scss'],
})
export class OptionCardComponent implements OnInit {

  @Input() image: string;
  @Input() text: string;

  constructor() {}

  ngOnInit(): void {}
}
