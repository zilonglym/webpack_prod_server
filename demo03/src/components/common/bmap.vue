<template id="child-map">
  <div id="map" :style="style"></div>
</template>

<script>
  export default{
    data(){
      return{
        style:{
          width:'100%',
          height:window.innerHeight+'px'
        }
      }
    },
    props:['m'],
    mounted(){
      var map = new BMap.Map("map");
    	var point = new BMap.Point(this.m.longitude,this.m.latitude);
    	map.centerAndZoom(point, 15);
    	var marker = new BMap.Marker(point);  // 创建标注
    	map.addOverlay(marker);               // 将标注添加到地图中
        var opts = {type: BMAP_NAVIGATION_CONTROL_SMALL}
        map.addControl(new BMap.NavigationControl(opts));
    }
  }
</script>
