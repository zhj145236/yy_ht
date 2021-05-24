<template>


  <el-row :gutter="40" class="panel-group">


    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">

      <router-link to="/notice/index">
        <div class="card-panel"> <!--@click="handleSetLineChartData('messages')"-->
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon"/>
          </div>

          <div class="card-panel-description">
            <div class="card-panel-text">
              未读消息
            </div>
            <count-to :start-val="0" :class="unReadMessage>0? 'warningRead card-panel-num ':'card-panel-num'"
                      :end-val="unReadMessage"
                      :duration="1000"/>
          </div>
        </div>
      </router-link>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" >
      <div class="card-panel"  style="cursor: text"  >
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="international" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" >
            累计访问量
            <el-popover
              placement="top-start"
              trigger="hover"
              content="我的微信小程序里的主页被浏览次数">
              <i slot="reference" class="el-icon-question"/>
            </el-popover>
          </div>
          <count-to :start-val="0" :end-val="totalUser" :duration="2000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>


    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <router-link to="/usercenter/index">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-nested">
            <svg-icon icon-class="nested" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              我的动态
            </div>
            <count-to :start-val="0" :end-val="totalDynamic" :duration="1900" class="card-panel-num"/>
          </div>

        </div>
      </router-link>
    </el-col>


    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">

      <router-link to="/product/index">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-chart">
            <svg-icon icon-class="chart" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              我的课程
            </div>
            <count-to :start-val="0" :end-val="totalCourse" :duration="1600" class="card-panel-num"/>
          </div>
        </div>
      </router-link>
    </el-col>


  </el-row>
</template>

<script>
  import CountTo from 'vue-count-to'

  import {summay} from '@/api/dashboard'

  import {mapGetters} from "vuex";

  export default {
    components: {
      CountTo
    },
    mounted() {

      this.init();
    },
    computed: {
      ...mapGetters([
        'baseApi'
      ])
    },
    data() {

      return {

        totalCourse: 0,
        totalDynamic: 0,
        totalUser: 0,
        unReadMessage: 0
      }

    },
    methods: {


      handleSetLineChartData(type) {
        this.$emit('handleSetLineChartData', type)
      },

      init() {

        summay().then((data) => {
          this.totalCourse = data.totalCourse;
          this.totalDynamic = data.totalDynamic;
          this.totalUser = data.totalUser;
          this.unReadMessage = data.unReadMessage;

        }).catch((error) => {
          // console.error("后台调用出错：", error);
        });

      }


    }
  }
</script>

<style lang="scss" scoped>


  .warningRead {

    color: #FEC171;

  }

  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-nested {
          background: #34bfa3
        }

        .icon-chart {
          background: #36a3f7;
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-nested {
        color: #36bf48
      }

      .icon-chart {
        color: #F0BA8F;
      }


      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
