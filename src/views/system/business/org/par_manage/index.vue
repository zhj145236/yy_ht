<template>
  <div class="app-container">


    <el-row :gutter="15">
      <el-col :xs="24" :xl="14" class="aa">

        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="role-span">家长列表</span>
          </div>
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
            <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                       :title="crud.status.title" width="500px">
              <el-form ref="form" :model="form" :rules="rules" size="small"
                       label-width="80px">

                <el-form-item label="昵称">
                  <el-input v-model="form.nickName" style="width: 370px;"/>
                </el-form-item>

                <el-form-item label="真实姓名"  prop="realName">
                  <el-input v-model="form.realName" style="width: 370px;"  placeholder="必填"/>
                </el-form-item>

                <el-form-item label="家长性别" prop="sex">
                  <el-radio-group v-model="form.sex" style="width:300px">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                    <el-radio label="保密">保密</el-radio>
                  </el-radio-group>
                </el-form-item>


                <el-form-item label="头像">
                  <el-input v-model="form.headImg" style="width: 370px;"/>
                </el-form-item>

                <el-form-item label="手机号">
                  <el-input v-model="form.tel" style="width: 370px;" prefix-icon="el-icon-mobile-phone">

                  </el-input>
                </el-form-item>


                <el-form-item label="地址">

                  <myaddress :selectSSQ="bindSSQ" :simpleAddress="form.address" @ansyLocation="ansyLocation"/>

                </el-form-item>


                <el-form-item label="孩子姓名" prop="childName">
                  <el-input v-model="form.childName" style="width: 370px;" prefix-icon="el-icon-user"  placeholder="必填"/>
                </el-form-item>

                <el-form-item label="备注">
                  <el-input v-model="form.remark" style="width: 370px;" prefix-icon="el-icon-notebook-2"/>
                </el-form-item>

                <el-form-item label="录入时间" v-if="form.inTime">
                 <!-- <el-date-picker v-model="form.inTime" type="datetime" style="width: 370px;"/>-->
                  {{translateTime(form.inTime)}}
                </el-form-item>

              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="info" @click="crud.cancelCU">取消</el-button>
                <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
              </div>
            </el-dialog>


            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                      @selection-change="crud.selectionChangeHandler" @current-change="handleCurrentChange"
                      :row-class-name="tableRowClassName">

              <el-table-column prop="headImg" label="头像" width="100px">
                <template slot-scope="{row}">

                  <p>
                    <el-image fit="scale-down"
                              :src="fileRefUrl + row.headImg"
                              :preview-src-list="[fileRefUrl + row.headImg ]"
                              lazy
                    >
                      <div slot="error">
                        <i class="el-icon-document"/>
                      </div>
                    </el-image>
                  </p>

                  <p v-if="row.uid">
                    <el-tag type="success">线上注册用户</el-tag>
                  </p>
                  <p v-else>
                    <el-tag type="info">我的客户</el-tag>
                  </p>

                </template>

              </el-table-column>

              <el-table-column prop="headImg" label="基本信息" width="100px">
                <template slot-scope="{row}">

                  <p>昵称：{{row.nickName}}<br/>
                    姓名：{{row.realName}}<br/>
                    性别：{{row.sex}}</p>

                </template>

              </el-table-column>


              <el-table-column prop="addressAuto" label="联系信息">
                <template slot-scope="{row}">

                  <p>联系地址<i class="el-icon-s-custom"/>：{{row.addressAuto}}</p>
                  <p>联系电话<i class="el-icon-mobile-phone"/>：{{row.tel}}</p>

                </template>
              </el-table-column>


              <el-table-column prop="remark" label="其他">

                <template slot-scope="{row}">

                  <p>孩子姓名：{{row.childName}}</p>
                  <p>备注：{{row.remark}}</p>
                  <p>录入时间：{{ parseTime(row.inTime) }}</p>

                </template>
              </el-table-column>


              <!-- 操作按钮 -->

              <el-table-column label="操作" v-permission="['admin','org:back_consumer:edit','org:back_consumer:del']"
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

        </el-card>

      </el-col>
      <el-col :xs="24" :xl="10">
        <el-row>

          <el-col class="bb">
            <send-message @handleCurrentChange="handleCurrentChange" :messageData="messageData"
                          v-loading="listLoading"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="cc">
            <message-list :messageData="messageData" v-loading="listLoading"/>
          </el-col>
        </el-row>

      </el-col>
    </el-row>

  </div>
</template>

<script>
  import crudOrgBackConsumer from '@/api/system/orgBackConsumer'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import {mapGetters} from "vuex";
  import sendMessage from "./sendMessage";
  import messageList from "./messageList";
  import myaddress from "@/components/myaddress";

  import  { translateTime } from "@/utils/index";




  const defaultForm = {
    id: null,
    oid: null,
    uid: null,
    nickName: null,
    realName: null,
    childName: null,
    sex: '男',
    headImg: null,
    tel: null,
    inTime: null,
    provinceCode: null,
    cityCode: null,
    countyCode: null,
    address: null,
    addressAuto: null,
    remark: null,
    sort: null,
    enable: null,
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null
  };

  export default {
    name: 'OrgBackConsumer',
    components: {myaddress, pagination, crudOperation, rrOperation, udOperation, sendMessage, messageList},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    cruds() {
      return CRUD({
        title: '家长管理',
        url: 'api/orgback/orgBackConsumer',
        sort: 'id,desc',
        crudMethod: {...crudOrgBackConsumer}
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


        bindSSQ: [],

        listLoading: false,

        sendButton: {},

        messageData: {
          content: [],
          totalElements: 0,
          message: "",
          available: false,
          uid: null,
          pkid: null

        },

        permission: {
          add: ['admin', 'org:back_consumer:add'],
          edit: ['admin', 'org:back_consumer:edit'],
          del: ['admin', 'org:back_consumer:del']
        },
        rules: {

          realName :
            [
              {required: true, message: '真实姓名必填', trigger: 'blur'}
            ],
          sex:
            [
              {required: true, message: '请设置性别', trigger: 'blur'}
            ],

          childName:
            [
              {required: true, message: '孩子姓名必填', trigger: 'blur'}
            ],


        },
        queryTypeOptions: [
          {
            key: 'realName',
            display_name: '真实姓名'
          },
          {
            key: 'tel',
            display_name: '手机号'
          }
        ]
      }
    },
    methods: {


      translateTime,

      ansyLocation(input1, input2) {

        this.form.provinceCode = input1[0];
        this.form.cityCode = input1[1];
        this.form.countyCode = input1[2];
        this.form.address = input2;


      },

      tableRowClassName({row, rowIndex}) {

        if (row.uid === undefined || row.uid === "" || row.uid === null) {

          return 'inner-customer';
        } else {
          return '';
        }
      },


      [CRUD.HOOK.beforeToEdit]() {


        this.bindSSQ = [this.form.provinceCode, this.form.cityCode, this.form.countyCode];


      },
      [CRUD.HOOK.beforeToAdd]() {

        this.bindSSQ = null;

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
      ,
      handleCurrentChange(row) {


        if (row.uid) {


          this.listLoading = true;
          // 加载全部
          crudOrgBackConsumer.getMessageHistory({parId: row.uid}).then((data) => {

            this.messageData.content = data.content;
            this.messageData.totalElements = data.totalElements;

            this.messageData.available = data.available;
            this.messageData.message = data.message;
            this.messageData.selectedUid = row.uid;
            this.messageData.pkid = row.id;


            this.listLoading = false;

          }).catch((error) => {
            console.error("后台调用出错：", error);
            this.listLoading = false;
          });

        } else {

          // TODO

          this.$message({
            message: '此客户非线上注册用户，无法发送消息哦。',
            type: 'warning'
          });
          this.listLoading = false;

        }

      }
    }


  }
</script>

<style scoped>


  .el-table .inner-customer {
    background: #f9ab00;
  }


  .aa {

    height: 900px;
    min-height: 500px;
  }

  .bb {
    height: 400px;
    min-height: 150px;
  }

  .cc {

    height: 600px;
    min-height: 300px;
  }

  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

</style>
