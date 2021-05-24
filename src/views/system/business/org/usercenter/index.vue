<template>
  <div class="app-container">


    <el-tabs type="border-card" value="first">


      <el-tab-pane name="one">

        <span slot="label"><i class="el-icon-camera-solid"/>谁关注我</span>

        <div class=" messageCell" v-if="whoFollowMeData && whoFollowMeData.length>0">

          <el-card>
            <el-row :gutter="20">

              <el-col :span="6" v-for="(item1, i) in whoFollowMeData" :key="i">

                <div class="grid-content bg-purple">
                  <p>
                    <el-avatar :size="80" fit="scale-down" shape="circle"
                               :src="fileRefUrl+ whoFollowMeData[i].headImg"/>
                  </p>

                  <h4> {{whoFollowMeData[i].nickName }}
                    <br/>
                    <el-tag v-if="whoFollowMeData[i].role==='par'" effect="plain">家长</el-tag>
                    <el-tag v-else-if="whoFollowMeData[i].role==='tea'" effect="plain" type="success">教师</el-tag>
                    <el-tag v-else-if="whoFollowMeData[i].role==='org'" effect="plain" type="warning">辅导机构</el-tag>
                    <el-tag v-else effect="plain" type="info">未知</el-tag>
                  </h4>

                </div>
              </el-col>

            </el-row>


          </el-card>

        </div>

        <div v-else class="messageCell">

          <div class="noData">
            <i class="el-icon-info"/>
            <span>暂时没有用户关注您，在小程序里多发布动态可以提高别人关注你的机会哦</span>
          </div>
        </div>

      </el-tab-pane>


      <el-tab-pane name="first">

        <span slot="label"><i class="el-icon-help"/>我的动态</span>

        <el-container>
          <el-main>

            <div v-if="dynamicList && dynamicList.length>0" class="infinite-list " v-infinite-scroll="moreDynamic"
            >

              <div class="messageCell " v-for="(item,index) in dynamicList" :key="index">

                <el-card shadow="hover">
                  <el-row :gutter="20">
                    <div style="padding: 14px;">
                      <p>{{item.content}}</p>
                    </div>
                  </el-row>

                  <el-row :gutter="7" v-if="item.picCount>=1">

                    <el-col :span="7" v-for=" index3  in item.picCount">
                      <el-image style="width: 200px; height: 200px" :src="item.picArr[index3-1]"
                                :preview-src-list="item.picArr">
                      </el-image>
                    </el-col>
                  </el-row>
                  <el-row v-else-if="item.video">
                    <el-col :span="24">
                      <video :src="item.video" controls="controls" width="300px">
                        您的浏览器不支持 播放视频 标签。
                      </video>
                    </el-col>
                  </el-row>

                  <el-row style="padding: 20px">

                    <el-col :span="6">

                      <div class="grid-content bg-purple"><!--@click="getDetailTime(item.createTime)"-->
                        <el-tooltip :content="translateTime(item.createTime)" placement="top-start" effect="light">
                          <el-link><i class="el-icon-time"/> {{item.publishDesc}}
                          </el-link>
                        </el-tooltip>
                      </div>
                    </el-col>

                    <el-col :span="6">
                      <div class="grid-content bg-purple">
                        <el-link @click="getLikeUsers(item)"><i class="el-icon-thumb"/> {{item.like}}</el-link>
                      </div>
                    </el-col>

                    <el-col :span="6">
                      <div class="grid-content bg-purple-light">
                        <el-link @click="getMessageList(item)"><i class="el-icon-chat-dot-square"/>
                          {{item.commentCount}}
                        </el-link>
                      </div>
                    </el-col>

                    <el-col :span="6">
                      <div class="grid-content bg-purple-light">
                        <el-link @click="deleteThisMessage(item)"><i class="el-icon-delete"/></el-link>
                      </div>
                    </el-col>
                  </el-row>

                </el-card>

              </div>

            </div>
            <div v-else>
              <div class="messageCell">
                <div class="noData">
                  <i class="el-icon-info"/>
                  <span>暂无发布动态,快去小程序里发布自己的动态吧，让别人更懂您</span>
                </div>

              </div>
            </div>
          </el-main>


          <!-- 点赞 抽屉--->
          <el-drawer
            :visible.sync="drawer1" direction="rtl">

            <el-row :gutter="20">
              <el-col :span="6" v-for="(item1, i) in likeUserData" :key="i">
                <div>
                  <p>
                    <el-avatar :size="50" fit="scale-down" shape="circle" :src="fileRefUrl +item1.headImg"/>
                  </p>
                  <h4> {{item1.nickName}}
                    <br/>
                    <el-tag v-if="item1.role==='par'" effect="plain">家长</el-tag>
                    <el-tag v-else-if="item1.role==='tea'" effect="plain" type="success">教师</el-tag>
                    <el-tag v-else-if="item1.role==='org'" effect="plain" type="warning">辅导机构</el-tag>
                    <el-tag v-else effect="plain" type="info">未知</el-tag>
                  </h4>

                </div>
              </el-col>

            </el-row>

          </el-drawer>


          <!-- 留言人员 --->
          <el-drawer
            title="留言列表"
            :visible.sync="drawer2"
            direction="rtl">


            <div style="height:1000px; overflow-y: scroll ">
              <div v-for="(item2, i) in messageData" :key="i"
                   style="font-size: 13px;line-height: 25px ;background-color: #3a71a8 ">

                <el-card>

                  <el-row>

                    <el-col :span="5">
                      <el-avatar :size="50" fit="scale-down" shape="circle" :src=" fileRefUrl+item2.headImage1"/>
                      <p style="color: #3a71a8"> {{item2.nickName1}}</p>
                    </el-col>


                    <el-col :span="18">
                      <p><i class="el-icon-chat-line-square"/> {{item2.comment}}
                      </p>
                      <p style="text-align: right"><i class="el-icon-time"/>{{translateTime(item2.createTime)}}</p>

                      <div style=" background-color: #F5F5F5 " v-if="item2.updateTime!=null">
                        <p><i class="el-icon-position"/> {{item2.replyContent}}</p>
                        <p style="text-align: right"><i class="el-icon-time"/> {{translateTime(item2.updateTime)}}</p>
                      </div>

                      <div style="background-color: #F5F5F5" v-else>
                        <el-input
                          placeholder="输入内容回复TA"
                          v-model="item2.replyContent">
                          <el-button slot="append" icon="el-icon-right" @click="replyUser(item2)"/>
                        </el-input>

                      </div>

                    </el-col>
                  </el-row>


                </el-card>
              </div>
              <div style="height: 200px;"></div>
            </div>
          </el-drawer>


        </el-container>
      </el-tab-pane>

      <el-tab-pane name="second">

        <span slot="label"><i class="el-icon-magic-stick"/>我的关注</span>


        <div class="messageCell" v-if="myFollowedData && myFollowedData.length>0">

          <el-card>

            <el-row :gutter="20">

              <el-col :span="6" v-for="(item1, i) in myFollowedData.length" :key="i">

                <div>
                  <p>
                    <el-avatar :size="80" fit="scale-down" shape="circle" :src="fileRefUrl+ myFollowedData[i].headImg"/>
                  </p>

                  <h4> {{myFollowedData[i].nickName }}
                    <br/>
                    <el-tag v-if="myFollowedData[i].role==='par'" effect="plain">家长</el-tag>
                    <el-tag v-else-if="myFollowedData[i].role==='tea'" effect="plain" type="success">教师</el-tag>
                    <el-tag v-else-if="myFollowedData[i].role==='org'" effect="plain" type="warning">辅导机构</el-tag>
                    <el-tag v-else effect="plain" type="info">未知</el-tag>
                  </h4>

                </div>
              </el-col>

            </el-row>

          </el-card>
        </div>


        <div v-else class="messageCell">

          <div class="noData">

            <i class="el-icon-info"/>
            <span>您还没有关注过其他用户 </span>
          </div>

        </div>


      </el-tab-pane>


      <el-tab-pane name="four">

        <span slot="label"><i class="el-icon-star-off"/>谁收藏我的课程</span>

        <div class="messageCell">

          <el-table ref="table" v-loading="false" :data="collectMyCourseData" style="width: 100%;">

            <el-table-column prop="headImg" label="头像">
              <template slot-scope="{row}">
                <el-avatar :size="60" fit="scale-down" shape="circle" :src="fileRefUrl+row.headImg"/>
              </template>
            </el-table-column>


            <el-table-column prop="role" label="收藏者">

              <template slot-scope="{row}">

                <h3> {{row.nickName}}</h3>
                <p v-if="row.role==='par'">
                  <el-tag effect="plain" type="success">家长</el-tag>
                </p>
                <p v-else-if="row.role==='tea'">
                  <el-tag effect="plain" type="success">教师</el-tag>
                </p>
                <p v-else-if="row.role==='org'">
                  <el-tag effect="plain" type="warning">辅导机构</el-tag>
                </p>
                <p v-else>
                  <el-tag effect="plain" type="info">未知</el-tag>
                </p>
                <el-button type="text" v-if="row.canApply" icon="el-icon-mobile-phone" @click="applyViewTel(row.uid)">
                  申请查看TA的电话
                </el-button>

              </template>
            </el-table-column>

            <el-table-column prop="yyy" label="收藏我的课程" min-width="200">

              <template slot-scope="{row}">
                <el-tag v-for="(item,index) in row.courseList" effect="plain" type="info">{{item.title}}</el-tag>
              </template>
            </el-table-column>


          </el-table>
        </div>


      </el-tab-pane>


      <el-tab-pane name="five">
        <span slot="label"><i class="el-icon-chat-line-round"/>用户给我留言</span>

        <div class="grid messageCell">


          <el-table ref="table" v-loading="false"
                    :data="myCommentData"
                    style="width: 100%;">

            <el-table-column prop="headImg" label="留言者">
              <template slot-scope="{row}">

                <p>
                  <el-avatar :size="60" fit="scale-down" shape="circle" :src="fileRefUrl+row.headImg1"/>
                </p>
                <h2>{{row.nickName1}}</h2>
                <p v-if="row.role1==='par'">
                  <el-tag effect="plain" type="success">家长</el-tag>
                </p>
                <p v-else-if="row.role1==='tea'">
                  <el-tag effect="plain" type="success">教师</el-tag>
                </p>
                <p v-else-if="row.role1==='org'">
                  <el-tag effect="plain" type="warning">辅导机构</el-tag>
                </p>
                <p v-else>
                  <el-tag effect="plain" type="info">未知</el-tag>
                </p>
              </template>
            </el-table-column>

            <el-table-column prop="yyy" label="留言" min-width="200">
              <template slot-scope="{row}">


                <p><i class="el-icon-chat-line-square"/> {{row.comment}} </p>
                <p><i class="el-icon-time"/> {{translateTime(row.createTime)}}</p>
                <p>
                  <el-tag size="mini">{{ getMessageType(row.commentType)}}</el-tag>
                </p>
              </template>
            </el-table-column>

            <el-table-column prop="mkl" label="我的回复" min-width="200">
              <template slot-scope="{row}">
                <p><i class="el-icon-position"/> {{row.replyContent}}</p>
                <p><i class="el-icon-time"/>{{translateTime(row.updateTime)}}</p>
              </template>
            </el-table-column>

          </el-table>

        </div>

      </el-tab-pane>


    </el-tabs>

  </div>
</template>

<script>


  import {
    myDynamic,
    myfollow,
    followedMe,
    collectMyCourse,
    myComment,
    messageList,
    likeUsers,
    replyUser
  } from '@/api/system/orgCircleMessage';

  import {translateTime, translateDate} from '@/utils/index';

  import {mapGetters} from "vuex";


  export default {
    name: 'OrgCenter',

    data() {

      return {
        myCommentData: [],
        dynamicList: [],
        myFollowedData: [],
        whoFollowMeData: [],
        collectMyCourseData: [],

        page: 0,
        loadComplete: false,

        drawer1: false,
        likeUserData: [],

        drawer2: false,
        messageData: '留言列表',

        replyMessage: ""


      }
    },

    computed: {
      ...mapGetters([
        'baseApi',
        'fileRefUrl',
      ])
    },
    mounted() {


      this.loadMyDynamic(this.page);

      // 我的关注的人
      myfollow().then((data) => {

        this.myFollowedData = data;

      }).catch((error) => {
        console.error("后台调用出错：", error);
      });


      // 谁关注我
      followedMe().then((data) => {

        this.whoFollowMeData = data;

      }).catch((error) => {
        console.error("后台调用出错：", error);
      });


      //谁收藏了我的课程
      collectMyCourse().then((data) => {

        this.collectMyCourseData = data;

      }).catch((error) => {
        console.error("后台调用出错：", error);
      });

      //用户给我留言

      myComment().then((data) => {

        this.myCommentData = data;

      }).catch((error) => {
        console.error("后台调用出错：", error);
      });

    },
    methods: {

      translateTime,
      translateDate,


      //回复用户
      replyUser(item) {

        console.info(item);

        replyUser({replyContent: item.replyContent, id: item.id + ''}).then((data) => {

          if (data) {

            this.$message({
              showClose: true,
              message: '回复成功',
              type: 'success'
            });

            for (let i = 0; i < this.messageData.length; i++) {

              if (this.messageData[i].id === item.id) {
                this.$set(this.messageData[i], 'updateTime', data.updateTime);
                this.$forceUpdate();

              }
            }


          }

        }).catch((error) => {
          console.error("后台调用出错：", error);
        });


      },

      //删除动态
      deleteThisMessage(item) {

        // TODO
        alert("TODO 删除动态--》" + item.id);
      },


      // 判断消息类型
      getMessageType(commentTypeValue) {


        if (3 === commentTypeValue) {

          return "在主页上留的言";
        } else if (4 === commentTypeValue) {

          return "在课程产品上留的言";
        } else if (7 === commentTypeValue) {

          return "在动态上留的言";

        } else {

          return "未知";
        }

      },


      /**
       * 获取点赞人员
       * @param item
       */
      getLikeUsers(item) {

        likeUsers(item.id).then((data) => {

          if (data && data.length >= 1) {

            this.likeUserData = data;
            this.drawer1 = true;

          } else {

            this.$message('暂无用户点赞哦');
          }


        }).catch((error) => {

          console.error("后台调用出错：", error);

        });

      },


      /**
       * 获取留言
       * @param item
       */
      getMessageList(item) {


        messageList(item.id).then((data) => {


          if (data && data.length >= 1) {

            this.messageData = data;
            this.drawer2 = true;

          } else {
            this.$message('暂无用户留言哦');
          }


        }).catch((error) => {
          console.error("后台调用出错：", error);
        });

      },


      loadMyDynamic(page) {

        if (this.loadComplete) {
          this.$message({
            message: '没有更多的动态了',
            center: true
          });
          return;
        }

        // 我的动态
        myDynamic(page).then((data) => {

          if (data == null || data.length === 0) {
            this.loadComplete = true;
          }

          this.dynamicList.push(...data);


          this.dynamicList.map((item => {

            item.picCount = this.getPicCount(item.picture);
            item.picArr = this.getPicArr(item.picture);

          }));


        }).catch((error) => {
          console.error("后台调用出错：", error);
        });

      },


      applyViewTel(parId) {

        alert("TODO 未实现：" + parId);

      },

      moreDynamic() {

        this.loadMyDynamic(this.page++);


      },
      getPicCount(picStr) {


        if (picStr === null || picStr === '') {
          return 0;
        }

        return picStr.split(",").length;

      },
      getPicArr(picStr) {


        if (picStr === null || picStr === '') {
          return [];
        }


        let tt = [];


        let splitElement = picStr.split(",");


        for (let i = 0, ss = splitElement.length; i < ss; i++) {

          if (splitElement[i].trim() !== "") {
            tt.push(this.fileRefUrl + splitElement[i]);
          }

        }


        return tt;
      }


    }
  }
</script>

<style scoped>


  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }


  .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .messageBox {

    height: 1000px;

    overflow-y: scroll;

  }

  .messageCell {

    width: 600px;
    margin: 0 auto 20px;
    min-height: 800px;
    max-height: 1200px;
    overflow-y: auto;


  }

  .noData {

    display: block;

    margin: 250px auto 0;
    font-size: 17px;

  }

</style>
