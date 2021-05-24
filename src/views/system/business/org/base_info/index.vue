<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;"
                  class="filter-item" @keyup.enter.native="crud.toQuery"/>
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name"
                     :value="item.key"/>
        </el-select>
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small"
                 label-width="80px">


          <el-form-item label="机构名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="机构LOGO">
            <el-input v-model="form.logo" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="联系人">
            <el-input v-model="form.linkName" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="联系电话">
            <el-input v-model="form.callPhone" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="教师数量">
            <el-input-number v-model="form.teacherCount" :min="1" :max="99999" label="请输入数字"/>
          </el-form-item>

          <el-form-item label="教授科目">

            <el-select v-model="form.teachItem" filterable allow-create placeholder="请选择">
              <el-option
                v-for="item in dict.teach_item" :key="item.id"
                :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>

          <el-form-item label="教授对象">
            <el-input v-model="form.teachObj"/>
          </el-form-item>


          <el-form-item label="员工人数">

            <el-select v-model="form.staffScope" filterable allow-create placeholder="请选择">
              <el-option
                v-for="item in dict.staff_scope" :key="item.id"
                :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>

          <el-form-item label="价格范围">
            <el-input v-model="form.priceRange" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="机构简介">
            <el-input :rows="3" v-model="form.desc" type="textarea" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="联系邮箱">
            <el-input v-model="form.email" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="会员等级">

            <el-select v-model="form.memberLevel" filterable allow-create placeholder="请选择">
              <el-option
                v-for="item in dict.member_level" :key="item.id"
                :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>

          <el-form-item label="成立日期">
            <el-date-picker v-model="form.foundDate" type="datetime" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="机构详情图">
            <el-input v-model="form.picture" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="视频展示">
            <el-input v-model="form.videoUrl" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="经纬度">
            <el-input v-model="form.lngLat" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="省代码">
            <el-input-number v-model="form.provinceCode" :min="1" :max="99999" label="请输入数字"/>
          </el-form-item>

          <el-form-item label="市代码">
            <el-input-number v-model="form.cityCode" :min="1" :max="99999" label="请输入数字"/>
          </el-form-item>

          <el-form-item label="镇区代码">
            <el-input-number v-model="form.countyCode" :min="1" :max="99999" label="请输入数字"/>
          </el-form-item>

          <el-form-item label="地址">
            <el-input v-model="form.locationDesc" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="排序">
            <el-input-number v-model="form.sort" :min="1" :max="99999" label="请输入数字"/>
          </el-form-item>

          <el-form-item label="是否有效">
            <el-radio v-model="form.enable" :label="true" border>启用</el-radio>
            <el-radio v-model="form.enable" :label="false" border>禁用</el-radio>
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

        <el-table-column type="selection" width="55"/>

        <el-table-column prop="name" label="机构名称"/>

        <el-table-column prop="logo" label="机构LOGO"/>

        <el-table-column prop="linkName" label="联系人"/>

        <el-table-column prop="callPhone" label="联系电话"/>

        <el-table-column prop="teacherCount" label="教师数量"/>

        <el-table-column prop="teachItem" label="教授科目">
          <template slot-scope="scope">
            {{ dict.label.teach_item[scope.row.teachItem] }}
          </template>
        </el-table-column>

        <el-table-column prop="teachObj" label="教授对象">
          <template slot-scope="scope">
            {{ dict.label.teach_item[scope.row.teachObj] }}
          </template>
        </el-table-column>


        <el-table-column prop="staffScope" label="员工人数">
          <template slot-scope="scope">
            {{ dict.label.staff_scope[scope.row.staffScope] }}
          </template>
        </el-table-column>

        <el-table-column prop="priceRange" label="价格范围"/>

        <el-table-column prop="desc" label="机构简介"/>

        <el-table-column prop="email" label="联系邮箱"/>

        <el-table-column prop="memberLevel" label="会员等级">
          <template slot-scope="scope">
            {{ dict.label.member_level[scope.row.memberLevel] }}
          </template>
        </el-table-column>

        <el-table-column prop="foundDate" label="成立日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.foundDate) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="picture" label="机构详情图"/>

        <el-table-column prop="videoUrl" label="视频展示"/>

        <el-table-column prop="lngLat" label="经纬度"/>

        <el-table-column prop="provinceCode" label="省代码"/>

        <el-table-column prop="cityCode" label="市代码"/>

        <el-table-column prop="countyCode" label="镇区代码"/>

        <el-table-column prop="locationDesc" label="地址"/>

        <el-table-column prop="sort" label="排序"/>

        <el-table-column prop="enable" label="是否有效">
          <template slot-scope="scope">
            <el-tag :type="scope.row.enable? 'success':'danger' " effect="plain">
              {{scope.row.enable? '是':'否'}}
            </el-tag>
          </template>
        </el-table-column>


        <!-- 操作按钮 -->
        <el-table-column v-permission="['admin','org:base_info:edit','org:base_info:del']" label="操作" width="150px"
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
  import crudOrgBaseInfo from '@/api/system/orgBaseInfo'
  import CRUD, {presenter, header, form, crud} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  const defaultForm = {
    id: null,
    name: null,
    logo: null,
    linkName: null,
    callPhone: null,
    teacherCount: null,
    teachItem: null,
    staffScope: null,
    priceRange: null,
    desc: null,
    email: null,
    memberLevel: null,
    foundDate: null,
    picture: null,
    videoUrl: null,
    lngLat: null,
    provinceCode: null,
    cityCode: null,
    countyCode: null,
    locationDesc: null,
    sort: null,
    enable: true,
    createBy: null,
    updateBy: null,
    createTime: null,
    updateTime: null,
    teachObj: null
  };

  export default {
    name: 'OrgBaseInfo',
    components: {pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(), header(), form(defaultForm), crud()],
    dicts: ['teach_item', 'staff_scope', 'member_level'],
    cruds() {
      return CRUD({
        title: '培训机构基本信息',
        url: 'api/orgBaseInfo',
        sort: 'id,desc',
        crudMethod: {...crudOrgBaseInfo}
      })
    },
    data() {
      return {
        permission: {
          add: ['admin', 'org:base_info:add'],
          edit: ['admin', 'org:base_info:edit'],
          del: ['admin', 'org:base_info:del']
        },
        rules: {
          id:
            [
              {required: true, message: '主键不能为空', trigger: 'blur'}
            ],
          name:
            [
              {required: true, message: '机构名称不能为空', trigger: 'blur'}
            ]
        },
        queryTypeOptions: [
          {
            key: 'name',
            display_name: '机构名称'
          },
          {
            key: 'linkName',
            display_name: '联系人'
          },
          {
            key: 'memberLevel',
            display_name: '会员等级'
          },
          {
            key: 'countyCode',
            display_name: '镇区代码'
          },
          {
            key: 'locationDesc',
            display_name: '地址'
          }
        ]
      }
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query;
        if (query.type && query.value) {
          this.crud.params[query.type] = query.value
        }
        return true
      }
    }
  }
</script>

<style scoped>

</style>
