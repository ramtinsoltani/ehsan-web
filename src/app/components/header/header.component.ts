import { Component } from '@angular/core';
import { ConsoleService } from '@app/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  private clicks: number = 0;
  private lastClick: number = 0;

  constructor(
    private console: ConsoleService
  ) { }

  public registerClick(): void {

    let now = Date.now();

    if ( this.lastClick && now - this.lastClick > 2000 ) {

      this.clicks = 1;
      this.lastClick = now;
      return;

    }

    this.clicks++;

    if ( this.clicks === 10 ) {

      this.clicks = 0;
      this.console.toggleVisibility();

    }

  }

}
