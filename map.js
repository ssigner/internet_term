const pusan_position = {
  lat: 35.231606,
  lng: 129.084216
}

//////////////////////////roadview////////////////////////

var roadviewContainer = document.getElementById('roadview'); //로드뷰를 표시할 div
var roadview = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
var roadviewClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

var position = new kakao.maps.LatLng(pusan_position.lat, pusan_position.lng);

// 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
roadviewClient.getNearestPanoId(position, 50, function (panoId) {
  roadview.setPanoId(panoId, position); //panoId와 중심좌표를 통해 로드뷰 실행
});

////////////////////////////////////map/////////////////////////////
var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
  mapOption = {
    center: new kakao.maps.LatLng(pusan_position.lat, pusan_position.lng), // 지도의 중심좌표
    level: 1 // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 지도를 클릭한 위치에 표출할 마커입니다
var markers = [];
markers.push(new kakao.maps.Marker({
  // 지도 중심좌표에 마커를 생성합니다 
  position: map.getCenter()
}));
// 지도에 마커를 표시합니다
markers[0].setMap(map);

var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

var lat = document.getElementById('lat');
var lng = document.getElementById('lng');
// 지도에 클릭 이벤트를 등록합니다
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
kakao.maps.event.addListener(map, 'click', function (mouseEvent) {

  // 클릭한 위도, 경도 정보를 가져옵니다 
  var latlng = mouseEvent.latLng;

  // 마커 위치를 클릭한 위치로 옮깁니다
  markers[0].setPosition(latlng);
  lat.innerHTML = latlng.getLat().toFixed(6);
  lng.innerHTML = latlng.getLng().toFixed(6);
});

/////////////Button///////////////////////////////
var playButton = document.getElementById("play");
var checkButton = document.getElementById("check");
var t_container = document.getElementById("text_container");
var regButton = document.getElementById("register")
var ranLat;
var ranLng;
//대한민국 내의 랜덤한 위도경도를 생성후 그 위도 경도를 바탕으로 로드뷰 출력
function ranLatLng() {
  ranLat = ((Math.random() * 3) + 34.5).toFixed(6);
  ranLng = ((Math.random() * 2.5) + 126.5).toFixed(6);
  console.log(ranLat, ranLng);
  position = new kakao.maps.LatLng(ranLat, ranLng);
  roadviewClient.getNearestPanoId(position, 300, function (panoId) {
    //panoId값이 null인 경우 재귀로 처리 -- ERROR Handling 1
    console.log(panoId);
    if(panoId == null) ranLatLng();
    else {
      roadview.setPanoId(panoId, position);
      return;
    }
  });
  playButton.disabled = true;
}
//로드뷰 게임, 기능 1
function playStart(){
  ranLatLng();
  console.log("last latlng ", ranLat, ranLng);
  checkButton.disabled = false;
}
playButton.addEventListener('click', playStart);

//점수 계산하는 구간
function mapping(value, max){
  return (value * 100.0) / max;
}

function score_calc(lat, lng){
  var sub_lat = 3.0 - lat;
  var sub_lng = 2.5 - lng;
  var lat_map = mapping(sub_lat, 3.0);
  var lng_map = mapping(sub_lng, 2.5);
  return ((lat_map + lng_map) / 2.0).toFixed(2);
}

var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 

function decision(){
  var maps_lat = parseFloat(lat.innerText);
  var maps_lng = parseFloat(lng.innerText);
  var score = score_calc(Math.abs(maps_lat - ranLat), Math.abs(maps_lng - ranLng));
  document.getElementById("score").innerHTML = score;
  var imageSize = new kakao.maps.Size(24, 35);
  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);  
  var sol_marker = new kakao.maps.Marker({
    // 지도 중심좌표에 마커를 생성합니다 
    position: new kakao.maps.LatLng(ranLat, ranLng),
    image : markerImage
  });
  markers.push(sol_marker);
  markers[1].setMap(map);
  checkButton.disabled = true;
  t_container.style.display = 'inline';
  regButton.style.display = 'inline';
}

checkButton.addEventListener('click', decision);

function init(){
  map.setCenter(new kakao.maps.LatLng(pusan_position.lat, pusan_position.lng));
  position = new kakao.maps.LatLng(pusan_position.lat, pusan_position.lng);
  roadviewClient.getNearestPanoId(position, 50, function (panoId) {
    roadview.setPanoId(panoId, position);
  });
  markers[0].setPosition(position);
  markers[1].setMap(null);
}

regButton.addEventListener('click', init);