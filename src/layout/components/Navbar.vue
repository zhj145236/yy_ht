<template>
  <div class="navbar">


    <div class="right-menu">


      <template v-if="device!=='mobile'">


        <!--<router-link to="/notice/index">

          <el-link style="height: 45px" class="right-menu-item ">
            <span v-if="unReadPrivateCount>0">
            <el-badge :value="unReadPrivateCount">
              <svg-icon icon-class="message"/>
            </el-badge>
            </span>

            <span v-else>
              <svg-icon icon-class="message"/>
            </span>

          </el-link>

        </router-link>-->

        <el-link  class="right-menu-item ">{{user.nickName}}</el-link>


      </template>


      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="user.avatarName ? fileRefUrl + user.avatarName : Avatar" class="user-avatar" alt=""/>
          <i class="el-icon-caret-bottom"/>
        </div>

        <el-dropdown-menu slot="dropdown">

          <router-link to="/user/center">
            <el-dropdown-item>
              个人中心
            </el-dropdown-item>
          </router-link>

          <span style="display:block;" @click="open">
                  <el-dropdown-item divided>
                    退出登录
                  </el-dropdown-item>
                </span>
        </el-dropdown-menu>
      </el-dropdown>


    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import request from '@/utils/request'


  import Avatar from '@/assets/images/avatar.png'

  export default {
    components: {},
    data() {
      return {
        Avatar: Avatar,
        dialogVisible: false,
        unReadPrivateCount: 0
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'device',
        'user',
        'baseApi',
        'fileRefUrl'
      ]),
      show: {
        get() {
          return this.$store.state.settings.showSettings
        },
        set(val) {
          this.$store.dispatch('settings/changeSetting', {
            key: 'showSettings',
            value: val
          })
        }
      }
    },
    mounted() {



      //TODO 更新消息数量图标

    },
    methods: {

      /**
       * 未读消息数量
       */
/*      getUnReadPrivateCount() {
        request({
          url: '/api/platNotice/unReadPrivateCount',
          method: 'GET'
        }).then((data => {

          this.unReadPrivateCount = data;

        })).catch((error) => {

        });


      },*/
      open() {
        this.$confirm('确定注销并退出系统吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.logout()
        })
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
