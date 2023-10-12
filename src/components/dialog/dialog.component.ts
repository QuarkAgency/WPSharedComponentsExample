import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DialogComponent implements OnInit, OnDestroy {
  @Input() dialogTitle!: string;
  @Input() closeIconClass: string = '';

  @ViewChild('appDialog', { static: true })
  dialog!: ElementRef<HTMLDialogElement>;

  data: any;

  onClose: Subject<void> = new Subject();

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.dialog.nativeElement.addEventListener('close', event => {
      this.onClose.next();
    });
  }

  open(): void {
    this.dialog.nativeElement.showModal();
    this.cdr.detectChanges();
  }

  close(): void {
    this.dialog.nativeElement.close();
    this.cdr.detectChanges();
  }

  getData(): any {
    return this.data;
  }

  setData(data: any, override?: boolean): any {
    if (!this.data || override) {
      this.data = data;
    }
  }

  ngOnDestroy(): void {
    this.dialog.nativeElement.removeEventListener('close', () => { });
  }
}
