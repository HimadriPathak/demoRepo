import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { App, URLOpenListenerEvent } from '@capacitor/app';
// import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Safai Karamchari';

  // constructor(private router: Router, private zone: NgZone) {
    // console.log("1Slug not present")
    // this.initializeApp();
  // }

//   initializeApp() {
//     App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
//       console.log("2Slug not present")

//         this.zone.run(() => {
//           console.log("3Slug not present")

//             // Example url: https://beerswift.app/tabs/tab2
//             // slug = /tabs/tab2
//             const slug = event.url.split(".app").pop();
//             if (slug) {
//                 this.router.navigateByUrl(slug);
//                 console.log(slug)
//             }else{
//               console.log("final Slug not present")
//               App.exitApp();
//             }
//             // If no match, do nothing - let regular routing
//             // logic take over
//         });
//     });

//     // App.addListener('backButton', ({canGoBack}) => {
//     //   // window.history.back();
//     //   App.exitApp();
//     // });
// }



}
