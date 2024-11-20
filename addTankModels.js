// addTankModels.js

// 탱크 모델을 특정 위치에 추가하는 함수
async function addTankModel(viewer, lon, lat, height = 100, scale = 500) {
    const assetId = 2847840; // 탱크 모델 Asset ID

    try {
        // Ion에서 리소스 로드
        const resource = await Cesium.IonResource.fromAssetId(assetId);

        // 위치 및 스케일 행렬 생성
        const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
            Cesium.Cartesian3.fromDegrees(lon, lat, height) // 위치 지정
        );
        const scaleMatrix = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(scale, scale, scale)); // 크기 조정
        Cesium.Matrix4.multiply(modelMatrix, scaleMatrix, modelMatrix); // 스케일과 위치 결합

        // 3D 타일셋 로드 및 추가
        const tileset = await Cesium.Cesium3DTileset.fromUrl(resource, {
            modelMatrix: modelMatrix,
        });
        viewer.scene.primitives.add(tileset);

        console.log(`탱크 모델 추가 완료 (${lon}, ${lat}, ${height})`);
    } catch (error) {
        console.error("탱크 모델 추가 중 오류 발생:", error);
    }
}

// 전역 함수로 등록
window.addTankModel = addTankModel;