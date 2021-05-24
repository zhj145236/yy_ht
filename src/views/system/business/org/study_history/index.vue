<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">

      <el-row :gutter="15">

        <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14" style="margin-bottom: 10px">

          <el-card class="box-card" shadow="never">

            <el-calendar v-model="selectDate">
              <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
              <template slot="dateCell" slot-scope="{date, data}">

                <div>
                  <span style="font-size: 22px">{{ data.day.split('-')[2] }} </span>
                  <br/> <br/>
                  <p style="color: #40c9c6;text-align: right"
                     v-if="datas[data.day.split('-').join('/')] && datas[data.day.split('-').join('/')].length>0">
                    <i class="el-icon-s-flag"/>{{(datas[data.day.split('-').join("/")]).length }}
                  </p>
                </div>
              </template>
            </el-calendar>

          </el-card>
        </el-col>

        <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="9">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <el-tooltip class="item" effect="dark" content="点击左侧日期查看当前上课记录" placement="top">
                <span class="role-span">{{translateDate(selectDate,'MM月dd日')}}上课记录</span>
              </el-tooltip>
            </div>

            <!--表格渲染-->
            <el-table ref="table" :data="thisDayHistory" stripe border height="565">
              <el-table-column prop="stuName" label="学生"/>
              <el-table-column prop="courseName" label="课程"/>
              <el-table-column prop="remark" label="备注">
                <template slot-scope="{row}">
                  <p><span style="font-size: 16px">{{row.smallSet}}节</span> {{row.remark}}</p>
                </template>

              </el-table-column>

            </el-table>

          </el-card>
        </el-col>

      </el-row>

    </div>
  </div>
</template>

<script>
  import crudOrgbackStudyHistory from '@/api/system/orgbackStudyHistory'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  import {translateDate} from "@/utils/index";


  const defaultForm = {
    id: null,
    oid: null,
    studyDate: null,
    stuId: null,
    stuName: null,
    courseId: null,
    courseName: null,
    smallSet: null,
    remark: null,
    createBy: null,
    createTime: null
  };

  export default {
    name: 'OrgbackStudyHistory',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    cruds() {
      return CRUD({
        title: '学生上课记录',
        url: 'api/orgbackStudyHistory',
        sort: 'id,desc',
        crudMethod: {...crudOrgbackStudyHistory}
      })
    },

    watch: {

      selectDate(value) {


        let tt = value.getTime();

        if (this.datas[translateDate(tt, "yyyy/MM/dd")]) {

          this.thisDayHistory = this.datas[translateDate(tt, "yyyy/MM/dd")];

        } else {

          this.fetchData(tt);
        }

      }
    },

    mounted() {

      this.fetchData(null);
    },

    data() {
      return {

        thisDayHistory: [],
        datas: {},
        selectDate: null,

        permission: {
          add: ['admin', 'orgback_study_history:add'],
          edit: ['admin', 'orgback_study_history:edit'],
          del: ['admin', 'orgback_study_history:del']
        },
        rules: {
          oid:
            [
              {required: true, message: '机构ID不能为空', trigger: 'blur'}
            ]
        },
        queryTypeOptions: [
          {
            key: 'oid',
            display_name: '机构ID'
          },
          {
            key: 'stuId',
            display_name: '学生ID'
          },
          {
            key: 'courseId',
            display_name: '课程ID'
          }
        ]
      }
    },
    methods: {


      fetchData(selectDate) {

        crudOrgbackStudyHistory.rangeHistory(selectDate).then((data) => {

          this.datas = Object.assign({}, this.datas, data.collect);
          this.thisDayHistory = this.datas[translateDate(selectDate, "yyyy/MM/dd")];

        }).catch(() => {

          console.error("后台调用出错：", error);

        })

      },


      translateDate,
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query;
        if (query.type && query.value) {
          this.crud.params[query.type] = query.value
        }
        return true
      }
    }
  }
</script>

<style scoped>


</style>
