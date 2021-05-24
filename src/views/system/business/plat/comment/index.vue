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


          <el-form-item label="评论/留言类型">

            <el-select v-model="form.commentType" filterable allow-create placeholder="请选择">
              <el-option
                v-for="item in dict.comment_type" :key="item.id"
                :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>


          <el-form-item label="用户ID">
            <el-input-number v-model="form.uid" :min="0" :max="99999" label="请输入数字"/>
          </el-form-item>


          <el-form-item label="引用的资源ID">
            <el-input-number v-model="form.referId" :min="0" :max="99999" label="请输入数字"/>
          </el-form-item>


          <el-form-item label="评论留言内容" prop="comment">
            <el-input :rows="3" v-model="form.comment" type="textarea" style="width: 370px;"/>
          </el-form-item>


          <el-form-item label="回复留言人ID">
            <el-input-number v-model="form.replyId" :min="0" :max="99999" label="请输入数字"/>
          </el-form-item>

          <el-form-item label="回复留言">
            <el-input :rows="3" v-model="form.replyContent" type="textarea" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="是否优秀评论">

            <el-switch
              v-model="form.good"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>

          </el-form-item>


          <el-form-item label="是否启用">
            <el-switch
              v-model="form.enable"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>

          <el-form-item label="点赞数量">
            <el-input-number v-model="form.like" :min="0" :max="99999" label="请输入数字"/>
          </el-form-item>

          <el-form-item label="踩的数量">
            <el-input-number v-model="form.unlike" :min="0" :max="99999" label="请输入数字"/>
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

        <el-table-column prop="comment" label="评论留言内容"/>

        <el-table-column prop="commentType" label="评论/留言类型">
          <template slot-scope="scope">
            {{ dict.label.comment_type[scope.row.commentType] }}
          </template>
        </el-table-column>


        <el-table-column prop="uid" label="用户ID"/>

        <el-table-column prop="referId" label="引用的资源ID"/>

        <el-table-column prop="replyId" label="回复留言人ID"/>

        <el-table-column prop="replyContent" label="回复留言"/>

        <el-table-column prop="good" label="是否优秀评论">

          <template slot-scope="scope">
            <el-tag :type="scope.row.good? 'success':'danger' " effect="plain">
              {{scope.row.good? '是':'否'}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="enable" label="是否有效">
          <template slot-scope="scope">
            <el-tag :type="scope.row.enable? 'success':'danger' " effect="plain">
              {{scope.row.enable? '是':'否'}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="like" label="点赞数量"/>

        <el-table-column prop="unlike" label="踩的数量"/>


        <!-- 操作按钮 -->
        <el-table-column v-permission="['admin','plat:comment:edit','plat:comment:del']" label="操作" width="150px"
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
  import crudPlatComment from '@/api/system/platComment'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  const defaultForm = {
    id: null,
    comment: null,
    commentType: null,
    referId: null,
    replyId: null,
    replyContent: null,
    good: null,
    enable: true,
    like: null,
    unlike: null,
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null,
    uid: null
  };

  export default {
    name: 'PlatComment',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    dicts: ['comment_type'],
    cruds() {
      return CRUD({
        title: '留言评论',
        url: 'api/platComment',
        sort: 'id,desc',
        crudMethod: {...crudPlatComment}
      })
    },
    data() {
      return {
        permission: {
          add: ['admin', 'plat:comment:add'],
          edit: ['admin', 'plat:comment:edit'],
          del: ['admin', 'plat:comment:del']
        },
        rules: {
          comment:
            [
              {required: true, message: '评论留言内容不能为空', trigger: 'blur'}
            ]
        },
        queryTypeOptions: [
          {
            key: 'referId',
            display_name: '引用的资源ID'
          },
          {
            key: 'replyId',
            display_name: '回复留言人ID'
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
