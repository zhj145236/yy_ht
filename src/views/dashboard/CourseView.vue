<template>

  <div :class="className" :style="{height:height,width:width}">


    <el-dialog title="浏览此课程的用户" :visible.sync="dialogTableVisible" :append-to-body="true">
      <el-table :data="gridData">


        <el-table-column property="headImg" label="头像" width="150">

          <template slot-scope="{row}">
            <el-image
              :src="fileRefUrl + row.headImg"
              :preview-src-list="[fileRefUrl + row.headImg]"
              fit="contain" lazy class="el-avatar">
              <div slot="error">
                <i class="el-icon-document"/>
              </div>
            </el-image>

          </template>
        </el-table-column>

        <el-table-column property="nickName" label="昵称" width="150"/>
        <el-table-column property="locationDesc" label="地址" width="200"/>
        <el-table-column property="viewTime" label="访问时间"/>
        <el-table-column property="label" label="身份"/>


      </el-table>
    </el-dialog>


  </div>


</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons'); // echarts theme
  import resize from './mixins/resize';

  import {courseView} from '@/api/dashboard'
  import {viewCourseUserList} from '@/api/dashboard'
  import {mapGetters} from "vuex";


  let xAxis_data = [];
  let legend_data = [];
  let seriesArr = [];

  let tipText = "";

  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '350px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData2: {
        type: Object,
        required: true
      }
    },

    computed: {
      ...mapGetters([
        'baseApi',
        'fileRefUrl',
      ])
    },

    data() {
      return {
        chart: null,

        firstEncodeValue: "",
        gridData: [],
        dialogTableVisible: false

      }
    },
    watch: {},
    mounted() {
      this.$nextTick(() => {

        this.initData();

      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose();
      this.chart = null;
    },
    methods: {

      initData() {


        courseView().then((map) => {


          xAxis_data = map.xAxis.map((item) => {

            return item.substring(4, 6) + "/" + item.substring(6, 8)

          });
          legend_data = map.legend_data;


          seriesArr = map.series.map(function (item) {

            item.type = "line";
            item.stack = "总量";
            return item;   // 会影响原数组。 注意要return!

          });


          // 注意放最后
          this.initChart();

        }).catch((error) => {
           console.error("后台调用出错：", error);
          this.initChart();
        });


      },


      initChart() {
        this.chart = echarts.init(this.$el, 'macarons');
        this.setOptions(this.chartData2)
      },

      setOptions({expectedData, actualData} = {}) {

        this.chart.setOption({

          title: {
            text: '我的课程访问量'
          },

          symbolSize: 18,
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },


          tooltip: {
            trigger: 'axis',

            formatter(params) {

              tipText = null;
              tipText = "";


              tipText += (params[0].name + "<br/>点击单独小圆点可查看详情<br/>");


              for (let i = 0; i < params.length; i++) {

                tipText += params[i].seriesName + ":" + params[i].value + "次<br/>";

              }

              return tipText;

            }

          },

          legend: {
            data: legend_data
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },

          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxis_data
          },
          yAxis: {
            type: 'value'
          },
          series: seriesArr


        });


        let _this = this;

        this.chart.on('click', function (params) {


          viewCourseUserList(params.data).then((map) => {


            _this.gridData = map.content;

            _this.dialogTableVisible = true;


          }).catch((error) => {


            console.error(error);

          });


        });


      }
    }
  }
</script>
