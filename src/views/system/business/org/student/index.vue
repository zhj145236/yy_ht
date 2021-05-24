<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">


      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="520px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">


          <el-form-item label="学生姓名">
            <el-input v-model="form.name" style="width: 370px;" placeholder="学生姓名，必填"/>
          </el-form-item>

          <el-form-item label="学生性别">
            <el-radio-group v-model="form.sex">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
              <el-radio label="保密">保密</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="生日">
            <el-date-picker v-model="form.birthDate" type="date" style="width: 370px;" placeholder="学生的生日，选填"/>

          </el-form-item>

          <!--<el-form-item label="家长ID">&lt;!&ndash;,为org_back_consumer的主键ID-&ndash;&gt;
            <el-input-number v-model="form.parId" :min="0" :max="99999" label="请输入数字"/>
          </el-form-item>-->

          <el-form-item label="关联家长">
            <!-- <el-input v-model="form.parName" style="width: 370px;"/>-->

            <el-select v-model="form.parName" filterable placeholder="请绑定家长" style="width: 370px;"
                       @change="myCustomListChange">
              <el-option
                v-for="item in  myCustomList"
                :key="item.value"
                :label="item.label"
                :value="item">
              </el-option>
            </el-select>

          </el-form-item>


          <!-- <el-form-item label="教员ID">&lt;!&ndash; ,为org_back_employee的主键ID!&ndash;&gt;
             <el-input-number v-model="form.teaId" :min="0" :max="99999" label="请输入数字"/>
           </el-form-item>-->

          <el-form-item label="关联教员">
            <!-- <el-input v-model="form.teaName" style="width: 370px;"/>-->
            <el-select v-model="form.teaName" filterable placeholder="请绑定教员" style="width: 370px;"
                       @change="myEmployeeChange">
              <el-option
                v-for="item in  myEmployeeList"
                :key="item.value"
                :label="item.label"
                :value="item">
              </el-option>
            </el-select>

          </el-form-item>

          <!-- <el-form-item label="课程ID">
             <el-input-number v-model="form.courseId" :min="0" :max="99999" label="请输入数字"/>
           </el-form-item>-->

          <el-form-item label="关联课程">
            <!--   <el-input v-model="form.courseName" style="width: 370px;"/>-->

            <el-select v-model="form.courseName" filterable placeholder="请绑定课程" style="width: 370px"
                       @change="myCourseChange">
              <el-option
                v-for="item in  myCourseList"
                :key="item.value"
                :label="item.label"
                :value="item">
              </el-option>
            </el-select>

          </el-form-item>

          <el-form-item label="课程价格">
            <el-input prefix-icon="el-icon-money" v-model="form.coursePrice" style="width: 370px"  placeholder="课程价格，系统自动设置" :readonly="true"/>
          </el-form-item>

          <el-form-item label="总课程节数">
            <el-input prefix-icon="el-icon-coin" v-model="form.courseSetCount" style="width: 370px"  placeholder="总课程节数，系统自动设置" :readonly="true"/>
          </el-form-item>

          <el-form-item label="已上完节数">
            <el-input prefix-icon="el-icon-finished" v-model="form.finishCount"  style="width: 370px" :readonly="true" placeholder="已经上完的节数，系统自动设置"/>
          </el-form-item>

          <el-form-item label="备注">
            <el-input prefix-icon="el-icon-notebook-2" v-model="form.remark" style="width: 370px;"   placeholder="选填"/>
          </el-form-item>


        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>


      <el-row :gutter="15">
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">

          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span class="role-span">学生/课程</span>
            </div>

            <div v-if="crud.props.searchToggle">
              <!-- 搜索 -->
              <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;"
                        class="filter-item" @keyup.enter.native="crud.toQuery"/>
              <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
                <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name"
                           :value="item.key"/>
              </el-select>

              <rrOperation :crud="crud"/>
            </div>


            <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
            <crudOperation :permission="permission"/>

            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                      @selection-change="crud.selectionChangeHandler" @current-change="handleCurrentChange">

              <!-- <el-table-column type="selection" width="55"/>-->


              <el-table-column prop="yyyyy" label="学生">
                <template slot-scope="{row}">
                  <p>姓名：{{row.name}}</p>
                  <p>性别：{{row.sex}}</p>
                  <p>出生年月：{{translateDate(row.birthDate)}}</p>
                  <p>备注：{{ row.remark}}</p>
                </template>
              </el-table-column>

              <!-- ,为org_back_consumer的主键ID -->
              <!--  <el-table-column prop="parId" label="家长ID"/>-->

              <!-- <el-table-column prop="parName" label="关联家长"/>-->

              <!--,为org_back_employee的主键ID!-->
              <!--<el-table-column prop="teaId" label="教员ID"/>-->
              <!--  <el-table-column prop="courseId" label="课程ID"/>-->
              <!--  <el-table-column prop="courseSetCount" label="总课程节数"/>

                      <el-table-column prop="finishCount" label="已经上完的节数"/>-->

              <el-table-column prop="xxxxx" label="关联信息">
                <template slot-scope="{row}">
                  <p>关联教员:{{row.teaName}}</p>
                  <p>关联课程:{{row.courseName}}</p>
                  <p>
                    课程总价：
                    <svg-icon icon-class="money"/>
                    {{row.coursePrice}}
                  </p>
                </template>
              </el-table-column>


              <el-table-column prop="xxxx" label="课程进度">
                <template slot-scope="{row}">
                  <p>
                    <el-progress :text-inside="true" :stroke-width="26"
                                 :percentage="getPercentage(row)"
                                 status="success"/>
                  </p>
                  <h2>{{row.finishCount}}节 / {{row.courseSetCount}}节</h2>
                  <p>
                    <el-button icon="el-icon-coordinate" @click="addHistory(row)">上课签到</el-button>
                    <el-button icon="el-icon-date" @click="handleCurrentChange(row)">上课记录</el-button>
                  </p>
                </template>
              </el-table-column>


              <!-- 操作按钮 -->
              <el-table-column v-permission="['admin','orgback_student:edit','orgback_student:del']" label="操作A"
                               width="150px"
                               align="center">
                <template slot-scope="scope">
                  <udOperation
                    :data="scope.row"
                    :permission="permission"
                  >
                  </udOperation>

                </template>
              </el-table-column>


            </el-table>
            <!--分页组件-->
            <pagination/>
          </el-card>

        </el-col>

        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <el-tooltip class="item" effect="dark" content="选择学生查看其上课情况" placement="top">
                <span class="role-span"> {{title}}上课记录</span>
              </el-tooltip>


              <el-table ref="table" :data="historyData" size="small" style="width: 100%;">


                <el-table-column prop="studyDate" label="上课时间"/>

                <el-table-column prop="smallSet" label="课程节数"/>

                <el-table-column prop="remark" label="备注"/>

              </el-table>


            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>


    <!--   <el-dialog
         title="上课记录"
         :visible.sync="centerDialogVisible"
         width="80%" center>



         <span slot="footer" class="dialog-footer">
       <el-button @click="centerDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
         </span>
       </el-dialog>-->


  </div>
</template>

<script>
  import crudOrgbackStudent from '@/api/system/orgbackStudent'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import {myCustom, myEmployee, myCourse} from "@/api/system/orgbackStudent";
  import {translateDate, translateTime} from "@/utils/index";

  import {getStudyHistory} from '@/api/system/orgbackStudent';

  const defaultForm = {
    id: null,
    oid: null,
    name: null,
    sex: '男',
    birthDate: null,
    parId: null,
    parName: null,
    teaId: null,
    teaName: null,
    courseId: null,
    courseName: null,
    coursePrice: null,
    courseSetCount: null,
    finishCount: null,
    remark: null,
    sort: null,
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null
  };

  export default {
    name: 'OrgbackStudent',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    cruds() {
      return CRUD({
        title: '学生管理',
        url: 'api/orgbackStudent',
        sort: 'id,desc',
        crudMethod: {...crudOrgbackStudent}
      })
    },

    mounted() {


      myCustom().then((data) => {
        this.myCustomList = data;
      }).catch((error) => {
        console.error(error, "error");
      });

      myEmployee().then((data) => {
        this.myEmployeeList = data;
      }).catch((error) => {
        console.error(error, "error");
      });

      myCourse().then((data) => {
        this.myCourseList = data;
      }).catch((error) => {
        console.error(error, "error");
      });

    },
    data() {
      return {

        title: "",
        historyData: [],
        centerDialogVisible: false,
        myCourseList: [],
        myEmployeeList: [],
        myCustomList: [],

        permission: {
          add: ['admin', 'orgback_student:add'],
          edit: ['admin', 'orgback_student:edit'],
          del: ['admin', 'orgback_student:del']
        },
        rules: {
          oid:
            [
              {required: true, message: '机构ID不能为空', trigger: 'blur'}
            ]
        },


        queryTypeOptions: [
          {
            key: 'name',
            display_name: '学生名'
          },
          {
            key: 'teaName',
            display_name: '教员名'
          },
          {
            key: 'courseName',
            display_name: '课程标题'
          },


        ]


      }
    },
    methods: {

      translateDate,

      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {

        const query = this.query;
        if (query.type && query.value) {
          this.crud.params[query.type] = query.value
        } else {

          this.crud.params = {};

        }

        return true
      },


      /**
       * 上课签到
       */
      addHistory(row) {

        // TODO  未实现
        alert("未实现");

      },


      handleCurrentChange(row) {


        if (row.courseId) {
          // 加载全部
          getStudyHistory({stuId: row.id, courseId: row.courseId}).then((data) => {

            this.title = row.name + "的";

            this.historyData = data.content;

          }).catch((error) => {
             console.error("后台调用出错：", error);
          });
        } else {

          this.$message({
            message: '此学生没有绑定课程，无法查看上课记录，请先编辑完善信息',
            type: 'warning'
          })
        }


      },

      myCustomListChange(item) {

        this.form.parId = item.value;
        this.form.parName = item.label;


      },

      myEmployeeChange(item) {


        this.form.teaId = item.value;
        this.form.teaName = item.label;


      },

      myCourseChange(item) {


        this.form.courseId = item.value;
        this.form.courseName = item.label;
        this.form.coursePrice = item.price;
        this.form.courseSetCount = item.setCount;


      },

      getPercentage(row) {

        if ((row.finishCount = row.finishCount || 0) === 0) {
          return 0;
        } else if ((row.courseSetCount = row.courseSetCount || 0) === 0) {
          return 0;
        } else {
          return parseInt(((row.finishCount / row.courseSetCount) * 100).toFixed(0));
        }
      }

    }
  }
</script>

<style scoped>

</style>
