<template>
  <div>


    <div v-if="messageData && messageData.length>0">

      <el-card class="box-card" v-for="(item,index) in messageData">

        <div class="text item">

          <p>{{item.message}}</p>

          <div>

            <p style="text-align: right;">
              <el-tag>{{item.feedbackType}}</el-tag>
            </p>
            <p style="text-align: right;font-size: 13px">{{translateTime(item.createTime)}}</p>
          </div>

          <div v-if="item.replyContent">
            <el-divider content-position="left"><i class="el-icon-s-promotion"/>平台回复</el-divider>
            <p> {{item.replyContent}} </p>
            <p style="text-align: right;font-size: 13px">{{translateTime(item.replyTime)}}</p>
          </div>
        </div>
      </el-card>

    </div>

    <div class="noData" v-else>

      <i class="el-icon-info"/>
      <span>您还没有给我们留言过。有什么想对我们说的吗？欢迎给我们留言</span>
    </div>
  </div>
</template>

<script>


  import {mapGetters} from 'vuex'
  import {list} from '@/api/system/platMessage'


  import {translateTime} from "@/utils/index";

  export default {
    name: 'Record',

    dicts: ['feedback_type'],

    data() {
      return {

        messageData: []

      }
    },
    computed: {
      ...mapGetters([
        'imagesUploadApi'
      ])
    },
    mounted() {

      // this.messageList();

    },
    methods: {

      translateTime,

      messageList() {

        list().then(res => {


          this.messageData = res.content;

        }).catch(err => {

          console.log(err.response.data.message);

        });
      }
    }
  }
</script>

<style scoped>
  .box-card {

    line-height: 28px;
    width: 400px;
    height: 350px;
    overflow-y: auto;
    display: inline-block;
    margin: 10px;

  }


  .noData {

    padding-top: 100px;
    font-size: 15px;
    text-align: center;
    line-height: 30px;
    height: 300px;


  }


</style>
