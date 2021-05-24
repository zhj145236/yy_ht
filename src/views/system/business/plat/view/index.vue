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

          <el-form-item label="用户ID" prop="uid">
            <el-input-number v-model="form.uid" :min="0" :max="99999" label="请输入数字"/>
          </el-form-item>

          <el-form-item label="身份A">

            <el-select v-model="form.role" placeholder="请选择">
              <el-option key="par" value="par" label="家长" border/>
              <el-option key="tea" value="tea" label="教师" border/>
              <el-option key="org" value="org" label="培训机构" border/>
              <el-option key="plat" value="plat" label="平台" border/>
              <el-option key="unknow" value="unknow" label="其他" border/>
            </el-select>
          </el-form-item>

          <el-form-item label="引用ID" prop="refId">
            <el-input-number v-model="form.refId" :min="0" :max="99999" label="请输入数字"/>
          </el-form-item>

          <el-form-item label="访问时间">
            <el-date-picker v-model="form.viewTime" type="datetime" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="浏览类型">

            <el-select v-model="form.viewType" filterable allow-create placeholder="请选择">
              <el-option
                v-for="item in dict.view_type" :key="item.id"
                :label="item.label" :value="item.value"/>
            </el-select>
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

        <el-table-column prop="role" label="角色"/>

        <el-table-column prop="refId" label="引用ID"/>

        <el-table-column prop="viewTime" label="访问时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.viewTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注"/>

        <el-table-column prop="viewType" label="浏览类型">
          <template slot-scope="scope">
            {{ dict.label.view_type[scope.row.viewType] }}
          </template>
        </el-table-column>


        <!-- 操作按钮 -->
        <el-table-column v-permission="['admin','plat:view:edit','plat:view:del']" label="操作" width="150px"
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
  import crudPlatView from '@/api/system/platView'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  const defaultForm = {
    id: null, uid: null, role: null, refId: null, viewTime: null, remark: null, viewType: null
  };

  export default {
    name: 'PlatView',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    dicts: ['view_type'],
    cruds() {
      return CRUD({
        title: '用户浏览情况',
        url: 'api/platView',
        sort: 'id,desc',
        crudMethod: {...crudPlatView}
      })
    },
    data() {
      return {
        permission: {
          add: ['admin', 'plat:view:add'],
          edit: ['admin', 'plat:view:edit'],
          del: ['admin', 'plat:view:del']
        },
        rules: {
          uid:
            [
              {required: true, message: '用户ID不能为空', trigger: 'blur'}
            ],
          refId:
            [
              {required: true, message: '引用ID不能为空', trigger: 'blur'}
            ]
        },
        queryTypeOptions: [
          {
            key: 'uid',
            display_name: '用户ID'
          },
          {
            key: 'refId',
            display_name: '引用ID'
          },
          {
            key: 'viewTime',
            display_name: '访问时间'
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
