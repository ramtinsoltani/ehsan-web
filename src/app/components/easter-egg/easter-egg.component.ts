import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-easter-egg',
  templateUrl: './easter-egg.component.html',
  styleUrls: ['./easter-egg.component.scss']
})
export class EasterEggComponent implements OnInit {

  constructor() {

    window.location.href = 'https://gbksoft.com/blog/why-building-websites-in-wordpress-in-a-bad-idea/';

  }

  ngOnInit() {
  }

}
