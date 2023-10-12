import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/components/dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('myDialog', { static: true }) private myDialog!: DialogComponent;

  title = 'test-app';

  anyData: Array<number> = [];
  numberOfPages: number = NaN;
  currentPage: number = 1;

  private activatedRouteSubsription: Subscription | undefined;
  private dialogClosedSubscription: Subscription | undefined;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.anyData = Array.from({ length: 40 }, () => Math.floor(Math.random() * 40));
    this.numberOfPages = this.anyData.length;

    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      this.currentPage = queryParams['p'] ?? 1;
    });

    this.dialogClosedSubscription = this.myDialog.onClose.subscribe(() => {
      alert('Dialog closed do what you want');
    })
  }

  ngOnDestroy(): void {
    this.activatedRouteSubsription?.unsubscribe();
    this.dialogClosedSubscription?.unsubscribe();
  }

  openDialog(): void {
    this.myDialog.open();
  }
}
