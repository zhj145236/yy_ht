<template>
  <div>

    <el-row :gutter="15">


      <el-col style="margin-bottom: 10px">

        <el-card class="box-card" shadow="hover">
          <div slot="header">

            <span class="role-spanA">

              <el-row :gutter="20">
                <el-col :span="5"> 发送消息 </el-col>
                <el-col :span="5" :offset="12">  <el-link type="primary"
                                                          @click="showPatchWindow">批量发送?</el-link> </el-col>
            </el-row>

            </span>

          </div>

          <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" label-width="100px"
                   v-loading="dataLoading2">

            <el-form-item label="发送方式" prop="content">
              <el-checkbox-group v-model="sendWayList">
                <el-checkbox label="站内通知"/>
                <el-checkbox label="邮箱通知" disabled title="平台暂未开放此功能"/>
                <el-checkbox label="短信通知" disabled title="平台暂未开放此功能"/>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="模板" prop="content">

              <el-select :disabled="sendOneDisabled" v-model="templetSelect" placeholder="请选择" style="width: 400px"
                         @change="singWayChange">
                <el-option key="0" label="自定义消息" value="0"/>
                <el-option key="1" label="给家长发送学生的学习进度" value="1"/>
              </el-select>

            </el-form-item>

            <el-form-item label="待发送的内容" prop="content">

              <el-input :rows="6" v-model="inputContent" type="textarea" style="width:400px;"
                        :disabled="sendOneDisabled"/>

            </el-form-item>


            <el-form-item label="">
              <el-button :loading="loading" style="margin-left:1.6%;" size="medium" type="primary" @click="doSubmit"
                         :disabled="sendOneDisabled" :title="messageData.message ||'' ">发送
              </el-button>
              {{messageData.message ||''}}
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <div>


      <el-drawer
        :visible.sync="drawer"
        direction="ttb" :wrapperClosable="false"
        size="85%" :with-header="false" v-loading="dataLoading">


        <el-row class="userList">


          <el-col :span="15" :offset="1">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>选择接收用户</span>

                <el-checkbox style="float: right; padding: 3px 0" type="text" v-model="selectAllCheckBox"
                             :disabled="selectedCustomerId.length<1">全选
                </el-checkbox>

              </div>

              <el-checkbox-group v-model="selectedCustomerId">

                <el-checkbox :value="item.id" :label="item.id" v-for="(item,index) in parDataArr" :key="item.id"
                             :title="item.message" :disabled="!item.available">
                  {{item.realName}}
                </el-checkbox>

              </el-checkbox-group>

            </el-card>

          </el-col>

          <el-col :span="8">

            <el-card class="box-card">

              <el-tabs tab-position="top" style="height: 200px;" v-model="selectedTabName">
                <el-tab-pane label="使用消息模板" name="templet">


                  <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" label-width="100px">

                    <el-form-item label="发送方式" prop="content">
                      <el-checkbox-group v-model="sendWayList">
                        <el-checkbox label="站内通知"/>
                        <el-checkbox label="邮箱通知" disabled title="平台暂未开放此功能"/>
                        <el-checkbox label="手机通知" disabled title="平台暂未开放此功能"/>
                      </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="平台模板" prop="content">
                      <el-select v-model="templetSelect" placeholder="平台模板" style="width: 400px">
                        <el-option key="0" label="请选择一个模板" value="0"/>
                        <el-option key="1" label="给家长发送学生的学习进度" value="1"/>
                      </el-select>
                    </el-form-item>

                  </el-form>


                </el-tab-pane>

                <el-tab-pane label="自定义消息" name="define">


                  <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" label-width="100px">

                    <el-form-item label="发送方式" prop="content">
                      <el-checkbox-group v-model="sendWayList">
                        <el-checkbox label="站内通知"/>
                        <el-checkbox label="邮箱通知" disabled title="平台暂未开放此功能"/>
                        <el-checkbox label="手机通知" disabled title="平台暂未开放此功能"/>
                      </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="平台模板" prop="content">
                      <el-input :rows="4" v-model="defineContent" type="textarea" style="width: 600px;"/>
                    </el-form-item>

                  </el-form>

                </el-tab-pane>


              </el-tabs>
              <el-button type="primary" @click="reloadContent" :disabled="canPreview">预览数据</el-button>
              <el-button type="success" :disabled="!canSend" @click="sendBatchMessage">发送</el-button>
              <el-button type="danger" @click="handleClose">取消并关闭</el-button>
            </el-card>
          </el-col>


        </el-row>

        <el-divider><i class="el-icon-mobile-phone"/>待发送消息</el-divider>

        <el-row>
          <div style="overflow-y: auto;overflow-x: hidden; max-height:650px;">


            <el-row :gutter="4">

              <el-col :span="4" v-for="(itemId,index) in selectedCustomerId" :key="index" class="text item">
                <el-card class="box-cardA" shadow="hover" v-if="prevMessageData['filed'+itemId]">

                  <div slot="header" class="clearfix">
                    <span>给{{prevMessageData['filed'+itemId].realName}}   ： </span>

                    <i style="padding-right: 12px;float:right " class="el-icon-delete" @click="delMsgItem(itemId)">
                    </i>

                  </div>
                  <div class="text item">
                    <el-input :ref="'templetInput'+itemId " :rows="5" @input="onInput()"
                              v-model="prevMessageData['filed'+itemId].content"
                              type="textarea"/>
                  </div>

                </el-card>


              </el-col>

            </el-row>


          </div>
        </el-row>
      </el-drawer>
    </div>


  </div>
</template>

<script>


  import {mapGetters} from 'vuex'
  import batchMessage from "./batchMessage";


  import orgBackConsumer from '@/api/system/orgBackConsumer'


  export default {
    name: 'Index',

    dicts: ['feedback_type'],
    components: {batchMessage,},
    props: ['messageData'],

    watch: {


      sendOneDisabled: function (v) {

        if (v === true) {
          this.inputContent = "";
        }

      },
      selectAllCheckBox: function (v) {

        if (v) {
          this.selectedCustomerId = [];
          this.parDataArr.forEach((item) => {

            if (item.available) {
              this.selectedCustomerId.push(item.id)
            }

          });
        } else {

          this.selectedCustomerId = [];
          // TODO

        }

      }

    },


    data() {
      return {


        inputContent: "",
        dataLoading: false,
        dataLoading2: false,
        selectAllCheckBox: false,

        sendWayList: ["站内通知"], //"邮箱通知","短信通知"

        templetSelect: "0",
        defineContent: "",
        radio: '1',
        selectedCustomerId: [],
        drawer: false,

        prevMessageData: {},

        selectedTabName: "templet", //或define


        parDataArr: [],

        loading: false, form: {subject: '', tos: [], content: ''},
        tos: [{
          value: ''
        }],
        rules: {
          subject: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ]
        }
      }
    },


    computed: {
      ...mapGetters([
        'imagesUploadApi'
      ]),


      sendOneDisabled() {

        return !this.messageData.available || this.sendWayList.length < 1;
      },

      canSend() {


        let bb = false;
        for (let key in this.prevMessageData) {
          if (this.prevMessageData[key] && this.prevMessageData[key].content && this.prevMessageData[key].content.length >= 1) {
            bb = true;
          }

        }

        return bb && this.sendWayList.length >= 1;
      },
      canPreview() {

        return this.selectedCustomerId.length <= 0;

      },

    },
    mounted() {


    },
    methods: {


      resetData() {

        this.selectedCustomerId.forEach((kid) => {

          let obj = Object.assign({}, this.prevMessageData['filed' + kid], {
            content: null,
          });
          this.$set(this.prevMessageData, 'filed' + kid, obj);

        });


        this.selectedCustomerId.splice(this.selectedCustomerId.findIndex(item => item === kid), 1);

        this.inputContent = "";
        this.dataLoading = false;
        this.dataLoading2 = false;
        this.selectAllCheckBox = false;
        this.sendWayList = ["站内通知"]; //"邮箱通知","短信通知"
        this.templetSelect = "0";
        this.defineContent = "";
        this.radio = '1';
        this.selectedCustomerId = [];
        this.drawer = false;
        this.prevMessageData = {};
        this.selectedTabName = "templet";  //或define

      },
      /***
       * 发送消息
       */
      sendBatchMessage() {

        let listMsg = [];

        let temp = {};

        for (let key in this.prevMessageData) {

          temp = this.prevMessageData[key];
          if (temp && temp.uid && temp.content && temp.content.length >= 1) {

            listMsg.push({
              uid: temp.uid + "",
              content: temp.content

            })

          }

        }

        let param = {
          msgList: listMsg,
          typeWays: this.sendWayList
        };

        this.dataLoading = true;

        orgBackConsumer.sendBatchMessage(param).then((data) => {


          this.$notify.success({
            title: '成功',
            message: "给" + data.count + "位家长发送消息成功！"

          });

          this.dataLoading = false;

          setTimeout(() => {
            //关闭此窗口
            this.drawer = false;

          }, 1000);


        }).catch((error) => {
           console.error("后台调用出错：", error);
          this.dataLoading = false;
        });
      },

      singWayChange() {


        if ("1" === this.templetSelect) {

          this.dataLoading2 = true;
          orgBackConsumer.loadProcessText([this.messageData.pkid]).then((data) => {


            if (data && data.length === 1) {

              let item = data[0];
              this.inputContent = "【学习进度反馈】" + item.childName +
                "的家长，您好！您孩子报的课程【" + item.courseName + "】共计" + item.courseSetCount + "节，截止目前，已经上完了" + item.finishCount + "节。【" + item.signName + "】";

              this.dataLoading2 = false;
            }


          }).catch((error) => {
            this.dataLoading2 = false;
             console.error("后台调用出错：", error);

          });


        }
      },
      reloadContent() {

        if ("templet" === this.selectedTabName) {


          if ("1" === this.templetSelect) {

            this.loadProcessText(this.selectedCustomerId);

          } else if ("0" === this.templetSelect) {

            this.$message({
              message: '请选择有效的模板或者自定义内容',
              type: 'warning'
            })

          }
        } else if ("define" === this.selectedTabName) {

          if (this.defineContent && this.defineContent.length >= 1) {


            this.selectedCustomerId.forEach((keyId) => {

              let newObj = Object.assign({}, this.prevMessageData['filed' + keyId], {content: this.defineContent});
              this.$set(this.prevMessageData, 'filed' + keyId, newObj);

            });


          } else {

            this.$message({
              message: '自定义的消息内容不能为空',
              type: 'warning'
            })

          }

        }


      },


      loadProcessText: function (ids) {

        orgBackConsumer.loadProcessText(ids).then((data) => {


          data.forEach((item) => {


            let value = "【学习进度反馈】" + item.childName +
              "的家长，您好！您孩子报的课程【" + item.courseName + "】共计" + item.courseSetCount + "节，截止目前，已经上完了" + item.finishCount + "节。【" + item.signName + "】";

            let obj = Object.assign({}, this.prevMessageData['filed' + item.parkeyId], {
              content: value,
            });

            this.$set(this.prevMessageData, 'filed' + item.parkeyId, obj);


          });


        }).catch((error) => {
           console.error("后台调用出错：", error);
        });

      },

      onInput() {

        this.$forceUpdate();
      },
      handleClose(done) {


        let msg = "确认关闭吗？当前操作将不会保存。";

        for (let key in this.prevMessageData) {
          if (this.prevMessageData[key] && this.prevMessageData[key].content && this.prevMessageData[key].content.length >= 1) {
            msg = "确认关闭吗？你有未发送的数据";
            break;
          }

        }


        this.$confirm(msg)
          .then(_ => {

            this.drawer = false;

            this.resetData();
            done();

          })
          .catch(_ => {
          });
      },

      showPatchWindow() {


        // 加载全部
        orgBackConsumer.getParentList().then((data) => {

          this.parDataArr = data;

          this.parDataArr.forEach((item) => {

            if (item.uid) {

              this.$set(this.prevMessageData, 'filed' + item.id, {

                uid: item.uid,
                /* content: "请输入内容...",*/
                realName: item.realName,
                nickName: item.nickName
              });
            }

          });

          this.drawer = true;

        }).catch((error) => {
          console.error("后台调用出错：", error);

        });


      },


      /**
       * 发送单条消息
       */
      doSubmit() {


        let uu = {
          uid: this.messageData.selectedUid,
          content: this.inputContent

        };

        let param = {
          msgList: [uu],
          typeWays: this.sendWayList
        };

        this.dataLoading2 = true;

        orgBackConsumer.sendBatchMessage(param).then((data) => {

          this.$notify.success({
            title: '成功',
            message: '发送消息成功！'

          });

          this.dataLoading2 = false;


          this.resetData();

          // 调用父组件的方法刷新
          this.$emit("handleCurrentChange", {uid: this.messageData.selectedUid})


        }).catch((error) => {
           console.error("后台调用出错：", error);
          this.dataLoading2 = false;
        });

      },

      delMsgItem(kid) {


        this.$confirm("确认删除此条消息？")
          .then(_ => {

            let obj = Object.assign({}, this.prevMessageData['filed' + kid], {
              content: null,
            });
            this.$set(this.prevMessageData, 'filed' + kid, obj);


            this.selectedCustomerId.splice(this.selectedCustomerId.findIndex(item => item === kid), 1);


          })
          .catch(_ => {
          });


      }
    }
  }
</script>

<style scoped>


  .userList {
    margin-top: 20px;

    line-height: 45px;
    text-align: left;
    height: 300px;

  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .box-card {
    width: 800px;

  }

  .box-cardA {
    width: 300px;
    max-height: 300px;
    height: 200px;
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

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 14px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }


  .editor {
    text-align: left;
    margin: 20px;
    width: 730px;
  }

  /deep/ .w-e-text-container {
    height: 360px !important;
  }
</style>

