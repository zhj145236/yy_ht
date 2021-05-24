<template>

  <div :class="className" :style="{height:height,width:width}">


    <el-dialog title="浏览的用户" :visible.sync="dialogTableVisible" :append-to-body="true">
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


  import resize from './mixins/resize';

  import {userVisit} from '@/api/dashboard'
  import {viewUserList} from '@/api/dashboard'


  import {mapGetters} from "vuex";


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


        dayStr: [],
        valueArr: [],

        gridData: [],
        dialogTableVisible: false,


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


        userVisit().then((map) => {


          for (let prop in map) {

            this.dayStr.push(prop.substring(4, 6) + "/" + prop.substring(6, 8));
            this.valueArr.push(map[prop])

          }


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
            text: '我的主页访问量'
          },

          tooltip: {
            trigger: 'axis',
            formatter: "访问人数:{c}人<br/>点击查询详情"
          },

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
          calculable: true,


          xAxis: {
            type: 'category',
            data: this.dayStr,
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.valueArr,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)'
            },
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  //position: 'top', //在上方显示
                  textStyle: { //数值样式
                    fontSize: 16
                  }
                }
              }
            },

          }]


        });


        let _this = this;

        this.chart.on('click', function (params) {


          viewUserList({date: params.data.date}).then((map) => {


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
