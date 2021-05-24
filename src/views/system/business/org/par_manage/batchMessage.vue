<template>
  <div>

    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      direction="ttb"
      :before-close="handleClose" size="45%">
      <span>我来啦!</span>
    </el-drawer>

  </div>
</template>

<script>


  import {mapGetters} from 'vuex'


  export default {
    name: 'Index',

    dicts: ['feedback_type'],

    data() {
      return {

        drawer:true,
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


      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },

      doSubmit() {


      }
    }
  }
</script>

<style scoped>

  .text {
    font-size: 20px;
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

