$(function(){
	new Vue({
		el:'#main',
		data() {
			return {
				key: 11
			}
		},
		mounted(){
			
		},
		beforeCreate() {
		  document.addEventListener("plusready",function(){
			  checkVersion();
		  });
		},
		methods: {
			map() {
				window.location.href = 'map.html';
			}
		},
	});
});