import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {
  private appClosing = false;
  constructor() { }
  closeApp(): void {
    this.appClosing = true;
    history.replaceState(null, '', '/exit');
    window.close();
  }

  shouldCloseApp(): boolean {
    return this.appClosing;
  }
}
