<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i>教学管理</el-breadcrumb-item>
        <el-breadcrumb-item>章节管理</el-breadcrumb-item>
      </el-breadcrumb>

      <el-select class="crumbs-selection" v-model="subjectId" placeholder="请选择科目">
        <el-option v-for="item in this.subjectList"
                   :key="item.subjectId"
                   :label="item.subjectName"
                   :value="item.subjectId">
        </el-option>
      </el-select>
      <el-button type="primary" @click="querySection">查询</el-button>
      <el-button type="primary" @click="dialogVisible = true" style="margin-left: 30%">新增章节</el-button>
    </div>

    <div>
      <el-table :data="tableData" stripe style="width: 62%">
<!--        <el-table-column prop="sectionId" label="ID" width="100"></el-table-column>-->
        <el-table-column prop="subjectName" label="科目名称" width="200"></el-table-column>
        <el-table-column prop="chapterName" label="章名称" width="200"></el-table-column>
        <el-table-column prop="sectionName" label="小节名称" width="300"></el-table-column>
        <el-table-column fixed="right" label="操作" >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteSub(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Page :total="total"
            show-total
            show-sizer
            :page-size-opts="[10, 20, 30, 40, 10000]"
            v-show="tableDataShow"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
            style="margin-left: 18%; margin-top: 10px;"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Section",
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
      // menuName:'',
      form:{
        id:'',
        chapterName:'',
        sectionName:'',
      },
      subjectId:1,
      subjectList:[]
    }
  },
  components:{
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
      this.queryPage();
    },
    changePageSize(pageSize) {
      //设置每页展示数量
      this.pageSize = pageSize;
      this.queryPage();
    },
    querySubjectList(){
      this.axios
          .post('/zj/sub/queryListBySub.htm')
          .then(
              function (response) {
                this.subjectList = response.data.result;
              }.bind(this)
          )
          .catch(function (error) {
            console.log(error);
          });
    },
    querySection(){
      let params={
        // currentNum: this.currentNum,
        // pageSize: this.pageSize,

        currentNum: this.currentNum,
        pageSize: this.pageSize,
        subjectId:this.subjectId,
      };
      this.axios
          .post('/zj/sub/getAllSectionsBySubject.htm', params)
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
    this.querySubjectList();
    this.querySection();
  }
}
</script>

<style scoped>
  .crumbs-selection{
    margin-top: 20px;
  }
</style>