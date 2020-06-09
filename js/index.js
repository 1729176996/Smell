$(function(){
	new Vue({
		el:'#main',
		data() {
			return {
				key: 11
			}
		},
		mounted(){
			checkVersion();
		},
		methods: {
			map() {
				window.location.href = 'map.html';
			}
		},
	});
});