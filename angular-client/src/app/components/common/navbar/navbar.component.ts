import {Component, inject, Input, OnInit} from "@angular/core";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {RouterLink} from "@angular/router";
import {NgClass} from "@angular/common";
import {of} from "rxjs";

export enum ItemsJustification {
  center = 'justify-content-center',
  end = 'justify-content-end',
  start = 'justify-content-start',
  between = 'justify-content-between',
  around = 'justify-content-around',
  evenly = 'justify-content-evenly'
}

export class NavBarItem {
  title: string = "";
  routerLink: string = "";
  href: string = "";
  onClick: Function | undefined = undefined;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private offcanvasService: NgbOffcanvas = inject(NgbOffcanvas);
  @Input() showBrand: boolean = false;
  @Input() brandLink: string = "/";
  @Input() floatingNavbar: boolean = false;
  @Input() collapse: boolean = false;
  @Input() navBarItems: NavBarItem[] = [];
  @Input() itemsJustification: ItemsJustification = ItemsJustification.between;
  @Input() backgroundColor: string = "";
  @Input() itemsColor: string = "";
  @Input() itemsTitleFontSize: string = "";
  @Input() itemsIconFontSize: string = "";

  ngOnInit(): void {
  }

  handleClick(onClickFn: Function | undefined): void {
    if (onClickFn) {
      onClickFn();
    }
    this.offcanvasService.dismiss();
  }

  onClickCollapsedNav(content: any) {
    this.offcanvasService.open(content, {position: "end", panelClass: "text-dark"});
  }
}
