var ele = document.getElementById('download_link');
ele.addEventListener('click',function(e){
	var canvas = document.getElementById('dock_builder');
	ele.href = canvas.toDataURL();
});