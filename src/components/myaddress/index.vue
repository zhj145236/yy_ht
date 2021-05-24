<template>


  <div class="address-container">
    <table>
      <tr>
        <td>
          <el-cascader :options="ssq" @change="sendLocation"
                       v-model="selectedOptions" filterable/>
        </td>
        <td>
          <el-input placeholder="请填写地址" v-model="inputAddr" @blur="sendLocation"/>
        </td>
      </tr>

    </table>


  </div>
</template>

<script>
  import request from '@/utils/request'
  import Vue from "vue";


  export default {
    name: 'Test',
    mixins: [],

    props: {

      selectSSQ: {
        type: Array
      },
      simpleAddress:
        {
          type: String
        }
    },


    watch: {


      selectSSQ: {

        deep: true,

        handler(newVal, oldVal) {

          let arr = newVal;
          if (arr && arr.length === 3 && arr[0] !== null && arr[1] !== null && arr[2] !== null) {

            this.selectedOptions = arr.map((item) => {
              return parseInt(item + '');
            });

          } else {

            this.selectedOptions = [9655, 9799, 11186]; // 广东省 / 东莞市 / 南城区

          }

          this.$forceUpdate();
        }

      },

      simpleAddress(val) {

        this.inputAddr = val || '';

      }


    },

    mounted() {


      request({
        url: '/api/sysMapDict/loadAreaTree',
        method: 'GET'
      }).then(res => {

        res.map(function (sheng) {
          sheng.value = sheng.id;
          sheng.label = sheng.name;
          sheng.child.map(function (shi) {
            shi.value = shi.id;
            shi.label = shi.name;
            shi.child.map(function (qu) {
              qu.value = qu.id;
              qu.label = qu.name;
            });
            shi.children = shi.child;
          });
          sheng.children = sheng.child;
          return sheng;
        });

        this.ssq = res;

        // TODO 省市区值变了，不会自动回显

        this.inputAddr = this.simpleAddress || '';

        let arr = this.selectSSQ;
        if (arr && arr.length === 3 && arr[0] !== null && arr[1] !== null && arr[2] !== null) {
          this.selectedOptions = arr.map((item) => {
            return parseInt(item + '');
          });
        } else {

          this.selectedOptions = [9655, 9799, 11186]; // 广东省 / 东莞市 / 南城区
        }


      });


    },

    data() {
      return {


        ssq: [],

        selectedOptions: [],
        inputAddr: "",


      }
    },


    methods: {


      sendLocation(param) {

        this.$emit("ansyLocation", this.selectedOptions, this.inputAddr);

      },


    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>


  .address-container {


  }
</style>

