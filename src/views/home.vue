<template>
  <!-- 系统  主页 -->


  <div class="dashboard-container">


    <div class="dashboard-editor-container">

      <!--消息面板  -->
      <panel-group @handleSetLineChartData="handleSetLineChartData"/>


      <el-row :gutter="24">

        <el-col :span="8">
          <div class="chart-wrapper">
            <weather/>
          </div>
        </el-col>

        <el-col :span="16">
          <div class="chart-wrapper">

            <user-chart :chart-data2="{}"/>
          </div>
        </el-col>

      </el-row>

      <el-row :gutter="24">

        <course-view :chart-data2="{}"/>

      </el-row>


      <el-row :gutter="32">


        <el-col :xs="24" :sm="24" :lg="12">
          <div class="chart-wrapper">
            <education-news :chart-data5="{}"/>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :lg="12">
          <div class="chart-wrapper">
            <ys-notice :chart-data6="{}"/>
          </div>
        </el-col>
      </el-row>

      <el-row>
      <!--  <map-view/>-->
      </el-row>


    </div>
  </div>
</template>

<script>
  import PanelGroup from './dashboard/PanelGroup'


  import EducationNews from './dashboard/EducationNews'
  import YsNotice from './dashboard/YsNotice'
  import Weather from './dashboard/Weather'
  import UserChart from './dashboard/UserChart'
  import MapView from './dashboard/MapView'
  import CourseView from './dashboard/CourseView'


  export default {
    name: 'Dashboard',
    components: {
      MapView,


      PanelGroup,

      EducationNews,
      YsNotice,
      Weather,
      UserChart,
      CourseView


    },
    data() {
      return {}
    },
    methods: {
      handleSetLineChartData(type) {

        alert("点击了了" + type);
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
