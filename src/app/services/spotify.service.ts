import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { expand, reduce } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  readonly baseSpotifyUrl: string = 'https://api.spotify.com/v1';
  spotifyToken$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute) {
    this.subscribeToRoute();
  }

  public getTracks(url?: string): Observable<any> {
    return this.http.get(url && url?.length > 0 ? url : `${this.baseSpotifyUrl}/me/tracks?limit=50`);
  }

  public getAllTracks(): Observable<any[]> {
    return this.getTracks().pipe(
      expand((data: any): Observable<any> => (data.next === null ? EMPTY : this.getTracks(data.next))),
      reduce((acc: any[], val: any): any[] => {
        // eslint-disable-next-line no-param-reassign
        acc = [...acc, ...val.items];
        return acc;
      }, [])
    );
  }

  public getMe(): Observable<any> {
    return this.http.get(`${this.baseSpotifyUrl}/me`);
  }

  public getPlayback(): Observable<any> {
    return this.http.get(`${this.baseSpotifyUrl}/me/player`);
  }

  public getAlbums(): Observable<any> {
    return this.http.get(`${this.baseSpotifyUrl}/me/albums`);
  }

  public logIn(): void {
    if (!sessionStorage.getItem('interaction-in-progress')) {
      if (!sessionStorage.getItem('spotify-creds')) {
        sessionStorage.setItem('interaction-in-progress', 'true');
        this.initiateRedirect();
      } else {
        this.spotifyToken$.next(JSON.parse(sessionStorage.getItem('spotify-creds') ?? '').access_token);
      }
    }
  }

  public initiateRedirect(): void {
    window.location.href =
      'https://accounts.spotify.com/authorize?client_id=99366e38ebfa41cea0c5e202909be8fd&response_type=token&redirect_uri=http://localhost:4200&scope=user-library-read';
  }

  private subscribeToRoute(): void {
    this.activatedRoute.fragment.subscribe({
      next: (data: string | null): void => {
        if (data) {
          sessionStorage.removeItem('interaction-in-progress');
          const sections: string[] = data?.split('&');
          this.createSessionTokenFromResponseSections(sections);
        }
      }
    });
  }

  private createSessionTokenFromResponseSections(sections: string[]): void {
    const thing: any = {};
    sections.forEach((section: string): void => {
      const split: string[] = section.split('=');
      switch (split[0]) {
        case 'access_token':
          [, thing.access_token] = split;
          break;
        case 'expires_in':
          [, thing.expires_in] = split;
          break;
        default:
      }
    });
    thing.expires_at = new Date().valueOf() + thing.expires_in * 1000;
    sessionStorage.setItem('spotify-creds', JSON.stringify(thing));
    this.spotifyToken$.next(thing.access_token);
    this.router.navigateByUrl('/');
  }

  public getToken(): string {
    return JSON.parse(sessionStorage.getItem('spotify-creds') ?? '{}').access_token ?? '';
  }

  public getExpired(): boolean {
    return JSON.parse(sessionStorage.getItem('spotify-creds') ?? '{}').expires_at < Date.now() ?? true;
  }
}
