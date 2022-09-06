 // Your access token can be found at: https://cesium.com/ion/tokens.
    // Replace `your_access_token` with your Cesium ion access token.
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZTQ2Yjk0ZS0zNTc4LTQ0NjEtODBhMy01YTEzODA3ZjM5NzkiLCJpZCI6MTA1OTgxLCJpYXQiOjE2NjE0OTQ3OTF9.529u8N4mtczT11-ffMPyNIv3l1SJa1pmgohOReXgZ8g';

    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
    const viewer = new Cesium.Viewer('cesiumContainer', 
    {terrainProvider: Cesium.createWorldTerrain()}
      );    
    // Add Cesium OSM Buildings, a global 3D buildings layer.
    const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());   
    // Fly the camera to San Francisco at the given longitude, latitude, and height.
    // viewer.camera.flyTo({
    //   destination : Cesium.Cartesian3.fromDegrees(121, 23.5, 500),
    //   orientation : {
    //     heading : Cesium.Math.toRadians(0.0),
    //     pitch : Cesium.Math.toRadians(-15.0),
    //   }
    // });


  //   let point = viewer.entities.add({
  //     position: Cesium.Cartesian3.fromDegrees(121, 23.5),
  //     point: {
  //         pixelSize: 10,
  //         color: Cesium.Color.YELLOW,
  //     },
  // });

  import * as flightData from './data.js' 
 
  console.log(flightData.default)
  // const flightData = [{ "longitude": 121.523333, "latitude": 25.15, "height": 3000 }, { "longitude": 120.3508, "latitude": 23, "height": 12000 }]

  const timeSpan = 30;
  const totalSeconds = timeSpan * (flightData.length - 1);
  const start = Cesium.JulianDate.fromIso8601("2022-08-13T21:10:00Z");
  const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
  
  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.timeline.zoomTo(start, stop);
  viewer.clock.multiplier = 10;
  viewer.clock.shouldAnimate = true;

  const positionProperty = new Cesium.SampledPositionProperty();
 

  flightData.default.forEach((item, index) => {
    const time = Cesium.JulianDate.addSeconds(start, index * timeSpan, new Cesium.JulianDate());
    const position = Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude, item.height);

    positionProperty.addSample(time, position);

    viewer.entities.add({
        description: `經度: ${item.longitude}, 緯度: ${item.latitude}, 海拔高度: ${item.height})`,
        position: position,
        point: { pixelSize: 0.1, color: Cesium.Color.ORANGE }
    });

});


async function LoadAirPlaneModel() {
  try {
    const airPlaneId = 1284043;
    const resource = await Cesium.IonResource.fromAssetId(airPlaneId)
    const airplane = {
        //這行不需要
        availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: start, stop: stop })]),
        position: positionProperty,
        model: { uri: resource},
        orientation: new Cesium.VelocityOrientationProperty(positionProperty),
        path: new Cesium.PathGraphics({ width: 3 })
        // path : new Cesium.PolylineGraphics({ width: 30 })
    }
    console.log(airplane)

    
  
    viewer.trackedEntity = viewer.entities.add({
      position: positionProperty,
      point: { pixelSize: 10, color: Cesium.Color.CHARTREUSE }
    });

    // viewer.trackedEntity = viewer.entities.add(airplane);

  }catch (error){
    console.log(error);
  }
}

LoadAirPlaneModel();