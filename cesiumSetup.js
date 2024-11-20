// Cesium Ion Access Token 설정
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNTU0NWRkNy1jZjA5LTQwZjktYTljNi1mYTk1NWVlNjBiMDUiLCJpZCI6MjU2MzIwLCJpYXQiOjE3MzIwNjQ1NjZ9.68es-yxYgZyh9FdtVspB5wrXaFU5sX8kvT-VTt3SZMM";

let viewer = null;

async function initializeCesium() {
  try {
    // Cesium Viewer 초기화
    viewer = new Cesium.Viewer("cesiumContainer", {
      baseLayerPicker: false, // 기본 레이어 선택 비활성화
      animation: false, // 애니메이션 UI 비활성화
      timeline: false, // 타임라인 UI 비활성화
    });

    // 지형 데이터 추가 (Cesium Ion Terrain)
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(1);
    viewer.terrainProvider = terrainProvider;

    // 깊이 테스트 활성화
    viewer.scene.globe.depthTestAgainstTerrain = true;

    // Cesium 기본 월드 이미지 레이어 추가
    const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(3);
    viewer.imageryLayers.addImageryProvider(imageryProvider);

    // OSM Buildings 추가
    const osmBuildings = await Cesium.Cesium3DTileset.fromIonAssetId(96188);
    viewer.scene.primitives.add(osmBuildings);

    // 기본 스타일 적용
    const extras = osmBuildings.asset.extras;
    if (
      Cesium.defined(extras) &&
      Cesium.defined(extras.ion) &&
      Cesium.defined(extras.ion.defaultStyle)
    ) {
      osmBuildings.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
    }

    // 카메라 초기 위치 설정 (서울 중심)
    viewer.scene.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(126.9780, 37.5665, 10000), // 서울 중심
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0.0,
      },
    });

    await addTankModel(viewer, 126.9780, 37.5665, 100); // 서울 중심
    await addTankModel(viewer, 126.9920, 37.5665, 100); // 서울 동쪽
    await addTankModel(viewer, 127.0140, 37.5665, 100); // 서울 서쪽

  } catch (error) {
    console.error("Cesium 초기화 중 오류 발생:", error);
  }
}

function destroyCesium() {
  if (viewer) {
    viewer.destroy(); // Viewer 리소스 해제
    viewer = null;
  }
}

// 전역 함수로 등록
window.initializeCesium = initializeCesium;
window.destroyCesium = destroyCesium;
