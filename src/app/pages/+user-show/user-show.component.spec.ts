import {Component, DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser/src/dom/debug/by";
import {inject, TestBed, fakeAsync} from "@angular/core/testing";
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {UserShowComponent} from "./user-show.component";
import {CoreModule} from "../../core";
import {UserShowModule} from "./user-show.module";
import {APP_TEST_HTTP_PROVIDERS} from "../../../testing";
import {FollowBtnComponent} from "../../shared/follow-btn/follow-btn.component";
import {MicropostListComponent, UserStatsComponent} from "../../components";

describe('UserShowComponent', () => {

  @Component({
    template: `<router-outlet></router-outlet>`,
  })
  class TestComponent {
  }

  let cmpDebugElement: DebugElement;
  let userStatsDebugElement: DebugElement;
  let followBtnDebugElement: DebugElement;
  let micropostListDebugElement: DebugElement;

  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'users/:id', component: UserShowComponent},
        ]),
        CoreModule,
        UserShowModule,
      ],
      providers: [
        APP_TEST_HTTP_PROVIDERS,
      ],
      declarations: [
        TestComponent,
      ]
    });
  });
  beforeEach(inject([Router], (..._) => [router] = _));
  beforeEach(fakeAsync(() => {
    TestBed.compileComponents().then(() => {
      const fixture = TestBed.createComponent(TestComponent);
      return router.navigate(['/users', '1']).then(() => {
        fixture.detectChanges();
        cmpDebugElement = fixture.debugElement.query(By.directive(UserShowComponent));
        userStatsDebugElement = cmpDebugElement.query(By.directive(UserStatsComponent));
        followBtnDebugElement = cmpDebugElement.query(By.directive(FollowBtnComponent));
        micropostListDebugElement = cmpDebugElement.query(By.directive(MicropostListComponent));
      });
    }).catch(e => console.log(e));
  }));

  it('can be shown', () => {
    expect(cmpDebugElement).toBeTruthy();
    expect(userStatsDebugElement).toBeTruthy();
    expect(userStatsDebugElement.componentInstance.userId).toEqual('1');
    expect(micropostListDebugElement).toBeTruthy();
    expect(micropostListDebugElement.componentInstance.userId).toEqual('1');
    expect(followBtnDebugElement).toBeTruthy();
    expect(followBtnDebugElement.componentInstance.followerId).toEqual('1');
  });

  it('reload user stats when following status was updated', () => {
    const userStats: UserStatsComponent = userStatsDebugElement.componentInstance;
    spyOn(userStats, 'ngOnInit');
    followBtnDebugElement.triggerEventHandler('updated', null);
    expect(userStats.ngOnInit).toHaveBeenCalled();
  });

});
