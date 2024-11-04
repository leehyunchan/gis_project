// GeoServer에서 제공하는 Land, Coastline, River 레이어를 Leaflet으로 추가
const riverLayer = L.tileLayer.wms("http://localhost:8080/geoserver/db_add_test/wms", {
    layers: 'db_add_test:river',
    format: 'image/png',
    transparent: true,
    attribution: "GeoServer"
}).setZIndex(500);

const landLayer = L.tileLayer.wms("http://localhost:8080/geoserver/db_add_test/wms", {
    layers: 'db_add_test:land',
    format: 'image/png',
    transparent: true,
    attribution: "GeoServer"
}).setZIndex(500);

const coastlineLayer = L.tileLayer.wms("http://localhost:8080/geoserver/db_add_test/wms", {
    layers: 'db_add_test:coastline',
    format: 'image/png',
    transparent: true,
    attribution: "GeoServer"
}).setZIndex(500);

// 자연 레이어 그룹 생성
const naturalFeaturesOverlay = L.layerGroup([riverLayer, landLayer, coastlineLayer]);

// 모든 기본 지도에 자연 레이어를 겹쳐서 추가하기 위한 함수
function addNaturalFeaturesToMap(baseLayer) {
    baseLayer.addLayer(naturalFeaturesOverlay);
}

// 자연 레이어 토글을 위한 변수와 버튼 요소 선택
let naturalFeaturesActive = false;
const naturalFeaturesToggleButton = document.createElement("button");
naturalFeaturesToggleButton.id = "naturalFeaturesToggleButton";
naturalFeaturesToggleButton.textContent = "자연 형태 토글";
document.querySelector(".button-container").appendChild(naturalFeaturesToggleButton);

// 자연 레이어 토글 기능
naturalFeaturesToggleButton.addEventListener("click", () => {
    if (naturalFeaturesActive) {
        map.removeLayer(naturalFeaturesOverlay);
        naturalFeaturesToggleButton.classList.remove("active"); // 버튼 색상 비활성화
    } else {
        map.addLayer(naturalFeaturesOverlay);
        naturalFeaturesToggleButton.classList.add("active"); // 버튼 색상 활성화
    }
    naturalFeaturesActive = !naturalFeaturesActive; // 상태 업데이트
});

// 지도 초기화 시 기본 레이어로 Street Map과 자연 형태 오버레이를 추가
map.addLayer(naturalFeaturesOverlay);

// 모든 레이어에 자연 레이어가 유지되도록 이벤트 리스너 설정
map.on('baselayerchange', function(event) {
    if (naturalFeaturesActive && !map.hasLayer(naturalFeaturesOverlay)) {
        map.addLayer(naturalFeaturesOverlay);
    }
});

// 자연 레이어만 테스트 모드 기능을 위한 함수
function showOnlyNaturalFeatures() {
    // 기본 레이어 제거
    Object.values(baseMaps).forEach(layer => map.removeLayer(layer));
    // 자연 레이어만 추가
    map.addLayer(naturalFeaturesOverlay);
}

// 테스트 모드를 위한 버튼 생성 및 클릭 이벤트 추가
const testModeButton = document.createElement("button");
testModeButton.id = "testModeButton";
testModeButton.textContent = "자연 레이어 테스트 모드";
document.querySelector(".button-container").appendChild(testModeButton);

testModeButton.addEventListener("click", showOnlyNaturalFeatures);
