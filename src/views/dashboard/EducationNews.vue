<template>

  <div style=" margin-top: 20px">


    <el-table :height="350" :data="tableData" stripe style="width: 100%">


      <el-table-column label="教育方针" header-align="center" width="100%">

        <el-table-column prop="incomeTime" label="标题"   min-width="200px">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.serveBeginDate) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="incomeTime" label="发布日期"  min-width="100px">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.incomeTime) }}</span>
          </template>
        </el-table-column>


      </el-table-column>

    </el-table>
  </div>

</template>

<script>


  import {parseTime} from '@/utils/index'

  export default {

    props: {
      chartData5: {
        type: Object,
        required: true
      }
    },
    data() {
      return {

        tableData: []

      }
    },
    watch: {},
    mounted() {

      this.initData();

    },

    methods: {
      parseTime,

      initData() {

       /* orderTop10().then((data) => {
          this.tableData = data;
        }).catch((error) => {
          //  console.error("后台调用出错：", error);
        });*/


      }

    }
  }
</script>
