import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SpotifyService } from './services/spotify.service';

enum PageState {
  LOADING,
  ERROR,
  LOADED
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  tracks: any[] = [];
  pageStateEnum: typeof PageState = PageState;
  pageState: PageState = this.pageStateEnum.LOADING;
  err: any;

  constructor(private spotifyService: SpotifyService) {}

  public ngOnInit(): void {
    this.spotifyLogin();
    this.getLoggedIn();
    this.getAllTracks();
  }

  private spotifyLogin() {
    this.spotifyService.logIn();
  }

  private getAllTracks(): void {
    this.spotifyService.getAllTracks().subscribe({
      next: (res: any[]): void => {
        this.tracks = res;
        this.pageState = this.pageStateEnum.LOADED;
      },
      error: (err: any): void => {
        this.err = err;
        this.pageState = this.pageStateEnum.ERROR;
      }
    });
  }

  private getLoggedIn(): void {
    this.spotifyService.spotifyToken$.pipe(filter((res: any): boolean => res?.length > 0)).subscribe({
      next: (): void => {
        forkJoin([this.spotifyService.getMe()]).subscribe({
          next: (res: any): void => {
            console.warn(res);
          },
          error: (err: any): void => {
            console.error(err);
          }
        });
      }
    });
  }
}
