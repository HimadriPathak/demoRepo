import { Component } from '@angular/core';


@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})
export class SplashScreenComponent {
  windowWidth: string;
  splashTransition: string;
  opacityChange: number = 1;
  showSplash = true;
  animationType = "slide-left";
  duration = 1;


  ngOnInit(): void {
    setTimeout(() => {
      let transitionStyle = "";
      this.windowWidth = "-" + window.innerWidth + "px";
      transitionStyle = "left " + this.duration + "s";
      
      this.splashTransition = transitionStyle;

      //this.windowWidth = "-" + window.innerWidth + "px";
      setTimeout(() => {
        this.showSplash = !this.showSplash;
      }, this.duration * 1000);
    }, 3000);
  }
}
