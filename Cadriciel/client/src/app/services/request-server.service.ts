import { Injectable } from "@angular/core";
import { Http, Response} from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";

const URL: string = ("http://localhost:3000/");
@Injectable()
export class RequestServerService {

  public constructor(private _http: Http) {}

  public get<T>(route: string): Observable<T> {
    return this._http.get(URL + route)
                .map((res: Response) => res.json() as T);
  }
  public getWithParam<T, S>(route: string, obj: S): Observable<T> {
    return this._http.post(URL + route + obj, {})
                .map((res: Response) => res.json() as T);
  }
  public delete(route: string, id: string): Observable<Response> {
    return this._http.delete(URL + route + id, {} );
  }

  public add<T>(route: string, obj: T): Observable<Response> {
    return this._http.post(URL + route, obj, {} );
  }

  public update<T>(route: string, id: string, obj: T ): Observable<Response> {
    return this._http.put(URL + route + id, obj, {});
  }

  public updateTimePlayed<T>(route: string, id: string, obj: T ): Observable<Response> {
    return this._http.put(URL + route + id, obj, {});
  }
}
