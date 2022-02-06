import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-split-area',
  templateUrl: './split-area.component.html',
  styleUrls: ['./split-area.component.css']
})
export class SplitAreaComponent implements OnInit, AfterViewInit {

  private isDragging = false;
  public rightAreaVisible = true;

  private splitter: any;
  private rightSection: any;
  private leftSection: any;
  private parent: any;

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.splitter = document.getElementById('splitter') as HTMLElement;
    this.rightSection = document.getElementById('right-section') as HTMLElement;
    this.leftSection = document.getElementById('left-section') as HTMLElement;
    this.parent = this.splitter.parentElement as HTMLElement;

    this.configureDraggable();
  }

  public configureDraggable() {
    let mouseDown = fromEvent<MouseEvent>(this.splitter, 'mousedown', { capture: false });
    let mouseMoves = fromEvent<MouseEvent>(this.parent, 'mousemove', { capture: false });
    let mouseUp = fromEvent<MouseEvent>(this.splitter, 'mouseup', { capture: false });

    let x = 0;

    mouseDown.subscribe(e => {
      this.isDragging = true;
      console.log(window.getComputedStyle(this.leftSection).width)
      console.log(window.getComputedStyle(this.rightSection).width)

      x = e.clientX
    });

    mouseMoves.subscribe(e => {
      if (this.isDragging) {
        this.rightAreaVisible = true;
        const dx = e.clientX - x;
        const rightWidth = parseFloat((window.getComputedStyle(this.rightSection).width).split('px')[0]);
        const leftWidth = parseFloat((window.getComputedStyle(this.leftSection).width).split('px')[0]);
        const parentWidth = parseFloat((window.getComputedStyle(this.parent).width).split('px')[0]);

        const newRightWidth = (100 * (rightWidth - dx) / parentWidth) + '%';
        const newLeftWidth = (100 * (leftWidth + dx) / parentWidth) + '%';

        // this.renderer.setStyle(this.rightSection, 'width', newRightWidth);
        this.renderer.setStyle(this.leftSection, 'width', newLeftWidth);
        console.log(this.leftSection)
        console.log(this.rightSection)

        x = e.clientX;
      }
    });

    mouseUp.subscribe(e => {
      this.isDragging = false;
      x = 0;
    })

  }

  public toggleRightSection() {
    this.rightAreaVisible = !this.rightAreaVisible;

    if (this.rightAreaVisible) {
      this.renderer.setStyle(this.leftSection, 'width', '75%');
    } else {
      this.renderer.setStyle(this.leftSection, 'width', '100%');
    }
  }
}
