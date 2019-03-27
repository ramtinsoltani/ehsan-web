import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Log } from '@app/model/console';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {

  public onVisibilityChanged = new Subject<boolean>();
  public onLogsChanged = new Subject<Log[]>();
  private logs: Log[] = [];
  private visibility: boolean = false;

  constructor() { }

  public toggleVisibility(): void {

    this.visibility = ! this.visibility;
    this.onVisibilityChanged.next(this.visibility);

  }

  public log(...messages: any[]): void {

    for ( const message of messages ) {

      this.logs.push({
        error: false,
        message: message + '',
        timestamp: Date.now()
      });

    }

    this.onLogsChanged.next(_.cloneDeep(this.logs));

  }

  public error(...errors: any[]): void {

    for ( const error of errors ) {

      this.logs.push({
        error: true,
        message: error.message + '',
        timestamp: Date.now()
      });

      console.error(error);

    }

    this.onLogsChanged.next(_.cloneDeep(this.logs));

  }

}
