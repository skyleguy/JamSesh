import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';

@Injectable()
export class SpotifyInterceptor implements HttpInterceptor {
  constructor(private spotifyService: SpotifyService) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): any {
    if (req.url.includes('https://api.spotify.com')) {
      if (this.spotifyService.getExpired()) {
        this.spotifyService.initiateRedirect();
      } else {
        return next.handle(this.addAuthHeaderToReq(req, this.spotifyService.getToken()));
      }
    }
    return next.handle(req);
  }

  private addAuthHeaderToReq(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
