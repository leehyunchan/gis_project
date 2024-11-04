/*레이어 생성 및 선택 기능*/
// 지도를 생성하고 초기 위치와 줌 레벨 설정
let map = L.map('map').setView([37.5665, 126.9780], 10); // 서울의 위도, 경도와 줌 레벨(10)을 설정합니다.

// 타일 레이어 추가: 오픈스트리트맵을 사용하여 기본 지도를 설정
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19, // 최대 줌 레벨 설정
   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Mapbox Access Token 설정
let mapboxToken = 'pk.eyJ1IjoiZHJvaGdiYSIsImEiOiJjbTJ3c2Mza3owMXo5MmxvZjc3OG9lMW56In0.-fneoytFl54RT3MvkuAzTQ'; // 여기에 본인의 Mapbox Access Token을 입력하세요.

// 기본 지도 (Street Map) 레이어
let streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// 위성 지도 (Satellite Map) 레이어 - Mapbox의 위성 지도
let satelliteLayer = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`, {
   maxZoom: 19,
   attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
});

// 지형 지도 (Terrain Map) 레이어 - Mapbox의 Outdoors 스타일을 활용
let terrainLayer = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`, {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
 });

// Hillshade 지도 레이어 - OpenTopoMap에서 제공하는 음영기복도 지도
let hillshadeLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>'
 });

// 각 레이어를 합쳐 그룹 레이어 생성
let combinedLayer = L.layerGroup([streetLayer, satelliteLayer, terrainLayer, hillshadeLayer]);
combinedLayer.addTo(map); // 기본적으로 지도에 추가

// 레이어 전환 객체 설정
let baseMaps = {
   "Inital Map": combinedLayer,
   "Street Map": streetLayer,
   "Satellite Map": satelliteLayer,
   "Terrain Map": terrainLayer,
   "Hillshade Map": hillshadeLayer
};

// 레이어 컨트롤을 지도에 추가
L.control.layers(baseMaps).addTo(map);

// 기본 로딩 시 개별 레이어를 지도에서 제거하여 combinedLayer만 남도록 설정
map.eachLayer((layer) => {
   if (layer !== combinedLayer) {
      map.removeLayer(layer);
   }
});

 /*거리 및 면적 측정*/
// 거리 및 면적 측정 도구 추가
const measureControl = new L.Control.Measure({
    position: 'topright', // 측정 도구의 위치
    primaryLengthUnit: 'meters', // 기본 길이 단위
    secondaryLengthUnit: 'kilometers', // 보조 길이 단위
    primaryAreaUnit: 'sqmeters', // 기본 면적 단위
    secondaryAreaUnit: 'hectares' // 보조 면적 단위
 });
 measureControl.addTo(map);
 

/*Geoserver & PostGIS 연동*/
// GeoServer WMS 레이어 추가
const wmsLayer = L.tileLayer.wms('http://localhost:8080/geoserver/gis_project/wms', {
   layers: 'gis_project:markers', // '워크스페이스 이름:테이블 이름' 형식으로 입력
   format: 'image/png',
   transparent: true,
   attribution: "GeoServer"
});

// WMS 레이어를 지도에 추가
wmsLayer.addTo(map);

/* Leaflet Draw 도구 추가 */
const drawControl = new L.Control.Draw({
   draw: {
      polygon: true,
      rectangle: true,
      circle: true
   }
});
map.addControl(drawControl);

//선택된 범위 내 데이터를 가져오는 함수
map.on(L.Draw.Event.CREATED, function(event) {
   const layer = event.layer;
   map.addLayer(layer);

   // 선택한 도형의 좌표를 가져와서 BBOX 형식으로 변환
   const bbox = layer.getBounds().toBBoxString();

   // GeoServer의 WFS 요청 URL 생성
   const wfsUrl = `http://localhost:8080/geoserver/gis_project/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=gis_project:markers&outputFormat=application/json&bbox=${bbox},EPSG:4326`;

   // WFS 요청을 통해 GeoJSON 데이터를 불러와 지도에 표시
   fetch(wfsUrl)
      .then(response => response.json())
      .then(data => {
         if (window.searchLayer) {
            map.removeLayer(window.searchLayer);
         }

         // 검색된 데이터를 지도에 GeoJSON 레이어로 추가
         window.searchLayer = L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
               layer.bindPopup(`<b>Name:</b> ${feature.properties.name}`);
            }
         }).addTo(map);
      })
      .catch(error => console.error('Error fetching WFS data:', error));
});