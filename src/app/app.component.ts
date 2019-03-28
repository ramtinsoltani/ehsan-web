import { Component } from '@angular/core';
import { ConsoleService } from '@app/services';
import { Log } from '@app/model/console';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public consoleVisible: boolean = false;
  public logs: Log[] = [];
  public version: string = environment.version;

  constructor(
    private console: ConsoleService
  ) {

    this.console.onVisibilityChanged.subscribe(visibility => {

      this.consoleVisible = visibility;
      window.document.body.classList.add('no-scroll');

    });

    this.console.onLogsChanged.subscribe(logs => {

      this.logs = logs;

    });
    
  }

  public closeConsole(): void {

    this.console.toggleVisibility();
    window.document.body.classList.remove('no-scroll');

  }

  public stopConsoleClose(event: MouseEvent): void {

    event.stopImmediatePropagation();

  }

}
