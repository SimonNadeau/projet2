import { Directive, Renderer, ElementRef, Input } from "@angular/core";

@Directive({
  selector: "[appFocus]"
})
export class FocusDirective {

  public constructor(public renderer: Renderer, public el: ElementRef) {}
  @Input() public set appFocus(value: boolean) {
    if (value) {
      this.renderer.invokeElementMethod(this.el.nativeElement, "focus", []);
    }
  }
}
