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


          <el-form-item label="内容">
            <el-input :rows="3" v-model="form.content" type="textarea" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="图片">
            <el-input v-model="form.picture" style="width: 370px;"/>
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

        <el-table-column prop="uid" label="用户ID"/>

        <el-table-column prop="content" label="内容"/>

        <el-table-column prop="picture" label="图片"/>


        <el-table-column prop="createTime" label="发布时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>


        <!-- 操作按钮 -->
        <el-table-column v-permission="['admin','org:circle_message:edit','org:circle_message:del']" label="操作"
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
  import crudOrgCircleMessage from '@/api/system/orgCircleMessage'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import {mapGetters} from "vuex";

  const defaultForm = {
    id: null, uid: null, content: null, picture: null, sort: null, createTime: null, enable: true
  };

  export default {
    name: 'OrgCircleMessage',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    cruds() {
      return CRUD({
        title: '动态',
        url: 'api/orgCircleMessage',
        sort: 'id,desc',
        crudMethod: {...crudOrgCircleMessage}
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
          add: ['admin', 'org:circle_message:add'],
          edit: ['admin', 'org:circle_message:edit'],
          del: ['admin', 'org:circle_message:del']
        },
        rules: {},
        queryTypeOptions: [
          {
            key: 'uid',
            display_name: '用户ID'
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
