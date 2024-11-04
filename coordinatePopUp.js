// 좌표 입력 팝업창 열기
function openCoordinatePopup() {
    document.getElementById('coordinatePopup').style.display = 'block';
 }
 
 // 좌표 입력 팝업창 닫기
 function closeCoordinatePopup() {
    document.getElementById('coordinatePopup').style.display = 'none';
 }
 
 // 좌표 검색 함수
 function searchByCoordinates() {
    const lat = parseFloat(document.getElementById('latitude').value);
    const lng = parseFloat(document.getElementById('longitude').value);
 
    if (isNaN(lat) || isNaN(lng)) {
       alert("올바른 좌표를 입력하세요.");
       return;
    }
 
    if (window.coordinateMarker) {
       map.removeLayer(window.coordinateMarker);
    }
 
    window.coordinateMarker = L.marker([lat, lng]).addTo(map)
       .bindPopup(`Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`)
       .openPopup();
 
    map.setView([lat, lng], 15);
    closeCoordinatePopup();
 }