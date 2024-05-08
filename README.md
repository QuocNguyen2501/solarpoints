# Solarpoints

This project is a simple demonstration showing the simple features of the Google Solar API.
The Google Solar API is a service focused on helping accelerate solar and energy system installations. It is released in 20/07/2018 in the first time.
The Solar API accepts requests for three endpoints:
- `buildingInsights` : This service endpoint returns insights about the location, dimensions, and solar potential of a building (may not work well in VietNam).
- `dataLayers`: This service endpoint returns URLs for raw solar information datasets for an area surrounding a location.
- `geoTiff`: This endpoint fetches rasters with encoded solar information, including a digital surface model, an aerial image, annual and monthly flux maps, and hourly shade.

Currently, this project's only using a small part of `buildingInsights` data to display panels and filter them by segment indexes.

## Install node_modules

Run `npm i` to install node_modules. 

## Add Google API Key
Need to add the restriction for API Key:
- Solar API
- Maps JavaScript API
- Geolocation API
- Geocoding API

Then 
- add API KEY to `index.html`
```
 <script>
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
      v: "weekly",
      key: "GOOGLE_API_KEY"
    });
  </script>
```
- add API KEY to `environment.development.ts` or `environment.production.ts` 


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Test on UI

Try input an address: `12545 Riata Vista Cir, Austin, TX 78727, United States`

![alt text](image.png)

## Donation
If you are interested with my code, you can donate me a coffee via <a href="https://buymeacoffee.com/quocng" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a> . With $5, I have a good breakfast with delicious coffee, it is a great motivation for me to write more code in the future. Thank you.

