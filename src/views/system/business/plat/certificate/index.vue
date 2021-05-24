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


          <el-form-item
            label="拥有者ID" prop="belong">

            <el-input v-model="form.belong" style="width: 370px;"/>


          </el-form-item>


          <el-form-item
            label="证书类型" prop="cerType">

            <el-select v-model="form.cerType" filterable
                       placeholder="请选择">
              <el-option
                v-for="item in dict.cer_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"/>
            </el-select>

          </el-form-item>


          <el-form-item label="证书图片">
            <el-input v-model="form.cerImage" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="证书编号">
            <el-input v-model="form.cerNo" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="注册时间">
            <el-input v-model="form.regDate" style="width: 370px;"/>
          </el-form-item>


          <el-form-item
            label="公开证书" prop="openShow">

            <el-radio v-model="form.openShow" :label="true" border>公开</el-radio>
            <el-radio v-model="form.openShow" :label="false" border>不公开</el-radio>

          </el-form-item>


          <el-form-item
            label="是否通过" prop="verifyStatus">

            <el-radio v-model="form.verifyStatus" :label="true" border>通过</el-radio>
            <el-radio v-model="form.verifyStatus" :label="false" border>不通过</el-radio>

          </el-form-item>


          <el-form-item label="未通过原因" v-show="!form.verifyStatus">


            <el-select v-model="form.notPassReason" style="width: 100%" filterable allow-create default-first-option
                       placeholder="请选择">
              <el-option
                v-for="item in dict.cer_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"/>
            </el-select>

          </el-form-item>


          <el-form-item
            label="验证时间">

            <el-date-picker v-model="form.verifyTime" type="datetime"
                            style="width: 370px;"/>

          </el-form-item>


          <el-form-item
            label="验证人">

            <el-input v-model="form.verifyEr" style="width: 370px;"/>


          </el-form-item>


          <el-form-item
            label="排序">


            <el-input-number v-model="form.sort" :min="1" :max="99999" label="请输入数字"/>


          </el-form-item>


          <el-form-item
            label="是否启用">

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

        <el-table-column prop="belong" label="拥有者ID"/>


        <el-table-column prop="cerType"
                         label="证书类型">
          <template slot-scope="scope">
            {{ dict.label.cer_type[scope.row.cerType] }}
          </template>
        </el-table-column>


        <el-table-column prop="cerNo"
                         label="证书编号"/>


        <el-table-column prop="regDate"
                         label="注册时间"/>

        <el-table-column prop="cerImage"
                         label="证书图片"/>


        <el-table-column prop="openShow"
                         label="公开证书">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.openShow? 'success':'danger' "
              effect="plain">
              {{ scope.row.openShow? '公开':'不公开'}}
            </el-tag>
          </template>
        </el-table-column>


        <el-table-column prop="verifyStatus"
                         label="验证状态">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.verifyStatus? 'success':'danger' "
              effect="plain">
              {{ scope.row.verifyStatus? '通过':'不通过'}}
            </el-tag>
          </template>

        </el-table-column>


        <el-table-column prop="notPassReason"
                         label="未通过原因">
        </el-table-column>

        <el-table-column prop="verifyTime"
                         label="验证时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.verifyTime) }}</span>
          </template>
        </el-table-column>


        <el-table-column prop="verifyEr"
                         label="验证人"/>


        <el-table-column prop="sort"
                         label="排序"/>


        <el-table-column prop="enable" label="是否有效">
          <template slot-scope="scope">
            <el-tag :type="scope.row.enable? 'success':'danger' " effect="plain">
              {{ scope.row.enable? '是':'否'}}
            </el-tag>
          </template>
        </el-table-column>


        <!-- 操作按钮 -->
        <el-table-column v-permission="['admin','plat:certificate:edit','plat:certificate:del']" label="操作"
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
  import crudPlatCertificate from '@/api/system/platCertificate'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  const defaultForm = {
    id: null,
    belong: null,
    cerType: null,
    cerImage: null,
    openShow: true,
    verifyStatus: true,
    verifyTime: null,
    verifyEr: null,
    sort: null,
    enable: true,
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null,
    notPassReason: null,
    cerNo: null,
    regDate: null,
  };

  export default {
    name: 'PlatCertificate',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    dicts: ['cer_type'],
    cruds() {
      return CRUD({
        title: '证书中心',
        url: 'api/platCertificate',
        sort: 'id,desc',
        crudMethod: {...crudPlatCertificate}
      })
    },
    data() {
      return {
        permission: {
          add: ['admin', 'plat:certificate:add'],
          edit: ['admin', 'plat:certificate:edit'],
          del: ['admin', 'plat:certificate:del']
        },
        rules: {
          belong:
            [
              {required: true, message: '拥有者ID不能为空', trigger: 'blur'}
            ],
          cerType:
            [
              {required: true, message: '证书类型不能为空', trigger: 'blur'}
            ],
          openShow:
            [
              {required: true, message: '是否公开证书；1=公开；0=不可见不能为空', trigger: 'blur'}
            ],
          verifyStatus:
            [
              {required: true, message: '验证状态，1=通过；0=不通过不能为空', trigger: 'blur'}
            ]
        },
        queryTypeOptions: [
          {
            key: 'belong',
            display_name: '拥有者ID'
          },
          {
            key: 'cerType',
            display_name: '证书类型'
          },
          {
            key: 'openShow',
            display_name: '是否公开证书'
          },
          {
            key: 'verifyTime',
            display_name: '验证时间'
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
