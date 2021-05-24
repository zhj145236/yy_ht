<template>

  <div style="width: 100%;height: 100% ">




    <el-input placeholder="请选择位置" v-model="lnglatStr" class="input-with-select">

      <el-button slot="append"   icon="el-icon-location" @click="showMapDialog">坐标</el-button>
    </el-input>


    <el-dialog
      :visible.sync="innerVisible"
      :center="true"
      top="1vh"
      append-to-body>

      <el-row>
      <div id="containerMap">

      </div>
      </el-row>

      <el-row>
        <el-col :span="18" >
         <div > 经纬度：<span style="color: #00a0e9">{{point.lng}}</span>,<span style="color:#4AB7BD">{{point.lat}}</span></div>
        </el-col>
        <el-col :span="6">
          <el-button @click="sendLocation" class="el-icon-success">
            确认并关闭
          </el-button>
        </el-col>
      </el-row>

    </el-dialog>


  </div>
</template>
<script>
  import {TMap} from './TMap.js'


  export default {
    data() {
      return {

        tMap: {},
        point: {}, //maps.LatLng类型
        marker: null,
        innerVisible: false,
        qq: null,
        lnglatStr_Data:""
      }
    },

    props:
      {
        lnglatStr: {
          type: String,
        }
      },

    mounted() {


    },
    methods: {


      sendLocation() {

        this.$emit('sendLocation', this.point);

        this.innerVisible = false;


      },
      showMapDialog() {

        this.innerVisible = true;


        if (this.qq === null) {
          TMap().then(qq => {

            this.qq = qq;

            this.tMap = new this.qq.maps.Map(document.getElementById("containerMap"), {
              // 地图的中心地理坐标。
              center: new qq.maps.LatLng(22.964716, 113.814240), //东莞市 中心
              zoom: 10

            });

            this.initMap();
          });
        } else {
          this.initMap();
        }


      },

      initMap() {

        if (  this.lnglatStr!=null && this.lnglatStr.trim().length > 2) {

          // 注意经纬度顺序
          this.point = new this.qq.maps.LatLng(this.lnglatStr.split(",")[1].trim(), this.lnglatStr.split(",")[0].trim());

          this.tMap.center = this.point;
          this.pinPoint(this.point);



        }

        //绑定单击事件添加参数
        this.qq.maps.event.addListener(this.tMap, 'click', (event) => {

          this.point = new qq.maps.LatLng(event.latLng.getLat(), event.latLng.getLng());
          this.pinPoint(this.point);

        });

      },


      pinPoint(latLng) {

        if (this.marker !== null) {
          this.marker.setMap(null);
          this.marker = null;
        }

        this.marker = new qq.maps.Marker({
          position: latLng,//标记的经纬度
          animation: qq.maps.MarkerAnimation.DROP,//标记的动画
          map: this.tMap//标记的地图
        });

       // this.lnglatStr=latLng.getLng()+","+latLng.getLat();
        this.lnglatStr_Data=latLng.getLng()+","+latLng.getLat();
      }


    },
    created: function () {

    }
  }
</script>
<style>
  #containerMap {
    border: 1px solid red;
    min-width: 600px;
    min-height: 767px;
  }
</style>
