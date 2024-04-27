import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GOOGLE_API_KEY } from "../environments/environment";
import { Observable } from "rxjs";


@Injectable({
    providedIn:'root'
})
export class AppService{
    constructor(private httpClient: HttpClient) {
        
    }

    getLatLng(searchText: string) {
        return this.httpClient.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${searchText}&key=${GOOGLE_API_KEY}`)
    }

    getBuildingInsights(location: {lat:number,lng:number}): Observable<any>{
        return this.httpClient.get(
            `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${location.lat}&location.longitude=${location.lng}&requiredQuality=HIGH&key=${GOOGLE_API_KEY}`
        )
    }
}