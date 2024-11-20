// WebSocket 연결 설정 (로컬 서버 주소)
const socket = new WebSocket("ws://localhost:8082");

// 실시간 위치 데이터 마커 및 경로 선 초기 설정
let locationMarker = L.marker([37.5665, 126.9780]).addTo(map);
let routeLine = L.polyline([], { color: 'blue' }).addTo(map); // 경로 선

// WebSocket 메시지 수신 시 위치 업데이트 (updateLocation 함수 호출)
socket.onmessage = (event) => {
   const locationData = JSON.parse(event.data); // 수신한 위치 데이터
   updateLocation(locationData); // 위치 데이터를 updateLocation 함수로 전달
};

// WebSocket 연결 상태 로그 출력
socket.onopen = () => console.log("Connected to WebSocket server");
socket.onclose = () => console.log("Disconnected from WebSocket server");

// 웹소켓에서 수신한 위치 데이터를 통해 지도 업데이트
function updateLocation(locationData) {
   const { latitude, longitude } = locationData;

   // 마커 위치 업데이트
   locationMarker.setLatLng([latitude, longitude]);

   // 이동 경로에 새로운 위치 추가
   routeLine.addLatLng([latitude, longitude]);
}
