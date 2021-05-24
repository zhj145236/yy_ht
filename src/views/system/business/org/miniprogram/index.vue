<template>
  <div class="work">


    <el-divider><span style="cursor: pointer"><router-link to="/successcase/index">成功案例<i
      class="el-icon-edit"/>编辑 </router-link> </span></el-divider>


    <div style="height:300px" v-if="successCase && successCase.length>0">

      <div v-for="(item,index) in   successCase" :key="item">

        <el-card class="successDiv">

          <table>
            <tr>
              <td rowspan="2">
                <el-avatar :size="100" shape="circle" :src="fileRefUrl+item.headImg"/>
              </td>
              <td><span style="font-size: 23px">{{item.realName}}</span></td>
            </tr>
            <tr>
              <td>
                <el-tag type="success"> {{item.courseName}}</el-tag>
              </td>
            </tr>

            <tr>
              <td colspan="2"><p style="font-size: 10px;line-height: 18px">{{(item.desc &&
                item.desc.length>=50)?item.desc.substring(0,50)+"...": item.desc}}</p>
              </td>
            </tr>

            <tr>
              <td colspan="2"><p style="font-size: 10px;line-height: 18px">学员心声： {{(item.feedback &&
                item.feedback.length>=50)?item.feedback.substring(0,50)+"...": item.feedback}}</p>
              </td>
            </tr>
          </table>

        </el-card>

      </div>


    </div>

    <div v-else class="noData">
      <i class="el-icon-info"/>
      <span> 您还没完添加任何成功案例信息。<br/>好的成功案例能更好地吸引用户<br/>
      <router-link to="/successcase/index" style="color: #36a3f7">快来添加
      </router-link>
      吧</span>
    </div>

    <el-divider><span style="cursor: pointer"><router-link to="/good_teacher/index">师资力量<i
      class="el-icon-edit"/>编辑</router-link></span></el-divider>

    <div>

      <div v-if="goodTeacher && goodTeacher.length>0">

        <div v-for="(item,index) in   goodTeacher" :key="item">

          <el-card class="teacherDiv">

            <table>
              <tr>
                <td style="text-align: center" rowspan="2">
                  <el-avatar :size="110" :src="fileRefUrl+item.headImg"/>
                  <br/>
                  <span style="font-size: 20px">{{item.realName}}</span>
                </td>
                <td>

                  <p style="font-size: 15px; line-height: 30px">


                    <i class="el-icon-trophy-1"/> {{item.teachYear}}年教龄 <br/>
                    <i class="el-icon-data-analysis"/>授课过{{item.teachStudent}}个学生 <br/>
                    <i class="el-icon-mobile-phone"/> {{item.callTel}}
                  </p>

                </td>

              </tr>

              <tr>

                <td>
                  <p style="text-align: right;font-size: 13px">
                    <el-tag type="success">{{item.teachCourse}}</el-tag>
                  </p>

                </td>
              </tr>

              <tr>
                <td colspan="2">
                  <p style="font-size: 10px;line-height: 17px">
                    简介: {{(item.desc && item.desc.length>=100)?item.desc.substring(0,100)+"...": item.desc}}</p>
                </td>
              </tr>

              <tr>
                <td colspan="2">
                  <p style="font-size: 10px;line-height: 17px">座右铭: {{item.motto}}</p>
                </td>
              </tr>


            </table>

          </el-card>
        </div>
      </div>

      <div v-else class="noData">
        <i class="el-icon-info"/>
        <span> 您还没完添加任何师资力量信息。<br/>
      <router-link to="/good_teacher/index" style="color: #36a3f7">添加师资信息
      </router-link>
      来展示你们机构的实力吧</span>
      </div>

    </div>

  </div>


</template>
<script>


  import {mapGetters} from "vuex";
  import request from '@/utils/request';


  export default {
    name: 'xxxxxx',

    mounted() {


      this.getSuccessCase();
      this.getGoodTeacher();


    },

    computed: {
      ...mapGetters([
        'baseApi',
        'fileRefUrl',
      ])

    },

    data() {
      return {


        successCase: [],

        goodTeacher: []
      }
    },
    methods: {

      /**
       * 成功案例
       */
      getSuccessCase() {
        request({
          url: 'api/orgSuccessCase',
          method: 'GET'
        }).then(res => {

          this.successCase = res.content;

        });

      },

      /**
       * 机构师资
       */
      getGoodTeacher() {

        request({
          url: 'api/orgGoodTeacher',
          method: 'GET'
        }).then(res => {

          this.goodTeacher = res.content;

        });


      }


    }
  }


</script>
<style scoped>


  .noData {

    padding-top: 100px;
    font-size: 15px;
    text-align: center;
    line-height: 30px;
    height: 300px;


  }

  .successDiv {
    height: 260px;
    width: 300px;
    display: block;
    float: left;
    margin-right: 15px;
  }


  .teacherDiv {

    height: 400px;
    width: 300px;
    display: block;
    float: left;
    margin-right: 15px;

  }


  .work {

    margin: 0 auto;

    width: 650px;
  }


</style>
