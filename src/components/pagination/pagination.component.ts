import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() numberOfPages: number = NaN;

  protected pagesToShow: (number | string)[] = [];
  protected currentPage: number = 1;
  private activatedRouteSubscription: Subscription | undefined;
  private static pageQueryParamsIdentifier: string = 'p';

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      const page = Number(queryParams[PaginationComponent.pageQueryParamsIdentifier]);

      if (isNaN(page)) {
        this.resetPagination();
      } else {
        this.setPage(page);
      }

      this.pagesToShow = this.pageNumbersToShow();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['numberOfPages']) {
      this.pagesToShow = this.pageNumbersToShow();
    }
  }

  ngOnDestroy(): void {
    this.activatedRouteSubscription?.unsubscribe();
  }

  pageNumbersToShow(): (number | string)[] {
    if (isNaN(this.numberOfPages)) {
      return [];
    }
    const visiblePages = [];
    const maxVisiblePages = 5; // Nombre de pages visibles avant d'utiliser les ellipses

    if (this.numberOfPages <= maxVisiblePages) {
      for (let i = 1; i <= this.numberOfPages; i++) {
        visiblePages.push(i);
      }
    } else {
      if (this.currentPage <= maxVisiblePages - 2) {
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          visiblePages.push(i);
        }
        visiblePages.push('...');
        visiblePages.push(this.numberOfPages);
      } else if (this.currentPage >= this.numberOfPages - maxVisiblePages + 3) {
        visiblePages.push(1);
        visiblePages.push('...');
        for (let i = this.numberOfPages - maxVisiblePages + 2; i <= this.numberOfPages; i++) {
          visiblePages.push(i);
        }
      } else {
        visiblePages.push(1);
        visiblePages.push('...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          visiblePages.push(i);
        }
        visiblePages.push('...');
        visiblePages.push(this.numberOfPages);
      }
    }

    return visiblePages;
  }

  resetPagination(): void {
    this.currentPage = 1;

    // Only set p=1 if p exists in queryParams, otherwise lets avoid adding p query for page 1
    if (this.activatedRoute.snapshot.queryParams['p']) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          p: this.currentPage
        },
        queryParamsHandling: 'merge'
      });
    }


    this.cdr.detectChanges();
  }

  private setPage(page: number): void {
    this.currentPage = page;
    this.cdr.detectChanges();
  }
}
