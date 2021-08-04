/* Node Modules */
import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

/* Components */
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [RouterTestingModule]
  });

  beforeEach(async () => {
    spectator = createComponent();
  });

  it('should create the app', () => {
    expect(spectator.component).toBeTruthy();
  });

  it(`should have as title 'ionic-base'`, () => {
    expect(spectator.component.title).toEqual('ionic-base');
  });

  it('should render title', () => {
    expect(spectator.query('.content span')?.textContent).toContain('ionic-base app is running!');
  });
});
