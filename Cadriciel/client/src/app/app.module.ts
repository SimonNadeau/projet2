  /* tslint:disable: max-line-length */
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { RenderService } from "./render-service/render.service";
import { AppComponent } from "./app.component";
import { GameComponent } from "./race/game-component/game.component";
import { CrosswordViewComponent } from "./crossword/crossword-view/crossword-view.component";
import { RaceViewComponent } from "./race/race-view/race-view.component";
import { GridViewComponent } from "./crossword/grid-view/grid-view.component";
import { TracksComponent } from "./race/tracks/tracks.component";
import { TrackEditorComponent } from "./race/track-editor/track-editor.component";
import { RelevantInformationViewComponent } from "./crossword/relevant-information-view/relevant-information-view.component";
import { CluesViewComponent } from "./crossword/clues-view/clues-view.component";
import { AdminMenuComponent } from "./admin-menu/admin-menu.component";
import { GameConfigurationComponent } from "./crossword/game-configuration/game-configuration.component";
import { HttpModule } from "@angular/http";
import { RequestServerService } from "./services/request-server.service";
import { CrosswordService } from "./services/crossword.service";
import { AdminAddComponent } from "./admin-menu/admin-add/admin-add.component";
import { AdminUpdateComponent } from "./admin-menu/admin-update/admin-update.component";
import { SocketIoService } from "./socketIO/socket-io.service";
import { ConfigurationDifficultyComponent } from "./crossword/game-configuration/configuration-difficulty/configuration-difficulty.component";
import { ConfigurationGameModeComponent } from "./crossword/game-configuration/configuration-game-mode/configuration-game-mode.component";
import { ConfigurationLobbyComponent } from "./crossword/game-configuration/configuration-lobby/configuration-lobby.component";
import { ConfigurationWaitingRoomComponent } from "./crossword/game-configuration/configuration-waiting-room/configuration-waiting-room.component";
import { SelectWordsAndCluesService } from "./services/select-words-and-clues.service";
import { FocusDirective } from "./focus.directive";
import { CluesService } from "./services/clues.service";
import { GridService } from "./services/grid.service";
import {GenerateGridService} from "./services/generate-grid.service";
import {FocusService} from "./services/focus.service";
import {SoundService} from "./services/sound.service";
import {FindWordService} from "./services/find-word.service";
import { EndMenuViewComponent } from "./crossword/end-menu-view/end-menu-view.component";
import { TrackRecordsComponent } from "./race/track-records/track-records.component";
import { TrackResultsComponent } from "./race/track-results/track-results.component";

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        CrosswordViewComponent,
        RaceViewComponent,
        GridViewComponent,
        AdminMenuComponent,
        TracksComponent,
        RelevantInformationViewComponent,
        CluesViewComponent,
        GameConfigurationComponent,
        TracksComponent,
        TrackEditorComponent,
        AdminAddComponent,
        AdminUpdateComponent,
        FocusDirective,
        AdminUpdateComponent,
        ConfigurationDifficultyComponent,
        ConfigurationGameModeComponent,
        ConfigurationLobbyComponent,
        ConfigurationWaitingRoomComponent,
        EndMenuViewComponent,
        TrackRecordsComponent,
        TrackResultsComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        HttpModule
    ],
    providers: [
        RenderService,
        RequestServerService,
        SocketIoService,
        CrosswordService,
        SelectWordsAndCluesService,
        SoundService,
        CluesService,
        GridService,
        GenerateGridService,
        FocusService,
        FindWordService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
