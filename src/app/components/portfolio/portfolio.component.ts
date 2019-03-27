import { Component, OnInit, OnDestroy } from '@angular/core';
import { PortfolioService, FirebaseService } from '@app/services';
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
    private firebase: FirebaseService
  ) { }

  ngOnInit() {

    this.psub = this.portfolio.postsUpdated.subscribe(posts => {

      this.lastScroll = window.scrollY;

      this.posts = posts;
      this.fetching = false;

      setTimeout(() => {
        window.scrollTo(0, this.lastScroll);
      }, 100);

    });

    if ( this.firebase.permissionsCleared ) this.fetchPosts({ visible: true });
    else {

      this.fsub = this.firebase.authenticated.subscribe(() => {

        this.fetchPosts({ visible: true });

      });

    }

  }

  ngOnDestroy() {

    if ( this.psub ) this.psub.unsubscribe();
    if ( this.fsub ) this.fsub.unsubscribe();

  }

  public fetchPosts({ visible }: { visible: boolean }): void {

    if ( this.fetching || ! visible ) return;

    this.fetching = this.portfolio.getPosts();

  }

}
