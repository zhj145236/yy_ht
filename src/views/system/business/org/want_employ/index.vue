<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
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

      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small"
                 label-width="80px">


          <el-form-item label="标题">
            <el-input v-model="form.title" style="width: 370px;"  placeholder="必填，50个字以内"/>
          </el-form-item>

          <el-form-item label="招聘人数">
            <el-input-number v-model="form.wantCount" :min="1" :max="99" label="请输入数字" style="width: 370px;"  placeholder="必填"/>
          </el-form-item>

          <el-form-item label="学历要求">

            <el-select v-model="form.educational" filterable allow-create placeholder="请选择" style="width: 370px;">
              <el-option
                v-for="item in dict.educational_limit" :key="item.id"
                :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>

          <el-form-item label="工作年限">

            <el-select v-model="form.workYear" filterable allow-create placeholder="请选择" style="width: 370px;">
              <el-option
                v-for="item in dict.work_year" :key="item.id"
                :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>


          <el-form-item label="薪资范围">

            <el-select v-model="form.salary" filterable allow-create placeholder="请选择" style="width: 370px;">
              <el-option
                v-for="item in dict.salary_range" :key="item.id"
                :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>

          <el-form-item label="职位描述">
            <el-input :rows="3" v-model="form.jobDesc" type="textarea" style="width: 370px;"
                      placeholder="描述一下岗位职责、公司信息等让求职者更了解你公司吧（400字以内）"/>
          </el-form-item>

          <el-form-item label="联系电话">
            <el-input v-model="form.callPhone" style="width: 370px;" prefix-icon="el-icon-phone-outline"
                      placeholder="必填">

            </el-input>
          </el-form-item>

          <el-form-item label="联系人">
            <el-input v-model="form.linkPeople" style="width: 370px;" prefix-icon="el-icon-user" placeholder="必填">

            </el-input>
          </el-form-item>


        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>

      <el-row :gutter="15">


        <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="15" style="margin-bottom: 10px">

          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span class="role-span">已发布的职位</span>
            </div>

            <crudOperation :permission="permission"/>

            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                      @selection-change="jobChange" @current-change="jobChange">


              <el-table-column prop="salary" label="职位信息">
                <template slot-scope="{row}">

                  <h2>{{row.title}}</h2>
                  <h3>
                    <el-link type="warning" v-if="row.salary">
                      {{row.salary}}
                    </el-link>
                    <el-link type="warning" v-if="row.lessonPrice">
                      {{ row.lessonPrice}}
                    </el-link>
                  </h3>
                  <p>
                    <svg-icon icon-class="people"/>
                    招聘{{row.wantCount}}人
                  </p>

                  <p><i class="el-icon-medal"/> {{ row.educational }}</p>

                  <p><i class="el-icon-time"/> {{ row.workYear }}</p>


                </template>
              </el-table-column>


              <el-table-column prop="jobDesc" label="职位描述">
                <template slot-scope="{row}">

                  <p v-if="row.jobDesc && row.jobDesc.length>100">
                    <el-popover
                      placement="top-start"
                      trigger="hover" width="400" offset="40"
                      :content="row.jobDesc">
                      <span slot="reference">{{row.jobDesc.substring(0,100)}}...</span>
                    </el-popover>
                  </p>

                  <p v-else>{{row.jobDesc}}</p>

                </template>
              </el-table-column>


              <el-table-column prop="yyyy" label="联系我">
                <template slot-scope="{row}">

                  <p><i class="el-icon-phone-outline"/> {{row.callPhone}} </p>

                  <p><i class="el-icon-user"/> {{row.linkPeople}} </p>
                </template>
              </el-table-column>


              <!-- 操作按钮 -->
              <el-table-column v-permission="['admin','org:want_employ:edit','org:want_employ:del']" label="操作"
                               width="150px"
                               align="center">
                <template slot-scope="scope">
                  <udOperation
                    :data="scope.row"
                    :permission="permission"
                  />
                </template>
              </el-table-column>


            </el-table>
            <!--分页组件-->
            <pagination/>
          </el-card>

        </el-col>


        <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="9">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <el-tooltip class="item" effect="dark" content="求职者投递本职位的记录" placement="top">
                <span class="role-span">投递记录{{applyData.length<=0? "(暂无)": "("+applyData.length+"条)" }}</span>
              </el-tooltip>


              <el-table ref="table2" :data="applyData" v-loading="dataLoading" style="width: 100%;">


                <el-table-column label="头像">

                  <template slot-scope="{row}">
                    <el-avatar fit="scale-down" shape="circle" :src="fileRefUrl+row.simpleInfoUser.headImg"/>
                  </template>
                </el-table-column>

                <el-table-column label="用户名">
                  <template slot-scope="{row}">
                    <span>{{row.simpleInfoUser.nickName}}</span>
                  </template>
                </el-table-column>

                <el-table-column label="投递时间">
                  <template slot-scope="{row}">
                    <span>{{ parseTime(row.createTime)}}</span>
                  </template>
                </el-table-column>

                <el-table-column prop="interviewStatus" label="状态">
                  <template slot-scope="{row}">
                    <span> {{dict.label.interview_status[row.interviewStatus]}} </span>
                  </template>
                </el-table-column>

                <el-table-column prop="remark" label="操作">

                  <template slot-scope="{row}">
                    <el-link type="primary" @click="viewUserResume(row)">简历</el-link>
                  </template>
                </el-table-column>

              </el-table>

            </div>
          </el-card>
          <br/>
          <el-divider/>
          <br/>
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <el-tooltip class="item" effect="dark" content="用户浏览本职位" placement="top">
                <span class="role-span">浏览记录{{viewData.length<=0? "(暂无)": "("+viewData.length+"条)" }}</span>
              </el-tooltip>

              <el-table ref="table3" :data="viewData" v-loading="dataLoading" style="width: 100%;">

                <el-table-column label="头像">
                  <template slot-scope="{row}">
                    <el-avatar fit="scale-down" shape="circle" :src="fileRefUrl+row.headImg"/>
                  </template>
                </el-table-column>

                <el-table-column prop="xxx" label="用户名">
                  <template slot-scope="{row}">
                    <span>{{row.nickName}}</span>
                  </template>
                </el-table-column>


                <el-table-column prop="zzzz" label="浏览时间">
                  <template slot-scope="{row}">
                    <span> {{row.viewTime}} </span>
                  </template>
                </el-table-column>
              </el-table>

            </div>
          </el-card>
        </el-col>
      </el-row>


      <el-drawer :visible.sync="drawer" :withHeader="false" direction="ltr" :modal="false" size="45%"
                 :show-close="true"
                 :before-close="handleClose">
        <!--:with-header="false"-->

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{userResume.title}}</span>
          </div>
          <div class="text item">
            求职者姓名：{{userResume.name}}
          </div>

          <div class="text item">
            性别：{{userResume.sex}}
          </div>

          <div class="text item">
            出生年月：{{parseTime( userResume.bornDate)}}
          </div>

          <div class="text item">
            目前所在地区：{{userResume.countyCode}}
          </div>

          <div class="text item">
            求职工作：{{userResume.wantJob}}
          </div>


          <div class="text item">
            工作经验：{{userResume.jobExperience}}
          </div>

          <div class="text item">
            工作年限：{{userResume.workYear}}
          </div>

          <div class="text item">
            最高学历：{{userResume.highestEducational}}
          </div>

          <div class="text item">
            标签：{{userResume.tags}}
          </div>

          <div class="text item">
            自我评价：{{userResume.evaluate}}
          </div>
          <div class="text item">
            期望薪资：{{userResume.salary}}
          </div>

        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>求职者联系方式</span>
          </div>
          <div class="text item">
            电话：{{userResume.tel}}
          </div>

          <div class="text item">
            邮箱：{{userResume.email}}
          </div>


        </el-card>

        <el-card class="box-card">
          <!--TODO 留言 回复 未完成 -->
          <div slot="header" class="clearfix">
            <span>留言/回复</span>
          </div>
          <div class="text item">
            求职者留言：{{selectApplyUserRow.sendMessage}}
          </div>
          <div class="text item">
            您的回复：{{selectApplyUserRow.replyMessage}}
          </div>


        </el-card>


        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>我的处理反馈</span>
          </div>
          <div>


            <el-radio-group v-model="selectInterviewStatus">

              <el-radio size="medium" v-if="parseInt(item.value)!==0  ||  parseInt(item.value)!==5 " :label="item.value"
                        border
                        v-for="item in dict.interview_status" @change="interviewStatusChange(item)"> {{item.label}}
              </el-radio>

            </el-radio-group>

          </div>

        </el-card>


      </el-drawer>


    </div>
  </div>
</template>

<script>
  import crudOrgWantEmploy from '@/api/system/orgWantEmploy'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import {mapGetters} from "vuex";


  const defaultForm = {
    id: null,
    orgId: null,
    wantCount: null,
    educational: null,
    workYear: null,
    jobDesc: null,
    salary: null,
    callPhone: null,
    linkPeople: null,
    viewCount: null,
    sort: null,
    enable: true,
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null,
    title: null
  };

  export default {
    name: 'OrgWantEmploy',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    dicts: ['educational_limit', 'salary_range', 'interview_status', 'work_year'],
    cruds() {
      return CRUD({
        title: '招聘信息',
        url: 'api/orgWantEmploy',
        sort: 'id,desc',
        crudMethod: {...crudOrgWantEmploy}
      })
    },
    computed: {
      ...mapGetters([
        'baseApi',
        'fileRefUrl',
      ])
    },

    data() {
      return {

        selectApplyUserRow: {},
        selectInterviewStatus: "",
        aabb: "",

        userResume: {},


        drawer: false,
        direction: 'rtl',

        applyData: [],
        viewData: [],
        dataLoading: false,


        permission: {
          add: ['admin', 'org:want_employ:add'],
          edit: ['admin', 'org:want_employ:edit'],
          del: ['admin', 'org:want_employ:del']
        },
        rules: {

          title:
            [
              {required: true, message: '标题不能为空', trigger: 'blur'}
            ]
        },
        queryTypeOptions: [
          {
            key: 'educational',
            display_name: '学历要求'
          }
        ]
      }
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query;
        if (query.type && query.value) {
          this.crud.params[query.type] = query.value
        }
        return true
      },

      viewUserResume(row) {


        this.selectApplyUserRow = row;

        this.drawer = true;
        this.selectInterviewStatus = row.interviewStatus;
        this.aabb = row.interviewStatus;


        crudOrgWantEmploy.getUserResume({id: row.jid}).then((data) => {

          this.userResume = data;


        }).catch((error) => {
          console.error("后台调用出错：", error);

        });


      },

      jobChange(obj) {

        this.dataLoading = true;

        crudOrgWantEmploy.jobApplyAndView({id: obj.id}).then((data) => {

          this.applyData = data.apply;
          this.viewData = data.view;

          this.dataLoading = false;
        }).catch((error) => {
          console.error("后台调用出错：", error);

          this.dataLoading = false;
        });

      },

      interviewStatusChange(item) {
        console.info(item.value, this.selectInterviewStatus, this.aabb);
      },

      handleClose(done) {


        if (this.selectInterviewStatus !== this.aabb) {


          crudOrgWantEmploy.changeInterviewStatus({
            id: this.userResume.id,
            interviewStatus: this.selectInterviewStatus
          }).then((data) => {


          }).catch((error) => {

            console.error("后台调用出错：", error);

            this.dataLoading = false;
          });

        }
        done();

      },
    }
  }
</script>

<style scoped>


  .text {
    font-size: 17px;
  }

  .item {
    margin-bottom: 20px;
  }

</style>
