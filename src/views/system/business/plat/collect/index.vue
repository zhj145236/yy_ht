<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small"
                 label-width="80px">

          <el-form-item label="用户ID">
            <el-input-number v-model="form.uid" :min="0" :max="99999" label="请输入数字"/>
          </el-form-item>

          <el-form-item label="角色">

            <el-select v-model="form.role" placeholder="请选择">
              <el-option key="par" value="par" label="家长" border/>
              <el-option key="tea" value="tea" label="教师" border/>
              <el-option key="org" value="org" label="培训机构" border/>
              <el-option key="plat" value="plat" label="平台" border/>
              <el-option key="unknow" value="unknow" label="其他" border/>
            </el-select>

          </el-form-item>

          <el-form-item label="引用ID">
            <el-input-number v-model="form.collectId" :min="0" :max="99999" label="请输入数字"/>
          </el-form-item>

          <el-form-item label="收藏类型">

            <el-select v-model="form.type" filterable allow-create placeholder="请选择">
              <el-option
                v-for="item in dict.collect_type" :key="item.id"
                :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>

          <el-form-item label="收藏时间">
            <el-date-picker v-model="form.createTime" type="datetime" style="width: 370px;"/>
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
        `
        <el-table-column prop="role" label="角色"/>

        <el-table-column prop="collectId" label="引用ID"/>

        <el-table-column prop="type" label="收藏类型">
          <template slot-scope="scope">
            {{ dict.label.collect_type[scope.row.type] }}
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="收藏时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>


        <!-- 操作按钮 -->
        <el-table-column v-permission="['admin','plat:collect:edit','plat:collect:del']" label="操作" width="150px"
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
  import crudPlatCollect from '@/api/system/platCollect'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  const defaultForm = {
    id: null, uid: null, role: null, collectId: null, type: null, createTime: null
  };

  export default {
    name: 'PlatCollect',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    dicts: ['collect_type'],
    cruds() {
      return CRUD({
        title: '我的收藏',
        url: 'api/platCollect',
        sort: 'id,desc',
        crudMethod: {...crudPlatCollect}
      })
    },
    data() {
      return {
        permission: {
          add: ['admin', 'plat:collect:add'],
          edit: ['admin', 'plat:collect:edit'],
          del: ['admin', 'plat:collect:del']
        },
        rules: {}
      }
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        return true
      }
    }
  }
</script>

<style scoped>

</style>
