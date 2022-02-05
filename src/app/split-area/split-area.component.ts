import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-split-area',
  templateUrl: './split-area.component.html',
  styleUrls: ['./split-area.component.css']
})
export class SplitAreaComponent implements OnInit, AfterViewInit {

  // private el: HTMLElement | null = new HTMLElement();

  private isDragging = false;

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.configureDraggable();
  }


  public configureDraggable() {
    const splitter = document.getElementById('splitter') as HTMLElement;
    const rightSection = document.getElementById('right-section') as HTMLElement;
    const parent = splitter.parentElement as HTMLElement;

    let mouseDown = fromEvent<MouseEvent>(splitter, 'mousedown', { capture: false });
    let mouseMoves = fromEvent<MouseEvent>(parent, 'mousemove', { capture: false });
    let mouseUp = fromEvent<MouseEvent>(splitter, 'mouseup', { capture: false });

    let x = 0;
    let rightWidth = 0;
    let rightWidth2: string;

    mouseDown.subscribe(e => {
      this.isDragging = true;
      x = e.clientX
      // this.renderer.setStyle(rightSection, 'width', '50%');

      const rightWidth =parseFloat( (window.getComputedStyle(rightSection).width).split('px')[0]);
      const parentWidth = parseFloat((window.getComputedStyle(parent).width).split('px')[0]);
      
      console.log(rightWidth)
      console.log(parentWidth)

      console.log('mouse down');
    });

    mouseMoves.subscribe(e => {
      if (this.isDragging) {
        const dx = e.clientX - x;
        // rightWidth = rightSection.getBoundingClientRect().width;
        // rightWidth2 = rightSection.style.width;

        // const rightWidthPercentage = parseFloat(rightWidth2.split('%')[0]);
        // const newRightWidthPercentage = ((rightWidth - dx) / rightWidth) * rightWidthPercentage;

        // rightSection.style.width = newRightWidthPercentage + '%';
        // console.log(window.getComputedStyle(rightSection).width);
        const rightWidth =parseFloat( (window.getComputedStyle(rightSection).width).split('px')[0]);
        const parentWidth = parseFloat((window.getComputedStyle(parent).width).split('px')[0]);
        
        const newWidth = (100*(rightWidth - dx)/parentWidth) + '%';
        console.log(rightWidth + ';' + dx + ';' + parentWidth + ';' + newWidth)
        this.renderer.setStyle(rightSection, 'width', newWidth);
        // console.log(window.getComputedStyle(rightSection).width);
        x = e.clientX;
      }
    });

    mouseUp.subscribe(e => {
      this.isDragging = false;
      x = 0;
      console.log('mouse up');
    })

  }
}
