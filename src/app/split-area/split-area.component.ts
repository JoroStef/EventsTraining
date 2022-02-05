import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-split-area',
  templateUrl: './split-area.component.html',
  styleUrls: ['./split-area.component.css']
})
export class SplitAreaComponent implements OnInit, AfterViewInit {

  private isDragging = false;
  private mouseDown = false;
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
    let mouseDown = fromEvent<MouseEvent>(this.splitter, 'mousedown', { capture: true });
    let mouseMoves = fromEvent<MouseEvent>(this.parent, 'mousemove', { capture: true });
    let mouseUp = fromEvent<MouseEvent>(window, 'mouseup', { capture: true });

    let x = 0;

    mouseDown.subscribe(e => {
      this.isDragging = true;
      this.mouseDown = true;
      x = e.clientX
    });

    mouseMoves.subscribe(e => {
      if (this.isDragging) {
        this.rightAreaVisible = true;
        const dx = e.clientX - x;

        const rightWidth2 = this.rightSection.offsetWidth as number;
        const leftWidth2 = this.leftSection.offsetWidth as number;
        const parentWidth2 = this.parent.offsetWidth as number;
        const splitterWidth2 = this.splitter.offsetWidth as number;

        this.splitter.style.left = `${this.splitter.offsetLeft + dx}px`;
        const newRightWidth = (100 * (rightWidth2 - dx) / parentWidth2) + '%';
        this.renderer.setStyle(this.rightSection, 'width', newRightWidth);

        x = e.clientX;
      }
    });

    mouseUp.subscribe(e => {
      this.isDragging = false;
      this.mouseDown = false;
      x = 0;
    })

    document.onselectstart = () => {
      return !this.mouseDown;
    }
  }

  public toggleRightSection() {
    this.rightAreaVisible = !this.rightAreaVisible;
  }
}
