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

          <el-form-item label="发送者ID">
            <el-input-number v-model="form.sendId" :min="0" :max="99999" label="请输入数字"/>
          </el-form-item>

          <el-form-item label="内容主体">
            <el-input :rows="3" v-model="form.message" type="textarea" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="反馈类型">

            <el-select v-model="form.feedbackType" filterable allow-create placeholder="请选择">
              <el-option
                v-for="item in dict.feedback_type" :key="item.id"
                :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>

          <!--- (截图，录音，视频)  -->
          <el-form-item label="附件">
            <el-input :rows="3" v-model="form.attachment" type="textarea" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="回复时间">
            <el-date-picker v-model="form.replyTime" type="datetime" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="回复人">
            <el-input v-model="form.replyEr" style="width: 370px;"/>
          </el-form-item>


          <el-form-item label="回复内容">
            <el-input v-model="form.replyContent" :rows="3" type="textarea" style="width: 370px;"/>
          </el-form-item>


          <el-form-item label="排序">
            <el-input-number v-model="form.sort" :min="0" :max="99999" label="请输入数字"/>
          </el-form-item>


          <el-form-item label="发送者身份">
            <el-input v-model="form.role" style="width: 370px;"/>
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

        <el-table-column prop="sendId" label="发送者ID"/>

        <el-table-column prop="message" label="内容主体"/>

        <el-table-column prop="feedbackType" label="反馈类型">
          <template slot-scope="scope">
            {{ dict.label.feedback_type[scope.row.feedbackType] }}
          </template>
        </el-table-column>

        <!-- (截图，录音，视频) -->
        <el-table-column prop="attachment" label="附件"/>

        <el-table-column prop="replyTime" label="回复时间"/>

        <el-table-column prop="replyEr" label="回复人"/>

        <el-table-column prop="replyContent" label="回复内容"/>


        <el-table-column prop="sort" label="排序"/>


        <!-- (org,tea,par,unknow) --->
        <el-table-column prop="role" label="发送者身份"/>


        <!-- 操作按钮 -->
        <el-table-column v-permission="['admin','plat:message:edit','plat:message:del']" label="操作" width="150px"
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
  import crudPlatMessage from '@/api/system/platMessage'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  const defaultForm = {
    id: null,
    sendId: null,
    message: null,
    feedbackType: null,
    attachment: null,
    replyTime: null,
    replyEr: null,
    sort: null,
    enable: null,
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null,
    role: null,
    replyContent: null
  };

  export default {
    name: 'PlatMessage',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    dicts: ['feedback_type'],
    cruds() {
      return CRUD({
        title: '留言中心',
        url: 'api/platMessage',
        sort: 'id,desc',

      })
    },
    data() {
      return {
        permission: {
          add: ['admin', 'plat:message:add'],
          edit: ['admin', 'plat:message:edit'],
          del: ['admin', 'plat:message:del']
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
