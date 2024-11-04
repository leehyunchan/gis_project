// 주소를 좌표로 변환하는 지오코딩 함수
function geocodeAddress() {
    const address = document.getElementById('addressInput').value;
    if (!address) {
        alert("주소를 입력하세요.");
        return;
    }

    // Mapbox 지오코딩 API 요청 URL
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}&language=ko`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].center;
                // 검색된 위치로 지도 이동 및 마커 추가
                L.marker([lat, lng]).addTo(map)
                    .bindPopup(`<b>${address}</b><br>Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`)
                    .openPopup();
                map.setView([lat, lng], 15);
            } else {
                alert("검색 결과가 없습니다.");
            }
        })
        .catch(error => console.error("Geocoding error:", error));

    closeGeocodePopup(); // 검색 후 팝업 닫기
}

// 좌표를 주소로 변환하는 역 지오코딩 함수
function reverseGeocode(lat, lng) {
    const reverseGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&language=ko`;

    fetch(reverseGeocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                const address = data.features[0].place_name;
                L.popup({ offset: L.point(0, 0) })
                    .setLatLng([lat, lng])
                    .setContent(`<b>주소:</b> ${address}<br>Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`)
                    .openOn(map);
            } else {
                alert("주소를 찾을 수 없습니다.");
            }
        })
        .catch(error => console.error("Reverse geocoding error:", error));
}

// 지도 클릭 시 역 지오코딩을 통해 주소 표시
map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    reverseGeocode(lat, lng); // 클릭한 좌표를 역 지오코딩으로 주소 변환

    // 날씨 팝업을 표시하기 위해 weather.js의 showWeatherPopup 함수 호출
   showWeatherPopup(lat, lng); // 날씨 팝업 호출
});

// 주소 검색 팝업창 열기
function openGeocodePopup() {
    document.getElementById('geocodePopup').style.display = 'block';
}

// 주소 검색 팝업창 닫기
function closeGeocodePopup() {
    document.getElementById('geocodePopup').style.display = 'none';
}
