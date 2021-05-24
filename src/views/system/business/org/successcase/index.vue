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
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small"
                 label-width="80px">

          <!--   <el-form-item label="机构ID">
               <el-input-number v-model="form.oid" :min="0" :max="99999" label="请输入数字"/>
             </el-form-item>-->

          <!--    <el-form-item label="学生ID">
                <el-input-number v-model="form.sid" :min="0" :max="99999" label="请输入数字"/>
              </el-form-item>-->

          <el-form-item label="学生头像">
            <el-input v-model="form.headImg" style="width: 370px;"/>


          </el-form-item>

          <el-form-item label="学生姓名">
            <el-input v-model="form.realName" style="width: 370px;" placeholder="必填，在小程序主页里系统会自动为名字部分*号打码，保护学生隐私"/>
          </el-form-item>

          <!--   <el-form-item label="课程ID">
               <el-input-number v-model="form.courseId" :min="0" :max="99999" label="请输入数字"/>
             </el-form-item>-->

          <el-form-item label="课程名称">
            <el-input v-model="form.courseName" style="width: 370px;" placeholder="此学生参加的课程名称,必填"/>
          </el-form-item>

          <el-form-item label="学生作品">

            <el-input v-model="form.attachment" style="width: 370px;"/>

          </el-form-item>

          <el-form-item label="描述">
            <el-input :rows="4" v-model="form.desc" type="textarea" style="width: 370px;"
                      placeholder="本成功案例描述（如学生辅导前后的成绩对比描述），选填"/>
          </el-form-item>

          <el-form-item label="学员心声">
            <el-input :rows="3" v-model="form.feedback" type="textarea" style="width: 370px;"
                      placeholder="请填写此学生对本机构的留言评价，选填"/>
          </el-form-item>


        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">

        <el-table-column type="selection" width="55"/>


        <!-- <el-table-column prop="oid" label="机构ID"/>

         <el-table-column prop="sid" label="学生ID"/>
 -->
        <el-table-column prop="headImg" label="头像">
          <template slot-scope="{row}">
            <el-avatar :size="60" fit="scale-down" shape="circle" :src="fileRefUrl+row.headImg"/>
          </template>
        </el-table-column>

        <el-table-column prop="realName" label="真实姓名"/>

        <!--   <el-table-column prop="courseId" label="课程ID"/>-->

        <el-table-column prop="courseName" label="课程名称"/>

        <el-table-column prop="attachment" label="学生的作品"/>

        <el-table-column prop="desc" label="案例描述">
          <template slot-scope="{row}">

            <p v-if="row.desc && row.desc.length>40">
              <el-popover
                placement="top-start"
                trigger="hover" width="400" offset="40"
                :content="row.desc">
                <span slot="reference">{{row.desc.substring(0,40)}}...</span>
              </el-popover>
            </p>
            <p v-else>{{row.desc}}</p>
          </template>
        </el-table-column>

        <el-table-column prop="feedback" label="学员心声">
          <template slot-scope="{row}">
            <p v-if="row.feedback && row.feedback.length>40">
              <el-popover
                placement="top-start"
                trigger="hover" width="400" offset="40"
                :content="row.feedback">
                <span slot="reference">{{row.feedback.substring(0,40)}}...</span>
              </el-popover>
            </p>
            <p v-else>{{row.feedback}}</p>
          </template>
        </el-table-column>


        <!-- 操作按钮 -->
        <el-table-column v-permission="['admin','org:success_case:edit','org:success_case:del']" label="操作"
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
    </div>
  </div>
</template>

<script>
  import crudOrgSuccessCase from '@/api/system/orgSuccessCase'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import {mapGetters} from "vuex";

  const defaultForm = {
    id: null,
    oid: null,
    sid: null,
    headImg: null,
    realName: null,
    courseId: null,
    courseName: null,
    attachment: null,
    desc: null,
    feedback: null,
    sort: null,
    enable: null,
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null
  };

  export default {
    name: 'OrgSuccessCase',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    cruds() {
      return CRUD({
        title: '成功案例',
        url: 'api/orgSuccessCase',
        sort: 'id,desc',
        crudMethod: {...crudOrgSuccessCase}
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
        permission: {
          add: ['admin', 'org:success_case:add'],
          edit: ['admin', 'org:success_case:edit'],
          del: ['admin', 'org:success_case:del']
        },
        rules: {},
        queryTypeOptions: [
          {
            key: 'oid',
            display_name: '机构ID'
          },
          {
            key: 'sid',
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
