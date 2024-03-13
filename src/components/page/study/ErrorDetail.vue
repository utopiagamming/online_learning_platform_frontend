<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i>学习管理</el-breadcrumb-item>
        <el-breadcrumb-item>错误情况</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="userId" label="用户ID" width="100"></el-table-column>
        <el-table-column prop="titleName" label="习题内容" width="350"></el-table-column>
        <el-table-column prop="titleStatus" label="习题类型" width="100">
          <template slot-scope="scope">
            {{ scope.row.titleStatus === 0 ? '选择题' : (scope.row.titleStatus === 1 ? '填空题' : '问答题') }}
          </template>
        </el-table-column>
        <el-table-column prop="sectionName" label="习题所属章节"></el-table-column>
        <el-table-column prop="answerAccount" label="作答次数"></el-table-column>
        <el-table-column prop="correctAccount" label="正确次数"></el-table-column>
        <el-table-column prop="correctPercent" label="正确概率"></el-table-column>
      </el-table>
      <Page :total="total"
            show-total
            show-sizer
            :page-size-opts="[10, 20, 30, 40, 10000]"
            v-show="tableDataShow"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
            style="text-align: center; margin-top: 10px;"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorDetail",
  data() {
    return {
      //addMenuShow:false,
      tableData: [],
      currentNum: 1,
      pageSize: 10,
      startDate: '',
      total: 0,
      endDate: '',
      tableDataShow: false,
      form:{
        userId:'',
        titleName:'',
        titleStatus:'',
        sectionName:'',
        answerAccount:'',
        correctAccount:'',
        correctPercent:0,
      }
    }
  },
  methods:{
    setBeginTime(date) {
      //设置时间
      this.stratDate = date;
    },
    setEndTime(date) {
      //设置时间
      this.endDate = date;
    },
    changePage(page) {
      //设置页码
      this.currentNum = page;
      this.queryErrorPage();
    },
    changePageSize(pageSize) {
      //设置每页展示数量
      this.pageSize = pageSize;
      this.queryErrorPage();
    },
    queryErrorPage(){
      let params={
        currentNum: this.currentNum,
        pageSize: this.pageSize
      };
      this.axios
          .post('/zj/personalization/queryErrorPage.htm', params)
          .then(
              function (response) {
                this.tableData = response.data.result.list;
                this.total = response.data.result.count;
                this.tableDataShow = true;
              }.bind(this)
          )
          .catch(function (error) {
            console.log(error);
          });
    }
  },
  created() {
    this.queryErrorPage();
  }
}
</script>

<style scoped>

</style>