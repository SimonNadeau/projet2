import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CrosswordViewComponent } from "./crossword/crossword-view/crossword-view.component";
import { RaceViewComponent } from "./race/race-view/race-view.component";
import { GameComponent } from "./race/game-component/game.component";
import { AdminMenuComponent } from "./admin-menu/admin-menu.component";
import { TrackEditorComponent } from "./race/track-editor/track-editor.component";

const routes: Routes = [
  { path: "crossword-view", component: CrosswordViewComponent },
  { path: "race-view/:name", component: GameComponent},
  { path: "race-view", component: RaceViewComponent },
  { path: "admin", component: AdminMenuComponent },
  { path: "edit/:name", component: TrackEditorComponent},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
