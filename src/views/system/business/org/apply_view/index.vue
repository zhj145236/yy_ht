<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">

   <!--   <div v-if="crud.props.searchToggle">
        &lt;!&ndash; 搜索 &ndash;&gt;
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;"
                  class="filter-item" @keyup.enter.native="crud.toQuery"/>
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name"
                     :value="item.key"/>
        </el-select>
        <rrOperation :crud="crud"/>
      </div>-->


      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">
      </crudOperation>


      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">

        <el-table-column type="selection" width="55"/>


        <el-table-column prop="headImg" label="头像">
          <template slot-scope="{row}">

            <el-image
              :src="fileRefUrl + row.headImg"
              :preview-src-list="[fileRefUrl + row.headImg ]"
              fit="contain"
              lazy
              class="el-avatar">
              <div slot="error">
                <i class="el-icon-document"/>
              </div>
            </el-image>

          </template>

        </el-table-column>


        <el-table-column prop="name" label="姓名"/>

        <el-table-column prop="sex" label="性别"/>

        <el-table-column prop="nickName" label="昵称"/>


        <el-table-column prop="areaDesc" label="所在地区"/>


        <el-table-column prop="applyStatus" label="手机号">

          <template slot-scope="scope">


            <p v-if="parseInt(scope.row.applyStatus+'')===1"> {{scope.row.callPhone}}</p>


            <p v-if="parseInt(scope.row.applyStatus+'')===2">
              <el-tag type="danger" effect="plain">
                未同意
              </el-tag>
            </p>
            <p v-if="parseInt(scope.row.applyStatus+'')===0">
              <el-tag effect="plain">
                申请中
              </el-tag>
            </p>

          </template>
        </el-table-column>


        <el-table-column prop="note" label="我的留言"/>


        <el-table-column prop="applyTime" label="申请查看时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.applyTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="dealTime" label="用户查看时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.dealTime) }}</span>
          </template>
        </el-table-column>


        <!-- 操作按钮 -->
        <!-- <el-table-column
          label="操作" width="150px"
          align="center">
          <template slot-scope="scope">
            再次申请
          </template>
        </el-table-column> -->


      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
  </div>
</template>

<script>
  import crudOrgBackAppplyViewTel from '@/api/system/orgBackAppplyViewTel'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import {mapGetters} from "vuex";

  const defaultForm = {

    callPhone: null,
    sex: null,
    areaDesc: null,

    headImg: null,
    remark: null,
    name: null,
    uid: 0,
    applyStatus: 0,
    nickName: null,
    note: null,
    applyTime: null,
    dealTime: null

  };

  export default {
    name: 'OrgBackAppplyViewTel',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    cruds() {
      return CRUD({
        title: '申请记录',
        url: 'api/orgback/orgBackAppplyViewTel',
        sort: 'id,desc',
        crudMethod: {...crudOrgBackAppplyViewTel}
      })
    },

    computed: {
      ...mapGetters([
        'baseApi',
        'fileRefUrl'
      ])
    },

    data() {
      return {
        permission: {
          add: ['admin', 'org:back_appply_view_tel:addAAAA'],
          edit: ['admin', 'org:back_appply_view_tel:editAAAA'],
          del: ['admin', 'org:back_appply_view_tel:delAAAAA']
        },
        rules: {
          oid:
            [
              {required: true, message: '机构ID不能为空', trigger: 'blur'}
            ],
          uid:
            [
              {required: true, message: '此用户ID不能为空', trigger: 'blur'}
            ],
          applyStatus:
            [
              {required: true, message: '申请状态不能为空', trigger: 'blur'}
            ]
        },
        queryTypeOptions: [


          {
            key: 'applyStatus',
            display_name: '申请状态'
          },

          {
            key: 'applyTime',
            display_name: '申请查看时间'
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
