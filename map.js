//////////////////////////roadview////////////////////////

var roadviewContainer = document.getElementById('roadview'); //로드뷰를 표시할 div
var roadview = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
var roadviewClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

var position = new kakao.maps.LatLng(33.450701, 126.570667);

// 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
roadviewClient.getNearestPanoId(position, 50, function (panoId) {
  roadview.setPanoId(panoId, position); //panoId와 중심좌표를 통해 로드뷰 실행
});

////////////////////////////////////map/////////////////////////////
var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
  mapOption = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    level: 1 // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 지도를 클릭한 위치에 표출할 마커입니다
var marker = new kakao.maps.Marker({
  // 지도 중심좌표에 마커를 생성합니다 
  position: map.getCenter()
});
// 지도에 마커를 표시합니다
marker.setMap(map);

var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'zoom_changed', function () {

  // 지도의 현재 레벨을 얻어옵니다
  var level = map.getLevel();

  var message = '현재 지도 레벨은 ' + level + ' 입니다';
  console.log(message);

});

// 지도에 클릭 이벤트를 등록합니다
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
kakao.maps.event.addListener(map, 'click', function (mouseEvent) {

  // 클릭한 위도, 경도 정보를 가져옵니다 
  var latlng = mouseEvent.latLng;

  // 마커 위치를 클릭한 위치로 옮깁니다
  marker.setPosition(latlng);
  var lat = document.getElementById('lat');
  lat.innerHTML = latlng.getLat().toFixed(6);
  var lng = document.getElementById('lng');
  lng.innerHTML = latlng.getLng().toFixed(6);
});

/////////////Button///////////////////////////////
var playButton = document.getElementById("play");
var ranLat;
var ranLng;
function ranLatLng() {
  ranLat = ((Math.random() * 3) + 34.5).toFixed(6);
  ranLng = ((Math.random() * 2.5) + 126.5).toFixed(6);
  console.log(ranLat, ranLng);
  position = new kakao.maps.LatLng(ranLat, ranLng);
  roadviewClient.getNearestPanoId(position, 300, function (panoId) {
    //panoId값이 null인 경우 핸들러
    console.log(panoId);
    if(panoId == null) ranLatLng();
    else {
      roadview.setPanoId(panoId, position);
      return;
    }
  });
  playButton.disabled = true;
}

function playStart(){
  ranLatLng();
  console.log("last latlng ", ranLat, ranLng);
}

playButton.addEventListener('click', playStart);

