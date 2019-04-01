import { Component, OnInit, OnDestroy } from '@angular/core';
import { PortfolioService, FirebaseService, ConsoleService } from '@app/services';
import { Post } from '@app/model/post';
import { Subscription } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit, OnDestroy {

  private psub: Subscription;
  private fsub: Subscription;
  private lastScroll: number;
  public posts: Post[] = [];
  public fetching: boolean = false;

  constructor(
    private portfolio: PortfolioService,
    private firebase: FirebaseService,
    private console: ConsoleService
  ) { }

  ngOnInit() {

    this.psub = this.portfolio.postsUpdated.subscribe(posts => {

      this.lastScroll = window.scrollY;

      this.posts = posts;
      this.fetching = false;

      setTimeout(() => {
        window.scrollTo(0, this.lastScroll);
      }, 1);

    });

    this.console.log('Waiting for permissions...');

    this.fsub = this.firebase.onPermissionsChanged.subscribe(permissions => {

      if ( ! permissions ) return;

      this.console.log('Permissions granted...');

      this.fetchPosts({ visible: true });
      if ( this.fsub && ! this.fsub.closed ) this.fsub.unsubscribe();

    });

  }

  ngOnDestroy() {

    if ( this.psub ) this.psub.unsubscribe();
    if ( this.fsub && ! this.fsub.closed ) this.fsub.unsubscribe();

  }

  public fetchPosts({ visible }: { visible: boolean }): void {

    if ( this.fetching || ! visible || ! this.firebase.hasPermissions ) return;

    this.fetching = this.portfolio.getPosts();

  }

}
