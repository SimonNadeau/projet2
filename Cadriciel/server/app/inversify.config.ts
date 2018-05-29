import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Index } from "./routes/index";
import { Routes } from "./routes";
import { LexicalService } from "./lexicalService/lexicalService";
import { DBService } from "./routes/dbService";
import { GridService } from "./routes/gridService";
import { ScoketIOService } from "./socketIO/socketIOService";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);

container.bind(Types.Index).to(Index);

container.bind(Types.LexicalService).to(LexicalService);
container.bind(Types.DBService).to(DBService);
container.bind(Types.GridService).to(GridService);
container.bind(Types.ScoketIOService).to(ScoketIOService);

export { container };
