<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="900px">


        <el-form ref="form" :model="form" :rules="rules" size="small"
                 label-width="100px">

          <el-row>
            <el-col :span="12">
              <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" style="width: 300px;" placeholder="必填，50字以内"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="课程图片">
                <el-input v-model="form.banner" style="width: 300px;"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>

            <el-col :span="12">
              <el-form-item label="授课方式" prop="teachWay">

                <el-select v-model="form.teachWay" filterable allow-create placeholder="请选择" style="width: 300px;">
                  <el-option
                    v-for="item in dict.teach_way" :key="item.id"
                    :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="授课地点" prop="teachSite">

                <el-select v-model="form.teachSite" filterable allow-create placeholder="请选择" style="width: 300px;">
                  <el-option
                    v-for="item in dict.teach_site" :key="item.id"
                    :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>


          <el-row>

            <el-col :span="12">

              <el-form-item label="授课对象" prop="teachObj">

                <el-select v-model="form.teachObj" filterable allow-create placeholder="请选择" style="width: 300px;">
                  <el-option
                    v-for="item in dict.teach_obj" :key="item.id"
                    :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>

            </el-col>
            <el-col :span="12">

              <el-form-item label="福利" prop="teachBoon">

                <el-select v-model="form.teachBoon" filterable allow-create placeholder="请设置" style="width: 300px;">
                  <el-option
                    v-for="item in dict.teach_boon" :key="item.id"
                    :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row>

            <el-col :span="12">
              <el-form-item label="可报名人数"> <!-- (-1:不限) -->
                <el-input prefix-icon="el-icon-user" v-model="form.studentLimit" :min="0" :max="99999"
                          placeholder="最多可报名人数，请输入数字"
                          style="width: 300px;"/>
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="已报名人数">
                <el-input prefix-icon="el-icon-user" v-model="form.destineCount" :min="0" :max="99999"
                          placeholder="请输入数字"
                          style="width: 300px;"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>

            <el-col :span="12">
              <el-form-item label="实际上课人数">
                <el-input prefix-icon="el-icon-user" v-model="form.factCount" :min="0" :max="99999" placeholder="请输入数字"
                          style="width: 300px;"/>
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="单价">
                <el-input prefix-icon="el-icon-money" v-model="form.unitPrice" :min="0" :max="99999" placeholder="请输入数字"
                          style="width: 300px;"/>
              </el-form-item>

            </el-col>
          </el-row>


          <el-row>

            <el-col :span="12">

              <el-form-item label="总节数">
                <el-input prefix-icon="el-icon-coin" v-model="form.setCount" :min="0" :max="99999" placeholder="请输入数字"
                          style="width: 300px;"/>
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="总价">
                <el-input prefix-icon="el-icon-money" v-model="form.price" :min="0" :max="99999" placeholder="请输入数字"
                          style="width: 300px;"/>
              </el-form-item>

            </el-col>
          </el-row>


          <el-row>
            <el-col :span="12">
              <el-form-item label="开始报名时间">
                <el-date-picker v-model="form.enterStartDay" style="width: 300px;" placeholder="请选择日期"/>
              </el-form-item>

            </el-col>

            <el-col :span="12">

              <el-form-item label="结束报名时间">
                <el-date-picker v-model="form.enterEndDay" style="width: 300px;" placeholder="请选择日期"/>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row>
            <el-col :span="12">
              <el-form-item label="上课时间段">
                <el-input v-model="form.attendTime" style="width: 300px;" placeholder="如18:00-21:00"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">

              <el-form-item label="开课时间">
                <el-date-picker v-model="form.startTime" style="width: 300px;"/>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="完课日期">
                <el-date-picker v-model="form.endTime" style="width: 300px;"/>
              </el-form-item>

            </el-col>


            <el-col :span="12">
              <el-form-item label="课程状态">

                <el-radio-group v-model="form.productStatus" style="width:300px">
                  <el-radio v-for="item in dict.product_status" :label="item.value">{{item.label}}</el-radio>
                </el-radio-group>

              </el-form-item>
            </el-col>


          </el-row>

          <el-row>

            <el-col :span="23">
              <el-form-item label="课程描述">
                <el-input :rows="4" v-model="form.desc" type="textarea" placeholder="选填，500字以内"/>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">

        <el-table-column prop="xxx" label="信息1" width="250px">
          <template slot-scope="{row}">
            <h2 :class=" parseInt(row.productStatus)!==1? 'productOff':'' "> {{row.title}}</h2>
            <p>
              <el-tag :type=" parseInt(row.productStatus)===1 ? 'success':'info' ">
                {{dict.label.product_status[row.productStatus] }}
              </el-tag>
            </p>

            <p> 授课方式：{{ dict.label.teach_way[row.teachWay] }} </p>
            <p> 授课地点： {{ dict.label.teach_site[row.teachSite] }} </p>
            <p> 授课对象： {{ dict.label.teach_obj[row.teachObj] }} </p>
            <p> 福利：{{ dict.label.teach_boon[row.teachBoon] }} </p>
          </template>
        </el-table-column>


        <el-table-column prop="banner" label="课程主图">
          <template slot-scope="{row}">

            <el-image
              :src="fileRefUrl + row.banner"
              :preview-src-list="[fileRefUrl + row.banner ]"
              fit="contain"
              lazy
            >
              <div slot="error">
                <i class="el-icon-document"/>
              </div>
            </el-image>

          </template>

        </el-table-column>

        <el-table-column prop="detailImgs" label="课程详情图">
          <template slot-scope="{row}">

            <el-tooltip :content="imageLength(row.detailImgs)" placement="top" effect="light">
              <el-image
                :src="firstImageUrl(row.detailImgs)"
                :preview-src-list="picArr(row.detailImgs)"
                fit="contain"
                lazy
              >
                <div slot="error">
                  <i class="el-icon-document"/>
                </div>
              </el-image>
            </el-tooltip>
          </template>

        </el-table-column>


        <el-table-column prop="desc" label="描述">
          <template slot-scope="{row}">
            <p v-if="row.desc && row.desc.length>100">
              <el-popover
                placement="top-start"
                trigger="hover" width="400" offset="40"
                :content="row.desc">
                <span slot="reference">{{row.desc.substring(0,100)}}...</span>
              </el-popover>
            </p>

            <p v-else>{{row.desc}}</p>
          </template>
        </el-table-column>


        <el-table-column prop="xxx" label="信息2">
          <template slot-scope="{row}">

            <p> 最多可报名人数：{{ row.studentLimit }} </p>
            <p> 已报名人数：{{ row.destineCount }} </p>
            <p> 实际上课人数：{{ row.factCount }} </p>

          </template>
        </el-table-column>

        <el-table-column prop="yyy" label="信息3">
          <template slot-scope="{row}">

            <p> 单价：{{ row.unitPrice }}元/节 </p>
            <p> 总节数：{{ row.setCount }} 节</p>
            <p> 总价：
              <svg-icon icon-class="money"/>
              {{ row.price }} 元
            </p>
          </template>
        </el-table-column>


        <el-table-column prop="zzz" label="信息4">
          <template slot-scope="{row}">

            <p> 报名时间：{{ translateDate(row.enterStartDay) }} - {{ translateDate(row.enterEndDay) }} </p>
            <p> 开课与结课时间：{{ translateDate(row.startTime) }} - {{ translateDate(row.endTime) }} </p>
            <p> 上课时间段：{{row.attendTime}} </p>

          </template>
        </el-table-column>


        <!-- 操作按钮 -->
        <el-table-column v-permission="['admin','org:course_item:edit','org:course_item:del']" label="操作" width="150px"
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
  import crudOrgCourseItem from '@/api/system/orgCourseItem'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import {mapGetters} from "vuex";
  import {translateDate} from "@/utils/index";

  const defaultForm = {
    id: null,
    title: null,
    banner: null,
    desc: null,
    teachWay: null,
    teachSite: null,
    teachObj: null,
    teachBoon: null,
    studentLimit: null,
    destineCount: null,
    factCount: null,
    unitPrice: null,
    price: null,
    setCount: null,
    startTime: null,
    attendTime: null,
    endTime: null,
    productStatus: '1', //默认上架
    remark: null,
    sort: null,
    enable: true,
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null,
    enterStartDay: null,
    enterEndDay: null
  };

  export default {
    name: 'OrgCourseItem',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    dicts: ['teach_way', 'teach_site', 'teach_obj', 'teach_boon', 'product_status'],
    cruds() {
      return CRUD({
        title: '机构产品服务',
        url: 'api/orgCourseItem',
        sort: 'id,desc',
        crudMethod: {...crudOrgCourseItem}
      })
    },
    computed: {
      ...mapGetters([
        'baseApi',
        'fileRefUrl',
      ])
    },


    data() {
      return {
        permission: {
          add: ['admin', 'org:course_item:add'],
          edit: ['admin', 'org:course_item:edit'],
          del: ['admin', 'org:course_item:del']
        },
        rules: {

          title:
            [
              {required: true, message: '标题不能为空', trigger: 'blur'}
            ],


          teachWay:
            [
              {required: true, message: '授课方式不能为空', trigger: 'blur'}
            ],
          teachSite:
            [
              {required: true, message: '授课地点不能为空', trigger: 'blur'}
            ],
          teachObj:
            [
              {required: true, message: '授课对象不能为空', trigger: 'blur'}
            ],
          teachBoon:
            [
              {required: true, message: '福利不能为空', trigger: 'blur'}
            ]
        }
      }
    },
    methods: {

      translateDate,
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        return true
      },

      picArr(imgUrls) {

        return imgUrls.trim().split(",").map((item) => {
          return this.fileRefUrl + item.trim();

        });

      },
      firstImageUrl(imgUrls) {

        return this.picArr(imgUrls)[0];

      },

      imageLength(imgUrls) {


        var cc = this.picArr(imgUrls).length;
        if (cc === 0) {
          return "无图片"
        } else {
          return "共" + cc + "张";
        }

      }


    }
  }
</script>

<style scoped>

  .productOff {
    text-decoration: line-through
  }
</style>
