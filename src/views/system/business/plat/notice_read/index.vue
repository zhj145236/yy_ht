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

          <el-form-item label="消息ID" prop="nid">
            <el-input-number v-model="form.nid" :min="0" :max="99999" label="请输入数字"/>
          </el-form-item>

          <el-form-item label="用户ID" prop="uid">
            <el-input-number v-model="form.uid" :min="0" :max="99999" label="请输入数字"/>
          </el-form-item>

          <el-form-item label="阅读时间">
            <el-date-picker v-model="form.readTime" type="datetime" style="width: 370px;"/>
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


        <el-table-column prop="nid" label="消息ID"/>

        <el-table-column prop="uid" label="用户ID"/>

        <el-table-column prop="readTime" label="阅读时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.readTime) }}</span>
          </template>
        </el-table-column>


        <!-- 操作按钮 -->
        <el-table-column v-permission="['admin','plat:notice_read:edit','plat:notice_read:del']" label="操作"
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
  import crudPlatNoticeRead from '@/api/system/platNoticeRead'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  const defaultForm = {
    id: null, nid: null, uid: null, readTime: null
  };

  export default {
    name: 'PlatNoticeRead',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    cruds() {
      return CRUD({
        title: '消息已读记录',
        url: 'api/platNoticeRead',
        sort: 'id,desc',
        crudMethod: {...crudPlatNoticeRead}
      })
    },
    data() {
      return {
        permission: {
          add: ['admin', 'plat:notice_read:add'],
          edit: ['admin', 'plat:notice_read:edit'],
          del: ['admin', 'plat:notice_read:del']
        },
        rules: {
          nid:
            [
              {required: true, message: '消息ID不能为空', trigger: 'blur'}
            ],
          uid:
            [
              {required: true, message: '用户ID不能为空', trigger: 'blur'}
            ]
        },
        queryTypeOptions: [
          {
            key: 'nid',
            display_name: '消息ID'
          },
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
