var version_url = 'https://1729176996.github.io/Smell';
function checkVersion(){
	// 检查当前版本，与从后台获取的版本作比较，以此判断是否更新
	plus.runtime.getProperty(plus.runtime.appid,function(inf){
		// 当前版本
		var wgtVersion = inf.version;
		$.ajax({
			url:version_url+'/version.json',
			type:'get',
			dataType: 'json',
			success:function(data){
				console.log(data);
				// 如果有新版本，则提示需要更新
				if( data.version > wgtVersion ){
					var r=confirm("发现新版本，是否更新?")
					if (r==true){
						downloadWgt(); // 下载wgt方法
					} else {
						return;
					}
				}else{
					return;
				}
			},
			error:function(xhr, errorType, error,msg){
				alert(msg);
			}
		})
	});
}
// 下载wgt方法
function downloadWgt(){
	// 更新文件 wgt 文件地址
	var wgtUrl = version_url+"/update.wgt";
    plus.nativeUI.showWaiting("正在更新...");
    plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
     if ( status == 200 ) {
          console.log("下载wgt成功："+d.filename);
          installWgt(d.filename); // 安装wgt方法
      } else {
          console.log("下载wgt失败！");
          plus.nativeUI.alert("下载wgt失败！");
      }
      plus.nativeUI.closeWaiting();
  }).start();
}
// 安装wgt方法
function installWgt(path){
	  plus.nativeUI.showWaiting("安装wgt文件...");
	  plus.runtime.install(path,{},function(){
	      plus.nativeUI.closeWaiting();
	      console.log("安装wgt文件成功！");
	      plus.nativeUI.alert("应用资源更新完成！",function(){
	          plus.runtime.restart();
	      });
	  },function(e){ 
	      plus.nativeUI.closeWaiting();
	      console.log("安装wgt文件失败["+e.code+"]："+e.message);
	      plus.nativeUI.alert("安装wgt文件失败["+e.code+"]："+e.message);
	  });
}