const pusan_position = {
  lat: 35.231606,
  lng: 129.084216
}
var score_check = false;
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
    level: 10 // 지도의 확대 레벨
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
    if(!score_check){
      markers[0].setPosition(latlng);
      lat.innerHTML = latlng.getLat().toFixed(6);
      lng.innerHTML = latlng.getLng().toFixed(6);
    }
  });

/////////////Button, var///////////////////////////////
var playButton = document.getElementById("play");
var checkButton = document.getElementById("check");
var t_container = document.getElementById("text_container");
var regButton = document.getElementById("register");
var goMap = document.getElementById("kakao_map");
var scoreList = document.getElementById("best");
var kakao_nav = document.getElementById("kakao_nav");
var ranLat;
var ranLng;
var score;
const key = "user";
//대한민국 내의 랜덤한 위도경도를 생성후 그 위도 경도를 바탕으로 로드뷰 출력
function ranLatLng() {
  ranLat = ((Math.random() * 3) + 34.5).toFixed(6);
  ranLng = ((Math.random() * 3) + 126.5).toFixed(6);
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
  var sub_lng = 3.0 - lng;
  var lat_map = mapping(sub_lat, 3.0);
  var lng_map = mapping(sub_lng, 3.0);
  return ((lat_map + lng_map) / 2.0).toFixed(2);
}

var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 
//점수 계산, 정답 위치 마커 맵에 표시, 점수 등록 칸 표시
function decision(){
  var maps_lat = parseFloat(lat.innerText);
  var maps_lng = parseFloat(lng.innerText);
  score = score_calc(Math.abs(maps_lat - ranLat), Math.abs(maps_lng - ranLng));
  document.getElementById("score").innerHTML = score;
  var imageSize = new kakao.maps.Size(24, 35);
  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);  
  var sol_marker = new kakao.maps.Marker({
    // 지도 중심좌표에 마커를 생성합니다 
    position: new kakao.maps.LatLng(ranLat, ranLng),
    image : markerImage
  });
  markers[1] = sol_marker;
  markers[1].setMap(map);

  checkButton.disabled = true;
  t_container.style.display = 'inline';
  regButton.style.display = 'inline';
  score_check = true;
  console.log(score_check);
  //해당 게임으로 나온 곳 카카오맵 바로가기, 기능 2
  var link = "https://map.kakao.com/link/map/" + ranLat + "," + ranLng;
  console.log(link);
  goMap.href = link;
  goMap.style.display = 'block';
  kakao_nav.href = "#kakao_map";
}

checkButton.addEventListener('click', decision);

//현재 게임 초기화
function init_game(){
  map.setCenter(new kakao.maps.LatLng(pusan_position.lat, pusan_position.lng));
  position = new kakao.maps.LatLng(pusan_position.lat, pusan_position.lng);
  roadviewClient.getNearestPanoId(position, 50, function (panoId) {
    roadview.setPanoId(panoId, position);
  });
  markers[0].setPosition(position);
  markers[1].setMap(null);
  score_check = false;
  goMap.style.display = 'none';
  playButton.disabled = false;
  t_container.style.display = 'none';
  regButton.style.display = 'none';
  document.getElementById("score").innerHTML = ".";
  document.getElementById("my_id").value = "";
}
//JSON을 이용한 localStorage에 1~5위까지의 순위 저장, 시작할때 불러오기
//기능 3
function score_register(){
  //에러 핸들링 2
  var id_text = document.getElementById("my_id").value;
  console.log(id_text.length, id_text);
  if(id_text.length <= 0){
    alert("ID는 한글자 이상입니다.");
    return;
  }
  setStorage(id_text);
  scoreList.innerHTML = getStorage();
  init_game();
}
//로컬스토리지 관리하는 함수, 최대 5개까지만 저장
function setStorage(id_text){
  //localStorage가 비었을 경우 새 데이터 로컬스토리지에 추가
  if(localStorage.getItem(key) == null){
    const userData = {
      Data : [{ID : id_text, Score : score}]
    };
    localStorage.setItem(key, JSON.stringify(userData));
  } 
  else {
    const getData = JSON.parse(localStorage.getItem(key));
    if(getData.Data.length >= 5){
      if(parseFloat(getData.Data[4].Score) <= score){
        getData.Data.splice(4, 1, {ID : id_text, Score : score});
        getData.Data.sort(function(a,b){
        let x = parseFloat(a.Score);
        let y = parseFloat(b.Score);
        if(x == y){
          if(a.ID.toLowerCase() < b.ID.toLowerCase()) return -1;
          else return 1;
        }
        return y - x;
        });
      }
    }
    else {
      getData.Data.push({ID : id_text, Score : score});
      getData.Data.sort(function(a,b){
        let x = parseFloat(a.Score);
        let y = parseFloat(b.Score);
        if(x == y){
          if(a.ID.toLowerCase() < b.ID.toLowerCase()) return -1;
          else return 1;
        }
        return y - x;
      });
    }
    localStorage.setItem(key, JSON.stringify(getData));
  }
}

//로컬스토리지에서 값 가져와서 #best에 li추가
function getStorage(){
  if(localStorage.getItem(key) == null) return "스코어 순위 (최대 5인까지)";
  const getData = JSON.parse(localStorage.getItem(key));
  var element = "스코어 순위 (최대 5인까지)";
  for(var i = 0; i < getData.Data.length; i++){
    element += "<li>" + getData.Data[i].ID + " : " + getData.Data[i].Score + "</li>";
  }
  return element;
}

function storage_init(){
  scoreList.innerHTML = getStorage();
}

regButton.addEventListener('click', score_register);
addEventListener('load', storage_init);