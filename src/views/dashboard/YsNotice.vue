<template>

  <div style=" margin-top: 20px">


    <el-table :height="350" :data="tableData" stripe style="width: 100%"  @row-click="(row, column, event) => showDetail(row)" >


      <el-table-column label="平台公告" header-align="center" >

        <el-table-column prop="title" label="标题" min-width="200px">
          <template slot-scope="{row}">
            <i style="color: #E65D6E" class="el-icon-hot-water" v-if="new Date().getTime()-row.createTime<864000000"/>
            <span> <el-link @click="showDetail(row)">{{row.title}}</el-link> </span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="发布日期" min-width="100px">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime)}}</span>
          </template>
        </el-table-column>


      </el-table-column>

    </el-table>


    <el-dialog :title="noticeTitle" :visible.sync="dialogTableVisible" :append-to-body="true">

      <el-row>
        <div v-html="contentHtml" style="width: 100%"></div>
      </el-row>
    </el-dialog>

  </div>

</template>

<script>

  import {ysnotice} from '@/api/dashboard'
  import {parseTime} from '@/utils/index'

  export default {

    props: {
      chartData6: {
        type: Object,
        required: true
      }
    },
    data() {
      return {

        tableData: [],
        dialogTableVisible: false,

        noticeTitle: "通知公告",
        contentHtml: "内容详情"
      }
    },
    watch: {},
    mounted() {

      this.initData();

    },

    methods: {
      parseTime,


      showDetail(obj) {

        this.noticeTitle = obj.title;
        this.contentHtml = obj.content;

        this.dialogTableVisible = true;

      },
      initData() {

        ysnotice().then((data) => {


          this.tableData = data.content;


        }).catch((error) => {
           console.error("后台调用出错：", error);
        });


      }

    }
  }
</script>
