import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import cert from '@app/config/firebase.cert';
import { Post, PostUrls } from '@app/model/post';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private permissionsAllowed: boolean = false;
  public static readonly POSTS_FETCH_COUNT: number = 5;
  public onPermissionsChanged: BehaviorSubject<boolean> = new BehaviorSubject(this.permissionsAllowed);

  constructor() {

    firebase.initializeApp(cert);

    firebase.auth().onAuthStateChanged(user => {

      if ( ! user ) {

        this.permissionsAllowed = false;
        this.onPermissionsChanged.next(this.permissionsAllowed);
        firebase.auth().signInAnonymously();

      }
      else {

        this.permissionsAllowed = true;
        this.onPermissionsChanged.next(this.permissionsAllowed);

      }

    });

  }

  private getStorageUrl(filename: string): Promise<string> {

    return firebase.storage().ref(filename).getDownloadURL();

  }

  private getBeforeAfterUrls(beforeName: string, afterName: string): Promise<PostUrls> {

    return new Promise((resolve, reject) => {

      Promise.all([
        this.getStorageUrl(beforeName),
        this.getStorageUrl(afterName)
      ])
      .then(urls => {

        resolve({
          beforeUrl: urls[0],
          afterUrl: urls[1]
        });

      })
      .catch(reject);

    });

  }

  public get hasPermissions(): boolean { return this.permissionsAllowed; }

  public getPosts(lastTimestamp?: number, count: number = FirebaseService.POSTS_FETCH_COUNT): Promise<Post[]> {

    return new Promise((resolve, reject) => {

      const posts: Post[] = [];
      // Query posts: sort by timestamp
      let query = firebase.firestore().collection('posts').orderBy('timestamp', 'desc');

      // Query posts: set starting range (if provided)
      if ( lastTimestamp )  {

        query = query.startAt(lastTimestamp);
        count++;

      }

      // Query posts: limit to count
      query = query.limit(count);

      query.get()
      .then(docs => {

        const promises: Promise<PostUrls>[] = [];

        for ( const doc of docs.docs ) {

          // Add each post to temp array
          posts.push({
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            timestamp: doc.data().timestamp,
            beforeUrl: null,
            afterUrl: null
          });

          // Resolve beforeName and afterName to actual URLs
          promises.push(this.getBeforeAfterUrls(doc.data().beforeName, doc.data().afterName));

        }

        return Promise.all(promises);

      })
      .then(urls => {

        // Build the posts object
        for ( let i = 0; i < urls.length; i++ ) {

          posts[i].beforeUrl = urls[i].beforeUrl;
          posts[i].afterUrl = urls[i].afterUrl;

        }

        resolve(posts);

      })
      .catch(reject);

    });

  }

  public getPostsCount(): Promise<number> {

    return new Promise((resolve, reject) => {

      firebase.firestore().collection('metadata').doc('posts').get()
      .then(doc => {

        if ( ! doc.exists ) return reject(new Error('Document does not exist!'));

        resolve(doc.data().count);

      })
      .catch(reject);

    });

  }

}
