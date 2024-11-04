// OpenWeatherMap API Key 설정
const openWeatherApiKey = 'e4f0a5d15f12f1ac17fc952b87125896';

// 날씨 오버레이를 위한 pane을 생성하고 z-index를 높게 설정
map.createPane('weatherPane');
map.getPane('weatherPane').style.zIndex = 650; // 높은 z-index 설정 (기본 타일 레이어보다 높게)

// 날씨 오버레이 레이어 생성 (구름 레이어 예제)
const weatherOverlay = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${openWeatherApiKey}`, {
    opacity: 0.5,
    pane: 'weatherPane' // 새로 생성한 pane을 오버레이에 적용
});

// 날씨 레이어 상태 및 클릭 이벤트 핸들러 초기 설정
let weatherEnabled = false; // 날씨 레이어 초기 상태
let clickEventHandler = null;

// 날씨 토글 버튼 요소 선택
const weatherToggleButton = document.getElementById("weatherToggleButton");

// 날씨 정보를 팝업으로 표시하는 함수
function showWeatherPopup(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric&lang=kr`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.weather && data.weather.length > 0 && data.main) {
                const { weather, main, name } = data;
                const description = weather[0].description;
                const temperature = main.temp;

                // 날씨 팝업 (위치를 약간 위로 이동)
                L.popup({ className: 'weather-popup', offset: L.point(0, -50) })
                    .setLatLng([lat, lon])
                    .setContent(`<b>장소: ${name || "알 수 없음"}</b><br>날씨: ${description}<br>온도: ${temperature}°C`)
                    .addTo(map);
            } else {
                console.error("Weather data is incomplete:", data);
                alert("날씨 정보를 가져올 수 없습니다.");
            }
        })
        .catch(error => console.error("Weather data fetch error:", error));
}

// 날씨 오버레이 및 클릭 이벤트 토글 기능 구현
function toggleWeather() {
    if (weatherEnabled) {
        // 날씨 레이어 제거 및 클릭 이벤트 제거
        map.removeLayer(weatherOverlay);
        map.off('click', clickEventHandler);

        // 버튼 색상 변경 (비활성화 상태)
        weatherToggleButton.style.backgroundColor = "";
        weatherToggleButton.style.color = "";

        weatherEnabled = false;
    } else {
        // 날씨 오버레이 추가 및 클릭 이벤트 활성화
        map.addLayer(weatherOverlay);

        // 클릭 시 날씨 정보를 가져오는 이벤트 핸들러 등록
        clickEventHandler = function(e) {
            const { lat, lng } = e.latlng;
            showWeatherPopup(lat, lng); // 클릭한 위치의 날씨 정보를 팝업으로 표시
        };
        map.on('click', clickEventHandler);

        // 버튼 색상 변경 (활성화 상태)
        weatherToggleButton.style.backgroundColor = "#007bff";
        weatherToggleButton.style.color = "#ffffff";

        weatherEnabled = true;
    }
}

// 레이어가 변경될 때마다 weatherOverlay를 다시 추가하는 이벤트 리스너
map.on('baselayerchange', () => {
    if (weatherEnabled && !map.hasLayer(weatherOverlay)) {
        map.addLayer(weatherOverlay);
    }
});
