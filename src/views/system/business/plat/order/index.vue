<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item"
                  @keyup.enter.native="crud.toQuery"/>
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
        <el-date-picker
          v-model="query.incomeTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="入账时间"
          end-placeholder="入账时间"
        />
        <el-date-picker
          v-model="query.serveBeginDate"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="服务开始时间"
          end-placeholder="服务开始时间"
        />
        <el-date-picker
          v-model="query.serveEndDate"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="服务到期时间"
          end-placeholder="服务到期时间"
        />
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">

          <el-form-item label="机构ID" prop="orgId">
            <el-input v-model="form.orgId" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="付款人名称">
            <el-input v-model="form.payer" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="form.contact" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="附件">
            <!-- (收款截图，电子发票等，银行流水号等) -->
            <el-input v-model="form.attachment" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="入账时间">
            <el-date-picker v-model="form.incomeTime" type="datetime" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="开始服务时间">
            <el-date-picker v-model="form.serveBeginDate" type="datetime" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="服务时长">
            <!-- （天）-->
            <el-input v-model="form.serveDay" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="结束服务时间">
            <el-date-picker v-model="form.serveEndDate" type="datetime" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input :rows="3" v-model="form.remark" type="textarea" style="width: 370px;"/>
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
        <el-table-column prop="orgId" label="机构ID"/>
        <el-table-column prop="payer" label="付款人名称"/>
        <el-table-column prop="contact" label="联系方式"/>
        <el-table-column prop="attachment" label="附件"/>
        <!-- (收款截图，电子发票等，银行流水号等)-->
        <el-table-column prop="incomeTime" label="入账时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.incomeTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="serveBeginDate" label="开始服务时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.serveBeginDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="serveDay" label="服务时长"/>
        <!-- （天） -->
        <el-table-column prop="serveEndDate" label="结束服务时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.serveEndDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"/>
        <el-table-column v-permission="['admin','plat:order:edit','plat:order:del']" label="操作" width="150px"
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
  import crudPlatOrder from '@/api/system/platOrder'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  const defaultForm = {
    id: null,
    orgId: null,
    payer: null,
    contact: null,
    attachment: null,
    incomeTime: null,
    serveBeginDate: null,
    serveDay: null,
    serveEndDate: null,
    remark: null,
    enable: null,
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null
  }
  export default {
    name: 'PlatOrder',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    cruds() {
      return CRUD({title: '充值记录', url: 'api/platOrder', sort: 'id,desc', crudMethod: {...crudPlatOrder}})
    },
    data() {
      return {
        permission: {
          add: ['admin', 'plat:order:add'],
          edit: ['admin', 'plat:order:edit'],
          del: ['admin', 'plat:order:del']
        },
        rules: {
          orgId: [
            {required: true, message: '机构ID不能为空', trigger: 'blur'}
          ]
        },
        queryTypeOptions: [
          {key: 'orgId', display_name: '机构ID'},
          {key: 'payer', display_name: '付款人名称'},
          {key: 'serveDay', display_name: '服务时长'}

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
