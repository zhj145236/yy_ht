<template>

  <div>


    <el-card class="box-card" shadow="hover">

      <div slot="header" class="clearfix">
        <span class="role-span">已发送消息({{messageData.totalElements}}条)</span>
      </div>

      <div class="box-card-content">

        <div v-for="item in messageData.content" :key="item.id" class="item">
          <p> {{translateTime( item.createTime ,"MM/dd hh:mm")}}</p>
          <p>{{item.content}}</p>
          <el-divider/>
        </div>
      </div>

    </el-card>

  </div>


</template>

<script>

  import {mapGetters} from 'vuex'
  import {translateDate, translateTime} from "@/utils/index";

  export default {
    name: 'Index',

    dicts: ['feedback_type'],

    props: ['messageData'],

    data() {
      return {
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
      ])
    },
    mounted() {

    },
    methods: {

      translateDate,
      translateTime,

      doSubmit() {


      }
    }
  }
</script>

<style scoped>

  .text {
    font-size: 20px;
  }

  .box-card-content {

    min-height: 500px;
    max-height: 100px;
    overflow-y: scroll;
  }

  .item {
    margin-bottom: 25px;
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

