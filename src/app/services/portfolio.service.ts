import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { BehaviorSubject } from 'rxjs';
import { Post } from '@app/model/post';
import _ from 'lodash';
import { ConsoleService } from './console.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private posts: Post[] = [];
  private postsCount: number = -1;
  public postsUpdated: BehaviorSubject<Post[]> = new BehaviorSubject(this.posts);

  constructor(
    private firebase: FirebaseService,
    private console: ConsoleService
  ) {

    const fsub = this.firebase.onPermissionsChanged.subscribe(permissions => {

      if ( ! permissions ) return;

      this.console.log('Permissions granted, fetching posts count...');

      this.firebase.getPostsCount()
      .then(count => {

        this.postsCount = count;

      })
      .catch(error => this.console.error(error));

      fsub.unsubscribe();

    });

  }

  public getPosts(): boolean {

    if ( this.postsCount === this.posts.length ) return false;

    this.console.log(`Fetching because total posts are ${this.postsCount} while loaded posts are ${this.posts.length}`);

    // Fetch new posts
    this.firebase.getPosts(this.posts.length ? this.posts[this.posts.length - 1].timestamp : undefined)
    .then(posts => {

      // If not the first fetch, delete the first post in the array
      // (since timestamp query is inclusive, it would be a duplicate of the last post in this.posts)
      if ( this.posts.length ) posts.shift();

      // Append posts
      this.posts = _.concat(this.posts, posts);

      this.postsUpdated.next(_.cloneDeep(this.posts));

    })
    .catch(error => this.console.error(error));

    return true;

  }

}
