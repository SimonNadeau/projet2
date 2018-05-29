import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import Types from "./types";
import { Index } from "./routes/index";
import { LexicalService } from "./lexicalService/lexicalService";
import { DBService } from "./routes/dbService";
import { GridService } from "./routes/gridService";
@injectable()
export class Routes {
    public constructor( @inject(Types.Index) private index: Index,
                        @inject(Types.GridService) private gridService: GridService,
                        @inject(Types.DBService) private dbService: DBService,
                        @inject(Types.LexicalService) private lexicalService: LexicalService) {}

    public get routes(): Router {
        const router: Router = Router();
        router.get("/",
                   (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));
        router.post("/generateGrid/*", (req: Request, res: Response, next: NextFunction) => {
                this.gridService.generateGrid(req.params[0].split("/")[0])
                .then((resolve: {}) => {
                    res.send(JSON.stringify(resolve));
                })
                .catch((err: string) => this.handleServerError(res, err));
            });
        router.get("/getDef/*",
                   async (req: Request, res: Response, next: NextFunction) =>
                   this.lexicalService.getDefinition(req.params[0].split("/")[0], req.params[0].split("/")[1])
                   .then((definition: string) =>  {
                       res.send(definition);
                   })
                   .catch((err: string) => this.handleServerError(res, err)));
        router.get("/getWords/*",
                   (req: Request, res: Response, next: NextFunction) =>
                   res.send(this.lexicalService.getWords(req.params[0].split("/")[0], req.params[0].split("/")[1],
                                                         req.params[0].split("/")[2])));
        // Database different request
        router.get("/db/tracks/list", (req: Request, res: Response) => {
            this.dbService.getAllTrack(req, res)
                .then((docs: Object[]) => res.json(docs))
                .catch((err: string) => this.handleServerError(res, err));
        });

        router.delete("/db/tracks/delete/:id", (req: Request, res: Response) => {
            this.dbService.deleteTrack(req, res, req.params.id)
                .then(() => res.json({}))
                .catch((err: string) => this.handleServerError(res, err));
        });

        router.post("/db/tracks/add", (req: Request, res: Response) => {
            this.dbService.addTrack(req, res)
                .then(() => res.json({}))
                .catch((err: string) => this.handleServerError(res, err));
        });

        router.put("/db/tracks/update/:id", (req: Request, res: Response) => {
            this.dbService.updateTrack(req, res, req.params.id)
                .then(() => res.json({}))
                .catch((err: string) => this.handleServerError(res, err));
        });

        router.put("/db/records/:id", (req: Request, res: Response) => {
            this.dbService.updateResult(req, res, req.params.id)
                .then(() => res.json({}))
                .catch((err: string) => this.handleServerError(res, err));
        });

        router.put("/db/records/timePlayed/:id", (req: Request, res: Response) => {
            this.dbService.updateTimePlayed(req, res, req.params.id)
                .then(() => res.json({}))
                .catch((err: string) => this.handleServerError(res, err));
        });

        return router;
    }
    private handleServerError(response: Response, error: string): void {
        console.error(error);
        response.type("text/plain");
        response.status(500);
        response.send("500 - Server Error");
    }
}
