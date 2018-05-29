import { Request, Response } from "express";
import * as mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { injectable } from "inversify";

const DB_NAME: string = "thebigdb";
const COLLECTION_TRACKS_NAME: string = "tracks";
const URL: string = "mongodb://bigUser:bigUser13@ds121543.mlab.com:21543/" + DB_NAME;

mongoose.connect(URL)
    .catch((err: string) => { console.error(err); });

// Schema list
const trackRecord: mongoose.Schema = new mongoose.Schema(
    {
        playerName: {type: String},
        minutes: {type: String} ,
        seconds: {type: String} ,
        hundredths: {type: String}
    },
    {
        collection: COLLECTION_TRACKS_NAME
    }
);

const trackShema: mongoose.Schema = new mongoose.Schema(
    {
        id: { type: Number },
        name: { type: String, required: true },
        type: { type: String },
        description: { type: String, required: true },
        timePlayed: { type: Number },
        bestTime: [trackRecord],
        nodeArray: { type: [[Number]], required: true }
    },
    {
        collection: COLLECTION_TRACKS_NAME
    }
);

interface TrackDataScrut {
    name: String;
    description: string;
    nodeArray: [[number]];
    timePlayed: number;
}

// Model list
const trackData: mongoose.Model<mongoose.Document> = mongoose.model("TrackData", trackShema);

@injectable()
export class DBService {
    public getAllTrack(req: Request, res: Response): mongoose.DocumentQuery<mongoose.Document[], mongoose.Document> {
        return trackData.find();
    }
    public deleteTrack(req: Request, res: Response, id: string): mongoose.Query<void> {
        return trackData.deleteOne({ "_id": new ObjectId(id) }, (obj: Object[]) => []);
    }
    public async addTrack(req: Request, res: Response): Promise<mongoose.Document[]> {
        const newTrack: TrackDataScrut[] = [{   name: req.body.name,
                                                description: req.body.description,
                                                nodeArray: req.body.nodeArray,
                                                timePlayed: 0}];

        return trackData.insertMany(newTrack);
    }
    public updateTrack(req: Request, res: Response, id: string): mongoose.Query<void> {

        return trackData.update({ "_id": new ObjectId(id) },
                                { $set: { name: req.body.name, description: req.body.description, nodeArray: req.body.nodeArray } });
    }

    public updateResult(req: Request, res: Response, id: string): mongoose.Query<void> {

        return trackData.update({ "_id": new ObjectId(id) },
                                { $set: { bestTime: req.body.bestTime } });
    }

    public updateTimePlayed(req: Request, res: Response, id: string): mongoose.Query<void> {

        return trackData.update({ "_id": new ObjectId(id) },
                                { $set: { timePlayed: req.body.timePlayed } });
    }
}
