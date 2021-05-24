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
                 :title="crud.status.title" width="1000px">
        <el-form ref="form" :model="form" :rules="rules" size="small"
                 label-width="70px">


          <el-row>
            <el-col :span="12">


              <el-form-item label="姓名" prop="realName">
                <el-input v-model="form.realName" placeholder="必填" style="width: 370px"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">

              <el-form-item label="头像">
                <el-input v-model="form.headImg" style="width: 370px"/>
              </el-form-item>


            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">

              <el-form-item label="性别">

                <el-radio-group v-model="form.sex">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                  <el-radio label="保密">保密</el-radio>
                </el-radio-group>

              </el-form-item>

            </el-col>
            <el-col :span="12">

              <el-form-item label="手机号">
                <el-input v-model="form.tel" prefix-icon="el-icon-phone-outline" style="width: 370px">

                </el-input>
              </el-form-item>

            </el-col>
          </el-row>


          <el-row>
            <el-col :span="12">

              <el-form-item label="Email">
                <el-input v-model="form.email" prefix-icon="el-icon-s-promotion" style="width: 370px">

                </el-input>

              </el-form-item>
            </el-col>
            <el-col :span="12">

              <el-form-item label="身份证">

                <el-input v-model="form.idNo" prefix-icon="el-icon-postcard" style="width: 370px" placeholder="身份证号码">

                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">

              <el-form-item label="生日">
                <el-date-picker v-model="form.bornDate" type="date" style="width: 370px"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">

              <el-form-item label="户籍地址">
                <el-input v-model="form.nativeAddress" prefix-icon="el-icon-office-building" style="width: 370px">

                </el-input>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row>
            <el-col :span="12">

              <el-form-item label="现居住地">
                <el-input v-model="form.contactAddress" prefix-icon="el-icon-location-information" style="width: 370px">
                </el-input>

              </el-form-item>
            </el-col>
            <el-col :span="12">


              <el-form-item label="婚姻状况">

                <el-radio-group v-model="form.married">
                  <el-radio label="未知">未知</el-radio>
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>

              </el-form-item>

            </el-col>
          </el-row>


          <el-row>
            <el-col :span="12">

              <el-form-item label="毕业院校">
                <el-input v-model="form.graduateSchool" prefix-icon="el-icon-school" style="width: 370px">

                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">

              <el-form-item label="所学专业">
                <el-input v-model="form.major" prefix-icon="el-icon-s-flag" style="width: 370px">
                </el-input>
              </el-form-item>

            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">

              <el-form-item label="紧急联系人">
                <el-input v-model="form.alternativeContact" prefix-icon="el-icon-first-aid-kit" style="width: 370px">

                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">

              <el-form-item label="紧急联系人电话">
                <el-input v-model="form.alternativeContactTel" prefix-icon="el-icon-phone" style="width: 370px">

                </el-input>
              </el-form-item>

            </el-col>
          </el-row>


          <el-row>
            <el-col :span="12">


              <el-form-item label="入职日期">
                <el-date-picker v-model="form.joinDate" type="date" style="width: 370px"/>
              </el-form-item>

            </el-col>

            <el-col :span="12">
              <el-form-item label="员工状态">

                <el-radio-group v-model="form.status">

                  <el-radio label="试用期员工">试用期员工</el-radio>
                  <el-radio label="正式员工">正式员工</el-radio>
                  <el-radio label="已离职">已离职</el-radio>
                  <el-radio label="返聘员工">返聘员工</el-radio>

                </el-radio-group>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="23">
              <el-form-item label="劳动合同签订时间">
                <el-date-picker v-model="form.contractBeginDate" type="date" style="width: 370px"/>
                至
                <el-date-picker v-model="form.contractEndDate" type="date" style="width: 370px"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="23">

              <el-form-item label="备注">
                <el-input v-model="form.remark" prefix-icon="el-icon-notebook-2"/>
              </el-form-item>
            </el-col>
          </el-row>


        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">


        <el-table-column prop="xxx" label="基本信息">
          <template slot-scope="{row}">
            <p>
              <el-image
                :src="fileRefUrl + row.headImg"
                :preview-src-list="[fileRefUrl + row.headImg ]"
                fit="contain"
                lazy style="width: 100px; height: 100px"
                class="el-avatar">
                <div slot="error">
                  <i class="el-icon-document"/>
                </div>
              </el-image>
            </p>
            <h2>{{ row.realName }}</h2>
            <p>性别:{{ row.sex }}
            <p/>

          </template>
        </el-table-column>


        <el-table-column prop="xxx" label="联系信息">
          <template slot-scope="{row}">
            <p><i class="el-icon-phone-outline"/>:{{ row.tel }}</p>
            <p><i class="el-icon-s-promotion"/>:{{ row.email }}</p>
            <p><i class="el-icon-office-building"/>:{{ row.nativeAddress }}</p>
            <p><i class="el-icon-location-information"/>:{{ row.contactAddress }}</p>
            <p><i class="el-icon-postcard"/>:{{ row.idNo }}</p>
            <p><i class="el-icon-first-aid-kit"/>:{{ row.alternativeContact }}</p>
            <p><i class="el-icon-phone"/>:{{ row.alternativeContactTel }}</p>
          </template>

        </el-table-column>


        <el-table-column prop="yyy" label="私密信息">
          <template slot-scope="{row}">
            <p>
              <svg-icon icon-class="ipvisits"/>
              :{{ row.married }}
            </p>
            <p><i class="el-icon-table-lamp"/>:{{ translateDate(row.bornDate) }}</p>
            <p><i class="el-icon-school"/>:{{ row.graduateSchool }}</p>
            <p><i class="el-icon-s-flag"/>: {{ row.major }}</p>
          </template>
        </el-table-column>


        <el-table-column prop="zzz" label="与公司相关">
          <template slot-scope="{row}">
            <p>入职日期:{{ translateDate(row.joinDate) }}</p>
            <p>劳动合同签订时间:{{ translateDate(row.contractBeginDate) }} - {{ translateDate(row.contractEndDate) }}</p>
            <p>状态:
              <el-tag :type="staffLabelColor(row.status)"> {{row.status}}</el-tag>
            </p>

            <p>备注:{{ row.remark }}</p>
          </template>
        </el-table-column>


        <!-- 操作按钮 -->
        <el-table-column v-permission="['admin','org:back_employee:edit','org:back_employee:del']" label="操作"
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
  import crudOrgBackEmployee from '@/api/system/orgBackEmployee'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import {mapGetters} from "vuex";
  import {translateDate} from "@/utils/index";


  const defaultForm = {
    id: null,
    oid: null,
    eid: null,
    realName: null,
    headImg: null,
    sex: '男',
    tel: null,
    email: null,
    idNo: null,
    bornDate: null,
    nativeAddress: null,
    contactAddress: null,
    married: '未知',
    graduateSchool: null,
    major: null,
    alternativeContact: null,
    alternativeContactTel: null,
    joinDate: null,
    contractBeginDate: null,
    contractEndDate: null,
    status: '试用期员工',
    remark: null,
    sort: null,
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null
  };

  export default {
    name: 'OrgBackEmployee',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud(), translateDate()],
    cruds() {
      return CRUD({
        title: '员工信息',
        url: 'api/orgBackEmployee',
        sort: 'id,desc',
        crudMethod: {...crudOrgBackEmployee}
      })
    },

    computed: {
      ...mapGetters([
        'baseApi',
        'fileRefUrl',
      ])
    },

    data() {
      return {
        permission: {
          add: ['admin', 'org:back_employee:add'],
          edit: ['admin', 'org:back_employee:edit'],
          del: ['admin', 'org:back_employee:del']
        },
        rules: {
          realName:
            [
              {required: true, message: '姓名不能为空', trigger: 'blur'}
            ]
        },
        queryTypeOptions: [
          {
            key: 'realName',
            display_name: '真实姓名'
          },
          {
            key: 'sex',
            display_name: '性别'
          },
          {
            key: 'tel',
            display_name: '手机号'
          },
          {
            key: 'idNo',
            display_name: '身份证号码'
          }

        ]
      }
    },
    methods: {

      translateDate,
      staffLabelColor(status) {


        if ("试用期员工" === status) {
          return "warning";
        } else if ("正式员工" === status) {
          return "success";
        } else if ("已离职" === status) {
          return "info";
        } else if ("返聘员工" === status) {
          return "danger";
        } else {
          return "primary";
        }


      },
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query;
        if (query.type && query.value) {

          this.crud.params[query.type] = query.value

        } else {

          this.crud.params = {};

        }
        return true
      }
    }
  }
</script>

<style scoped>

</style>
