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


          <el-form-item label="头像">
            <el-input v-model="form.headImg" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="教师姓名">
            <el-input v-model="form.realName" style="width: 370px;" placeholder="必填"/>
          </el-form-item>

          <el-form-item label="学生数">
            <el-input v-model="form.teachStudent" placeholder="此教师累计授课过的学生数量" style="width: 370px;">
              <template slot="append">名</template>
            </el-input>
          </el-form-item>

          <el-form-item label="教授课程">
            <el-input v-model="form.teachCourse" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="教龄">
            <el-input v-model="form.teachYear" placeholder="请输入正整数" style="width: 370px;">
              <template slot="append">年</template>
            </el-input>
          </el-form-item>

          <el-form-item label="联系电话">
            <el-input v-model="form.callTel" style="width: 370px;" placeholder="教师的联系电话，选填"/>
          </el-form-item>


          <el-form-item label="描述教师">
            <el-input :rows="3" v-model="form.desc" style="width: 370px;" type="textarea"
                      placeholder="请用0-200字描述一下教师（如学历，特长等），让家长更懂Ta"/>
          </el-form-item>

          <el-form-item label="座右铭">
            <el-input v-model="form.motto" style="width: 370px;" placeholder="教师的座右铭，选填"/>
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


        <el-table-column prop="headImg" label="头像">
          <template slot-scope="{row}">
            <el-avatar :size="60" fit="scale-down" shape="circle" :src="fileRefUrl+row.headImg"/>
          </template>
        </el-table-column>

        <el-table-column prop="realName" label="教师姓名"/>

        <el-table-column prop="teachStudent" label="授课过的学生数量">
          <template slot-scope="{row}">
            <span v-if="row.teachStudent && row.teachStudent>0"> {{row.teachStudent}}人</span>
          </template>
        </el-table-column>

        <el-table-column prop="teachCourse" label="教授的课程"/>

        <el-table-column prop="teachYear" label="教龄">
          <template slot-scope="{row}">
            <span v-if="row.teachYear && row.teachYear>0"> {{row.teachYear}}年</span>
          </template>
        </el-table-column>

        <el-table-column prop="callTel" label="联系电话"/>

        <el-table-column prop="motto" label="座右铭">

          <template slot-scope="{row}">
            <p v-if="row.motto && row.motto.length>40">
              <el-popover
                placement="top-start"
                trigger="hover" width="400" offset="40"
                :content="row.motto">
                <span slot="reference">{{row.motto.substring(0,40)}}...</span>
              </el-popover>
            </p>
            <p v-else>{{row.motto}}</p>

          </template>

        </el-table-column>

        <el-table-column prop="desc" label="描述教师">
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


        <!-- 操作按钮 -->
        <el-table-column v-permission="['admin','org:good_teacher:edit','org:good_teacher:del']" label="操作"
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
  import crudOrgGoodTeacher from '@/api/system/orgGoodTeacher'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import {mapGetters} from "vuex";

  const defaultForm = {
    id: null,
    oid: null,
    tid: null,
    headImg: null,
    realName: null,
    teachStudent: null,
    teachCourse: null,
    teachYear: null,
    callTel: null,
    motto: null,
    sort: null,
    enable: null,
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null
  };

  export default {
    name: 'OrgGoodTeacher',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    cruds() {
      return CRUD({
        title: '机构师资',
        url: 'api/orgGoodTeacher',
        sort: 'id,desc',
        crudMethod: {...crudOrgGoodTeacher}
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
          add: ['admin', 'org:good_teacher:add'],
          edit: ['admin', 'org:good_teacher:edit'],
          del: ['admin', 'org:good_teacher:del']
        },
        rules: {},
        queryTypeOptions: [
          {
            key: 'oid',
            display_name: '机构ID'
          },
          {
            key: 'tid',
            display_name: '教师ID'
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
