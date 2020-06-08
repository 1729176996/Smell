 var map = null;
 var walkingPanel = null;
 var userMarker = null;
 var endMarker = null;
 var markers = [];
 var morenPosition = null;
 window.onLoad  = function(){
        map = new AMap.Map('ditu',{
			zoomEnable: true, //地图是否可缩放，默认值为true
		});
		// 传入经纬度，设置地图中心点
		//渝中区106.57,29.55
		//杨家坪106.512339,29.505386
		morenPosition = new AMap.LngLat(106.512339,29.505386);  // 标准写法
		map.setCenter(morenPosition); 
		// 设置地图级别，级别为数字。
		// PC上，参数zoom可设范围：[3,18]；
		// 移动端：参数zoom可设范围：[3,19]
		map.setZoom(19);
		
		
		
		//创建用户标点
		//createUserMarker(position);
		
		map.on('click', function(ev) {
			return;
		  // 触发事件的对象
		  var target = ev.target;
		  // 触发事件的地理坐标，AMap.LngLat 类型
		  var lnglat = ev.lnglat;
		  // 触发事件的像素坐标，AMap.Pixel 类型
		  var pixel = ev.pixel;
		  // 触发事件类型
		  var type = ev.type;
		  
		  // for(var n=0;n<markers.length;n++){
		  //   map.removeOverlay(markers[n]);
		  // }
		  //创建用户标点
		  createMarker('dddd',lnglat,false);
		  //创建步行导航
		  //walking(lnglat);
		});
		function walking(){
			var startLngLat = userMarker.getPosition();
			var endLngLat = endMarker.getPosition();
			AMap.plugin('AMap.Walking', function() {
				if(!walkingPanel){
					walkingPanel = new AMap.Walking({
						map: map,
						panel: "walking"
					});
				}
				
				walkingPanel.search(startLngLat, endLngLat, function (status, result) {
					// result即是对应的步行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
					if (status === 'complete') {
						console.log('绘制步行路线完成')
						console.log(result);
					} else {
						console.log('步行路线数据查询失败' + result)
					}
				})
			})
			
		}
		
		document.addEventListener('plusready', function() {
			
			checkVersion();
			
			getCurrentPosition(true);
			setInterval(function(){
				getCurrentPosition(true);
				if(userMarker&&endMarker){
					walking();
				}
			},1000);
		});
		function getCurrentPosition(setCenter){
			plus.geolocation.getCurrentPosition(function(p){
				//alert('Geolocation\nLatitude:' + p.coords.latitude + '\nLongitude:' + p.coords.longitude + '\nAltitude:' + p.coords.altitude);
				var hb = p.coords.altitude;//海拔
				var jd = p.coords.longitude;//经度
				var wd = p.coords.latitude;//纬度
				//传入经纬度
				var position = new AMap.LngLat(jd, wd);  // 标准写法
				if(setCenter){//是否设为中心点
					//设置地图中心点
					map.setCenter(position);
					map.setZoom(19);
				}
				//创建用户标点
				var obj = {
					name:'用户',
					location:position
				};
				createMarker(obj,true);
				
			}, function(e){
				console.log('Geolocation error: ' + e.message);
			} );
		}
		//创建标点
		function createMarker(obj,isUser){
			var content = '';
			content+='<div class="biaodian">';
				content+='<img class="biaodian-icon" src="img/dwpc_22.gif"/>';
				content+='<div class="biaodian-text">'+obj.name+'</div>';
			content+='</div>';
			// 创建一个 Marker 实例：
			var marker = new AMap.Marker({
				position: obj.location,// 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
				//title: '用户',
				content: content
			});
			// 设置点标记的动画效果，此处为弹跳效果
			//marker.setAnimation('AMAP_ANIMATION_BOUNCE');
			// 将创建的点标记添加到已有的地图实例：
			marker.dataObj = obj;
			map.add(marker);
			if(isUser){
				marker.on('click',function(o){
					console.log(o)
					/*var content = '';
					content+='<div class="biaodian">';
						content+='<img class="biaodian-icon" src="img/dwpc_22.gif"/>';
						content+='<div class="biaodian-text">gggg</div>';
					content+='</div>';
					o.target.setContent(content);*/
				});
				if(userMarker){
					// 移除已创建的 marker
					map.remove(userMarker);
				}else{
					getAround(obj.location);
				}
				userMarker = marker;
				
				console.log('设为中心点');
				map.setCenter(obj.location);
			}else{
				marker.on('click',function(o){
					console.log(o.target.dataObj);
					endMarker = o.target;
					/*var content = '';
					content+='<div class="biaodian">';
						content+='<img class="biaodian-icon" src="img/dwpc_22.gif"/>';
						content+='<div class="biaodian-text">gggg</div>';
					content+='</div>';
					o.target.setContent(content);*/
				});
				markers.push(marker);
			}
			map.setFitView();
		}
		
		function getAround(position){
			var MSearch;  
			//加载服务插件，实例化地点查询类    
			map.plugin(["AMap.PlaceSearch"], function() {  
				MSearch = new AMap.PlaceSearch({   
					city: "重庆"  
				});   
				//查询成功时的回调函数  
				AMap.event.addListener(MSearch, "complete", function(data){
					console.log(data)
					if(data&&data.poiList&&data.poiList.pois&&data.poiList.pois.length>0){
						for(var n=0;n<markers.length;n++){
						  map.remove(markers[n]);
						}
						for(var n=0;n<data.poiList.pois.length;n++){
							var obj = data.poiList.pois[n];
							createMarker(obj,false);
						}
					}
				});   
				//周边搜索  
				var cpoint = [position.lng, position.lat]; //中心点坐标
				MSearch.searchNearBy("甜点", cpoint, 20000);   
			});
		}
  }
  var key = '6f553a0bba0f90c9d9471c22b4481c7a';
  var url = 'https://webapi.amap.com/maps?v=1.4.15&key='+key+'&callback=onLoad';
  var jsapi = document.createElement('script');
  jsapi.charset = 'utf-8';
  jsapi.src = url;
  document.head.appendChild(jsapi);