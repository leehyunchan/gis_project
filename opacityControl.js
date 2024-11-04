// 투명도 조절 팝업창 열기
function openOpacityPopup() {
    document.getElementById('opacityPopup').style.display = 'block';
}

// 투명도 조절 팝업창 닫기
function closeOpacityPopup() {
    document.getElementById('opacityPopup').style.display = 'none';
}

// 레이어 투명도 조절 함수
function setLayerOpacity(layerName, opacityValue) {
    switch (layerName) {
        case 'streetLayer':
            streetLayer.setOpacity(opacityValue);
            break;
        case 'satelliteLayer':
            satelliteLayer.setOpacity(opacityValue);
            break;
        case 'terrainLayer':
            terrainLayer.setOpacity(opacityValue);
            break;
        case 'hillshadeLayer':
            hillshadeLayer.setOpacity(opacityValue);
            break;
        default:
            console.warn(`Unknown layer: ${layerName}`);
    }
}
