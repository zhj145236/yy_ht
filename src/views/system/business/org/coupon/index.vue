<template>
  <div class="app-container">

    <!--工具栏-->
    <div class="head-container">
      <!--  <div v-if="crud.props.searchToggle">
          &lt;!&ndash; 搜索 &ndash;&gt;
          <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;"
                    class="filter-item" @keyup.enter.native="crud.toQuery"/>
          <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
            <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name"
                       :value="item.key"/>
          </el-select>
          <rrOperation :crud="crud"/>
        </div>-->

      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>


      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="550px">
        <el-form ref="form" :model="form" :rules="rules" size="small"
                 label-width="100px">

          <el-form-item label="标题">
            <el-input v-model="form.title" style="width: 370px;" placeholder="必填，20字以内"/>
          </el-form-item>

          <el-form-item label="简介">
            <el-input v-model="form.desc" style="width: 370px;" placeholder="优惠券描述，选填"/>
          </el-form-item>

          <!--    <el-form-item label="标签">
          <el-input v-model="form.label" style="width: 370px;"/>
        </el-form-item>

 <el-form-item label="每人限领X张">
          <el-input-number v-model="form.everyoneLimit" :min="0" :max="99999" label="请输入数字"/>
        </el-form-item>

          <el-form-item label="优惠券总数量">
            <el-input-number v-model="form.couponCount" :min="0" :max="99999" label="请输入数字"/>
          </el-form-item>

          <el-form-item label="最低消费X元">
            <el-input-number v-model="form.minConsume" :min="0" :max="99999" label="请输入数字"/>
          </el-form-item>
-->
          <el-form-item label="优惠方式">
            <el-radio v-model="form.couponWay" :label="1">优惠金额</el-radio>
            <el-radio v-model="form.couponWay" :label="2">优惠折扣</el-radio>
          </el-form-item>

          <el-form-item label="优惠金额" v-if="  parseInt(form.couponWay) ===1 ">
            <el-input style="width: 370px;" prefix-icon="el-icon-money" v-model="form.couponType1" :min="0" :max="99999"
                      placeholder="X元，整数，必填"/>

          </el-form-item>

          <el-form-item label="优惠折扣" v-if=" parseInt(form.couponWay)=== 2 ">
            <el-input style="width: 370px;" prefix-icon="el-icon-price-tag" v-model="form.couponType2" :min="0"
                      :max="10"
                      placeholder="X折，整数，必填"/>

          </el-form-item>

          <el-form-item label="有效期类型">
            <el-radio v-model="form.expireType" label="1">领劵有效天数</el-radio>
            <el-radio v-model="form.expireType" label="2">指定起止时间</el-radio>

          </el-form-item>

          <el-form-item label="领劵有效天数" v-if=" parseInt (form.expireType) ===1 ">
            <el-input prefix-icon="el-icon-time" style="width: 370px;" v-model="form.validateDay" :min="0" :max="99999"
                      placeholder="有效天数，必填"/>
          </el-form-item>

          <el-form-item label="领劵起止时间" v-if="parseInt(form.expireType)===2 ">

            <el-date-picker v-model="form.beginTime" type="datetime" style="width: 180px"/>
            至
            <el-date-picker v-model="form.endTime" type="datetime" style="width: 180px"/>

          </el-form-item>


          <el-form-item label="使用范围">
            <el-radio :disabled="disableCommon" v-model="form.useType" :label="-1">
              全场通用<el-popover v-show="disableCommon"
                              placement="top-start"
                              trigger="hover"
                              content="之前已经设置过一张通用优惠券了，不可重复设置">
              <i slot="reference" class="el-icon-question"/>
            </el-popover>
            </el-radio>

            <el-radio v-model="form.useType" :label="1">指定课程</el-radio>
          </el-form-item>

          <el-form-item label="说明" v-if=" parseInt(form.useType) === -1  ">
            <p>全场通用优惠券最多只能设置一张，以后不能再次添加</p>
          </el-form-item>

          <el-form-item label="关联的课程" v-if=" parseInt(form.useType) ===1  ">
            <el-select v-model="form.cid" filterable placeholder="请选择课程，必选" style="width: 370px">
              <el-option
                v-for="item in  courseCop " :key="item.id" :disabled="parseInt(item.remark)===1 "
                :label="item.title+'('+item.price+'元)'" :value="item.id"/>
            </el-select>

          </el-form-item>


        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">


        <el-table-column prop="xxxx" label="信息1">

          <template slot-scope="{row}">

            <h2>{{row.title}}</h2>
            <p>{{row.desc}}</p>

            <p>
              <el-tag v-if=" row.useType  === -1" type="primary">通用优惠券</el-tag>
              <el-tag v-else type="success">仅限{{row.courseName}}课程使用，课程原价
                <svg-icon icon-class="money"/>
                {{row.price}}
              </el-tag>
            </p>
          </template>

        </el-table-column>

        <el-table-column prop="yyyyy" label="信息2">

          <template slot-scope="{row}">

            <h3>
              <span v-if="parseInt( row.expireType) ===1"><i class="el-icon-timer"/>领取后{{row.validateDay}}天内有效 </span>
              <span v-if="parseInt( row.expireType) ===2"><i class="el-icon-timer"/>{{ translateTime(row.beginTime)}} 至 {{translateTime(row.beginTime)}} 间有效</span>
            </h3>
            <h3>
              <span v-if="parseInt(row.couponWay) === 1"><i class="el-icon-present"/> 优惠{{row.couponType1}}元 </span>
              <span v-if="parseInt(row.couponWay) === 2"><i class="el-icon-present"/> 折扣{{row.couponType2}}折</span>
            </h3>
            <p><i class="el-icon-user"/> 累计{{row.applyCount}}人领取</p>

          </template>

        </el-table-column>


        <!-- 操作按钮 -->
        <el-table-column v-permission="['admin','org:coupon:edit','org:coupon:del']" label="操作" width="150px"
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
  </div>
</template>

<script>
  import crudOrgCoupon from '@/api/system/orgCoupon'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import {translateDate, translateTime} from "@/utils/index";

  const defaultForm = {
    id: null,
    title: null,
    desc: null,
    label: null,
    everyoneLimit: null,
    couponCount: null,
    minConsume: null,
    couponWay: null,
    couponType1: null,
    couponType2: null,
    expireType: null,
    validateDay: null,
    beginTime: null,
    endTime: null,
    useType: null,
    cid: null,
    oid: null,
    enable: true,
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null
  };

  export default {
    name: 'OrgCoupon',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    cruds() {
      return CRUD({
        title: '优惠券',
        url: 'api/orgCoupon',
        sort: 'id,desc',
        crudMethod: {...crudOrgCoupon}
      })
    },
    data() {
      return {

        courseCop: [],

        permission: {
          add: ['admin', 'org:coupon:add'],
          edit: ['admin', 'org:coupon:edit'],
          del: ['admin', 'org:coupon:del']
        },
        rules: {},
        queryTypeOptions: [
          /* {
             key: 'title',
             display_name: '优惠券名称'
           },
           {
             key: 'useType',
             display_name: '使用范围：-1全场商品；1:指定商品'
           },
           {
             key: 'cid',
             display_name: '商品的ID'
           },
           {
             key: 'oid',
             display_name: '机构ID'
           }*/
        ],
        disableCommon: false,
      }
    },
    methods: {

      translateDate,
      translateTime,


      availableCourseList() {

        crudOrgCoupon.availableCourseList().then((data) => {

          this.disableCommon = !!data.common;

          this.courseCop = data.courseCop;


        }).catch((error) => {

          console.error("后台调用出错：", error);

        });


      },

      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query;
        if (query.type && query.value) {
          this.crud.params[query.type] = query.value
        }
        return true
      },


      //新建
      [CRUD.HOOK.beforeToAdd]() {

        this.availableCourseList();

        return true;
      },


      //编辑前
      [CRUD.HOOK.beforeToEdit](crud, form) {
        this.availableCourseList();

      },


      [CRUD.HOOK.beforeSubmit](crud, form) {


        if (this.form.useType === -1) {
          this.form.cid = null;
        } else if (this.form.useType === 1 && this.form.cid === null) {

          this.$message("请选择课程后再提交哦");
          return false;

        }

        if (!this.form.couponWay) {
          this.$message("请选择一种优惠方式");
          return false;
        }

        if (!this.form.useType) {
          this.$message("请选择一种使用范围");
          return false;
        }


        if (this.form.couponWay === 1) {

          this.form.couponType2 = null;
          if (!this.form.couponType1) {
            this.$message("请设置优惠金额再提交哦");
            return false;
          }

        } else if (this.form.couponWay === 2) {

          this.form.couponType1 = null;

          if (!this.form.couponType2) {
            this.$message("请设置优惠折扣再提交哦");
            return false;
          }

        }

        return true;


      },


    }
  }
</script>

<style scoped>

</style>
