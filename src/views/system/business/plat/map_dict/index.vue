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
        <rrOperation :crud="crud">


        </rrOperation>
      </div>

      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">


        <template slot="right">

          <el-button
            v-permission="['admin','sys_map_dict:edit']"
            :disabled="disabledLoad"

            class="filter-item"
            size="mini"
            type="info"
            icon="el-icon-refresh-right"
            @click="flushDB2Redis"
          >同步缓存B
          </el-button>

        </template>

      </crudOperation>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small"
                 label-width="80px">


          <el-form-item
            label="键" prop="key">

            <el-input v-model="form.key" style="width: 370px;"/>


          </el-form-item>


          <el-form-item
            label="值">

            <el-input :rows="3" v-model="form.value" type="textarea"
                      style="width: 370px;"/>


          </el-form-item>


          <el-form-item
            label="备注">

            <el-input :rows="3" v-model="form.remark" type="textarea"
                      style="width: 370px;"/>


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


        <el-table-column prop="key"
                         label="键"/>


        <el-table-column prop="value" label="值">
          <template slot-scope="scope">
            <!--   <div v-html="scope.row.value"></div>-->
            <span>{{scope.row.value.length>=30? scope.row.value.substring(0,30)+'...': scope.row.value}}</span>
          </template>
        </el-table-column>


        <el-table-column prop="remark"
                         label="备注"/>


        <!-- 操作按钮 -->
        <el-table-column v-permission="['admin','sys_map_dict:edit','sys_map_dict:del']" label="操作" width="150px"
                         align="center">
          <template slot-scope="scope">

            <udOperation :data="scope.row" :permission="permission" />


          </template>
        </el-table-column>


      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
  </div>
</template>

<script>
  import crudSysMapDict from '@/api/system/sysMapDict'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  const defaultForm = {
    id:
      null,
    key:
      null,
    value:
      null,
    remark:
      null,
    createBy:
      null,
    updateBy:
      null,
    createTime:
      null,
    updateTime:
      null
  };
  export default {
    name: 'SysMapDict',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    cruds() {
      return CRUD({
        title: '键值对',
        url: 'api/sysMapDict',
        sort: 'id,desc',
        crudMethod: {...crudSysMapDict}
      })
    },
    data() {
      return {
        disabledLoad: false,
        permission: {
          add: ['admin', 'sys_map_dict:add'],
          edit: ['admin', 'sys_map_dict:edit'],
          del: ['admin', 'sys_map_dict:del']
        },
        rules: {
          key:
            [
              {required: true, message: '键不能为空', trigger: 'blur'}
            ]
        },
        queryTypeOptions: [
          {
            key: 'key',
            display_name: '键'
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
      flushDB2Redis() {

        this.disabledLoad = true;
        alert("刷新中TODO 。。。。");

        this.disabledLoad = false;


      }

    }
  }
</script>

<style scoped>

</style>
