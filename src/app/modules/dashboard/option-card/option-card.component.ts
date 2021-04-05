import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-option-card',
  templateUrl: './option-card.component.html',
  styleUrls: ['./option-card.component.scss'],
})
export class OptionCardComponent implements OnInit {
  // image = 'https://material.angular.io/assets/img/examples/shiba2.jpg';
  // text = 'Hi';

  @Input() image: string;
  @Input() text: string;

  constructor() {}

  ngOnInit(): void {}
}
