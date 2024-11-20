function toggle3DView() {
    const cesiumContainer = document.getElementById('cesiumContainer');
    const mapContainer = document.getElementById('map');

    if (cesiumContainer.style.display === 'none') {
        // 2D에서 3D로 전환
        mapContainer.style.display = 'none';
        cesiumContainer.style.display = 'block';

        // Leaflet 중심 좌표를 가져와 Cesium 카메라 위치로 설정
        const leafletCenter = map.getCenter(); // Leaflet 중심 가져오기
        const cartesian = Cesium.Cartesian3.fromDegrees(
            leafletCenter.lng, // 경도
            leafletCenter.lat, // 위도
            500000.0 // 고도 (Leaflet 줌 레벨 기반으로 조정 가능)
        );

        // Cesium 초기화
        if (!window.viewer) {
            initializeCesium(); // `initializeCesium` 함수에서 `viewer`가 설정됨
        }

        // Cesium 카메라 이동
        if (window.viewer) {
            viewer.camera.flyTo({
                destination: cartesian,
                orientation: {
                    heading: Cesium.Math.toRadians(0), // 동쪽을 바라봄
                    pitch: Cesium.Math.toRadians(-45), // 아래쪽을 바라봄
                    roll: 0.0,
                },
            });
        }
    } else {
        // 3D에서 2D로 전환
        cesiumContainer.style.display = 'none';
        mapContainer.style.display = 'block';

        // Cesium이 초기화된 경우에만 카메라 위치 가져오기
        if (window.viewer) {
            const cesiumCamera = viewer.camera;
            const cartographic = Cesium.Cartographic.fromCartesian(
                cesiumCamera.position
            ); // 카메라 위치를 경위도 및 고도로 변환
            const latitude = Cesium.Math.toDegrees(cartographic.latitude); // 위도
            const longitude = Cesium.Math.toDegrees(cartographic.longitude); // 경도

            // Leaflet 중심 설정
            map.setView([latitude, longitude], map.getZoom()); // 줌 레벨 유지

            // Cesium 종료
            destroyCesium();
            window.viewer = null; // `viewer` 객체 해제
        }
    }
}

// `toggle3DView`를 전역에서 호출 가능하도록 설정
window.toggle3DView = toggle3DView;
