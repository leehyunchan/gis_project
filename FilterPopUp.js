// 필터링 팝업창 열기
function openFilterPopup() {
    document.getElementById('filterPopup').style.display = 'block';
 }
 
 // 필터링 팝업창 닫기
 function closeFilterPopup() {
    document.getElementById('filterPopup').style.display = 'none';
 }

 // 필터링 적용 함수 (기존 코드 유지)
function applyFilter() {
    const name = document.getElementById('filterInput').value;
    map.removeLayer(wmsLayer);
 
    wmsLayer = L.tileLayer.wms('http://localhost:8080/geoserver/gis_project/wms', {
        layers: 'gis_project:markers',
        format: 'image/png',
        transparent: true,
        attribution: "GeoServer",
        CQL_FILTER: `name='${name}'`
    }).addTo(map);
 
    closeFilterPopup(); // 필터링 적용 후 팝업창 닫기
 }
 