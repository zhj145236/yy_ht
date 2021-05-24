<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">


      <el-row :gutter="15">
        <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="15">

          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span class="role-span">消息列表</span>
            </div>

            <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
            <crudOperation :permission="permission">

              <el-button
                slot="right"
                class="filter-item"
                size="mini"
                type="primary"
                icon="el-icon-check"
                @click="makeAllRead(null,true)"
              >全部已读
              </el-button>

            </crudOperation>
            <!--表单组件-->
            <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                       :title="crud.status.title" width="500px">
              <el-form ref="form" :model="form" :rules="rules" size="small"
                       label-width="80px">

                <el-form-item label="发送人ID">
                  <el-input-number v-model="form.sendId" :min="0" :max="99999" label="请输入数字"/>
                </el-form-item>

                <el-form-item label="接收人ID">
                  <el-input-number v-model="form.receivedId" :min="0" :max="99999" label="请输入数字"/>
                </el-form-item>

                <el-form-item label="消息标题">
                  <el-input v-model="form.title" style="width: 370px;"/>
                </el-form-item>

                <el-form-item label="消息内容详情">
                  <el-input :rows="3" v-model="form.content" type="textarea" style="width: 370px;"/>
                </el-form-item>

                <el-form-item label="消息类型">

                  <el-select v-model="form.noticeType" filterable allow-create placeholder="请选择">
                    <el-option
                      v-for="item in dict.notice_type" :key="item.id"
                      :label="item.label" :value="item.value"/>
                  </el-select>
                </el-form-item>

                <el-form-item label="是否为公共消息">
                  <el-switch v-model="form.publicShow" active-color="#13ce66" inactive-color="#ff4949"/>
                </el-form-item>


              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="info" @click="crud.cancelCU">取消</el-button>
                <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
              </div>
            </el-dialog>

            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                      @selection-change="crud.selectionChangeHandler" stripe
                      @row-click="(row, column, event) => viewDetail(row)">

              <el-table-column prop="title" label="标题">
                <template slot-scope="{row}">
                  <el-link @click="viewDetail(row)">{{row.title}}</el-link>
                </template>

              </el-table-column>

              <el-table-column prop="noticeType" label="说明" width="150px">
                <template slot-scope="{row}">


                  <span style="color: #E65D6E" v-if="!row.readTime">未读</span>
                  <span style="color:#40c9c6" v-else>已读</span>
                  {{row.publicShow? '公告':'私信' }}
                  {{row.sendId}}<br/>
                  {{ translateTime(row.createTime) }}

                </template>
              </el-table-column>

              <!-- 操作按钮 -->
              <!-- <el-table-column v-permission="['admin','plat:notice:edit','plat:notice:del']" label="操作" width="150px"
                                align="center">
                 <template slot-scope="scope">
                   <udOperation
                     :data="scope.row"
                     :permission="permission"
                   />
                 </template>
               </el-table-column>-->


            </el-table>
            <!--分页组件-->
            <pagination/>

          </el-card>

        </el-col>

        <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="9">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <el-tooltip class="item" effect="dark" content="点击左侧列表项查看详情" placement="top">
                <span class="role-span">消息详情</span>
              </el-tooltip>
            </div>

            <div v-html="contentHtml" style="min-height: 540px;max-height: 1200px;overflow-y: auto"></div>

          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import crudPlatNotice from '@/api/system/platNotice'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  import {translateTime} from "@/utils/index";


  const defaultForm = {
    id: null,
    sendId: null,
    receivedId: null,
    title: null,
    content: null,
    noticeType: null,
    publicShow: false,
    createBy: null,
    createTime: null
  };

  export default {
    name: 'PlatNotice',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    dicts: ['notice_type'],
    cruds() {
      return CRUD({
        title: '消息通知中心',
        url: 'api/platNotice',
        sort: 'id,desc',
        crudMethod: {...crudPlatNotice}
      })
    },

    mounted() {


    },
    data() {
      return {

        contentHtml: "<h3 style='text-align: center'><i class='el-icon-message' /> 点击左侧的标题可查看详情</h3>",
        permission: {
          add: ['admin', 'plat:notice:add'],
          edit: ['admin', 'plat:notice:edit'],
          del: ['admin', 'plat:notice:del']
        },
        rules: {}
      }
    },
    methods: {


      viewDetail(row) {

        this.contentHtml = row.content;

        if (!row.readTime) {

          crudPlatNotice.makeAllRead([row.id], false).then((data) => {

            row.readTime = data;

            this.$emit('messageHasRead', 1);

          }).catch((error) => {
            console.error("后台调用出错：", error);

          });


        } else {

        }

      },
      makeAllRead(selectIds, selectAll) {

        this.$confirm('你确定标记为全部已读吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          crudPlatNotice.makeAllRead(null, true).then((data) => {

            this.crud.refresh();

          }).catch((error) => {

            console.error("后台调用出错：", error);
          });
        });


      },
      translateTime,

      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        return true
      }
    }
  }
</script>

<style scoped>

</style>
