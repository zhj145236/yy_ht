<template>
  <div>

    <el-row :gutter="15">


      <el-col :xs="24" :sm="24" :md="11" :lg="9" :xl="10">

        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="role-span">联系平台</span>
          </div>

          <div class=" item">
            <p style="font-size: 15px; "><i class="el-icon-service"/>在使用本平台过程中，如果有任何意见或建议，您都可以通过电话、邮箱方式或者提交表单给我们我们留言，我们倾听每一位用户的心声并认真对待，感谢您的参与。
            </p>
          </div>

          <div class="text item">
            <i class="el-icon-office-building"/>公司：东莞市昱升科技有限公司
          </div>
          <div class="text item">
            <i class="el-icon-map-location"/>地址：广东省东莞市厚街镇莞太路厚街段281号2号楼406室
          </div>
          <div class="text item">
            <i class="el-icon-phone"/>电话：13500001111
          </div>
          <div class="text item">
            <i class="el-icon-message"/>邮箱：gongjinwei@ysnewtop.com
          </div>
          <div class="text item">
            <i class="el-icon-location"/>地图:
          </div>
          <div id="containerMap" style="border: 1px solid black;height: 350px">

          </div>

        </el-card>

      </el-col>

      <el-col :xs="24" :sm="24" :md="13" :lg="11" :xl="14" style="margin-bottom: 10px">

        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="role-span">给平台留言</span>
          </div>

          <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="100px">


            <el-form-item label="反馈类型" prop="feedbackType">

              <el-select v-model="form.feedbackType" filterable allow-create placeholder="请选择类型" style="width: 750px">
                <el-option
                  v-for="item in dict.feedback_type" :key="item.id"
                  :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>


            <el-form-item label="留言内容" prop="message">
              <el-input :rows="8" v-model="form.message" type="textarea"
                        style="width: 750px;" placeholder="请输入您想对我们说的话，2-500字之间"/>
            </el-form-item>


            <!--   上传文件   -->
            <el-form-item label="上传附件" style="width: 750px">
              <el-upload
                ref="upload"
                :limit="3"
                :before-upload="beforeUpload"

                :headers="headers"
                :on-success="handleSuccess"
                :on-error="handleError"
                :action="fileUploadApi"
              >

                <div class="eladmin-upload"><i class="el-icon-upload"/>添加文件</div>
                <div slot="tip" class="el-upload__tip">最多3个文件，每个不超过3MB</div>
              </el-upload>

            </el-form-item>

            <el-form-item>
              <el-button :loading="loading" style="margin-left:1.6%;" size="medium" type="primary" @click="doSubmit">发送
              </el-button>
            </el-form-item>

          </el-form>
          {{form}}


        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>


  import crudPlatMessage from '@/api/system/platMessage'
  import {mapGetters} from 'vuex'
  import {TMap} from '@/components/tmap/TMap.js'
  import {getToken} from '@/utils/auth'

  export default {
    name: 'Index',

    dicts: ['feedback_type'],

    data() {
      return {
        loading: false,
        headers: {'Authorization': getToken()},
        tMap: {},
        point: {},
        marker: null,
        innerVisible: false,
        qq: null,
        lnglatStr_Data: "",

        form: {
          message: '',
          feedbackType: '',
          attachment: ''

        },

        rules: {

          feedbackType: [
            {required: true, message: '请选择类型', trigger: 'blur'}
          ],

          message: [
            {required: true, message: '请输入你想留言的内容，2-500字', trigger: 'blur'}
          ]


        }
      }
    },

    computed: {
      ...mapGetters([
        'imagesUploadApi',
        'fileUploadApi'
      ])
    },
    mounted() {

      this.initMyMap();


    },
    methods: {

      crudPlatMessage,

      initMyMap() {


        if (this.qq === null) {
          TMap().then(qq => {

            this.qq = qq;

            this.tMap = new this.qq.maps.Map(document.getElementById("containerMap"), {
              // 地图的中心地理坐标。
              center: new qq.maps.LatLng(22.934919, 113.669894), //莞亿云谷位置
              zoom: 13

            });

            // 注意经纬度顺序
            this.marker = new qq.maps.Marker({
              position: new this.qq.maps.LatLng(22.934919, 113.669894), //标记的经纬度
              animation: qq.maps.MarkerAnimation.DROP,//标记的动画
              map: this.tMap//标记的地图
            });


          });
        } else {

        }

      },


      // 上传文件
      upload() {
        this.$refs.upload.submit()
      },


      beforeUpload(file) {

        let isLt2M = true;
        isLt2M = file.size / 1024 / 1024 < 100;
        if (!isLt2M) {
          this.loading = false;
          this.$message.error('上传文件大小不能超过 100MB!')
        }
        this.form.name = file.name;
        return isLt2M
      },
      handleSuccess(response, file, fileList) {


        this.form.attachment += (response.path+',');


      },

      // 监听上传失败
      handleError(e, file, fileList) {
        const msg = JSON.parse(e.message);
        this.$notify({
          title: msg.message,
          type: 'error',
          duration: 2500
        });
        this.loading = false
      },


      doSubmit() {

        this.$refs['form'].validate((valid) => {

          if (valid) {


            this.loading = true;

            crudPlatMessage.add(this.form).then(res => {

              this.$notify({
                title: '留言发送成功，平台将会尽快给您回复',
                type: 'success',
                duration: 2500
              });
              this.loading = false;

              this.form = {
                message: '',
                feedbackType: '',
                attachment: '',
              };
              this.$refs.upload.clearFiles();


            }).catch(err => {

              this.loading = false;

              console.log(err.response.data.message)
            });

          } else {
            return false;

          }
        })
      }
    }
  }
</script>

<style scoped>


  .box-card {

    height: 680px;

  }

  .text {
    font-size: 18px;
    line-height: 20px;
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


  /deep/ .w-e-text-container {
    height: 360px !important;
  }
</style>
