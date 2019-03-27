import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Post } from '@app/model/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input('post')
  public post: Post;

  @ViewChild('viewContainer')
  public viewContainer: ElementRef;

  public compareView: boolean = false;
  public fadeBefore: boolean = false;
  public cropperWidth: number = 50;

  constructor() { }

  ngOnInit() {
  }

  public setView(compare: boolean): void {

    this.compareView = compare;

  }

  public toggleFadeView(): void {

    this.fadeBefore = ! this.fadeBefore;

  }

  public getBeforeUrl(): string {

    return `url('${this.post.beforeUrl}')`;

  }

  public slideCropper(event: MouseEvent): void {

    if ( event.buttons !== 1 ) return;

    this.cropperWidth = Math.min((event.offsetX * 100) / this.viewContainer.nativeElement.clientWidth, 100);

  }

}
