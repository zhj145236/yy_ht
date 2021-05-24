<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">

        <template slot="right">

          <el-button
            v-permission="['admin','plat:faq:edit']"
            :disabled="disabledLoad"

            class="filter-item"
            size="mini"
            type="info"
            icon="el-icon-sort"
            @click="flushDB2Redis"
          >同步到缓存
          </el-button>

        </template>

      </crudOperation>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small"
                 label-width="80px">


          <el-form-item
            label="问题">

            <el-input :rows="3" v-model="form.question" type="textarea"
                      style="width: 370px;"/>


          </el-form-item>


          <el-form-item
            label="回答">

            <el-input :rows="3" v-model="form.answer" type="textarea"
                      style="width: 370px;"/>


          </el-form-item>


          <el-form-item
            label="排序">

            <el-input v-model="form.sort" style="width: 370px;"/>


          </el-form-item>


          <el-form-item
            label="类型">


            <el-select v-model="form.type" filterable
                       placeholder="请选择">
              <el-option
                v-for="item in dict.faq_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"/>
            </el-select>

          </el-form-item>


          <el-form-item label="是否有效" prop="enable">
            <el-radio v-model="form.enable" :label="true" border>启用</el-radio>
            <el-radio v-model="form.enable" :label="false" border>禁用</el-radio>
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


        <el-table-column prop="question"
                         label="问题"/>


        <el-table-column prop="answer"
                         label="回答"/>


        <el-table-column prop="sort"
                         label="排序"/>


        <el-table-column prop="type"
                         label="类型">
          <template slot-scope="scope">
            {{ dict.label.faq_type[scope.row.type] }}
          </template>
        </el-table-column>


        <el-table-column prop="enable" label="是否有效">
          <template slot-scope="scope">
            <el-tag :type="scope.row.enable? 'success':'danger' " effect="plain">
              {{ scope.row.enable? '是':'否'}}
            </el-tag>
          </template>
        </el-table-column>


        <!-- 操作按钮 -->
        <el-table-column v-permission="['admin','plat:faq:edit','plat:faq:del']" label="操作" width="150px"
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
  import crudPlatFaq from '@/api/system/platFaq'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  const defaultForm = {
    id:
      null,
    question:
      null,
    answer:
      null,
    sort:
      null,
    type:
      null,
    enable:
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
    name: 'PlatFaq',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    dicts: ['faq_type'],
    cruds() {
      return CRUD({
        title: '问答中心',
        url: 'api/platFaq',
        sort: 'id,desc',
        crudMethod: {...crudPlatFaq}
      })
    },
    data() {
      return {
        disabledLoad: false,
        permission: {
          add: ['admin', 'plat:faq:add'],
          edit: ['admin', 'plat:faq:edit'],
          del: ['admin', 'plat:faq:del']
        },
        rules: {}
      }
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        return true
      },
      flushDB2Redis() {

        this.disabledLoad = true;
        alert("刷新中 TODO 。。。。");

        this.disabledLoad = false;


      }

    }
  }
</script>

<style scoped>

</style>
