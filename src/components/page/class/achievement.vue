<template>
  <div class="el-icon-searching" height="auto" width="99%">
    <div class="crumbs" style="margin-top: -10px;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i>成绩管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>成绩列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-row :gutter="20">
        <el-col :span="6"><el-input v-model="keyWords" placeholder="请输入内容" style="width: 300px"></el-input></el-col>
        <el-col :span="3"><el-input v-model="paperName" placeholder="试卷名称"></el-input></el-col>
        <el-col :span="3"><el-input v-model="userName" placeholder="学生姓名"></el-input></el-col>
        <el-col :span="3"><el-input v-model="className" placeholder="班级"></el-input></el-col>
        <el-col :span="3"><el-input v-model="difficulty" placeholder="难度"></el-input></el-col>
        <el-col :span="6" ><el-button type="primary" @click="queryPage">查询</el-button></el-col>
        <el-col :span="2" ><el-button @click="queryAchievement" style="margin-left: 1100px; margin-top: -600px;">成绩单导出</el-button></el-col>
    </el-row>

    <el-table
        :data="tableData"
        stripe
        style="width: 90%; margin-top: 20px;">
        <el-table-column prop="className" label="班级"></el-table-column>
        <el-table-column prop="userName" label="学生"></el-table-column>
        <el-table-column prop="paperName" label="试卷"></el-table-column>
        <el-table-column prop="fraction" label="考试成绩">
          <template slot-scope="{ row }">
            <span v-if="row.fraction">{{ row.fraction }}</span>
            <span v-else>该生尚未作答</span>
          </template>
        </el-table-column>
        <el-table-column prop="paperScore" label="试卷满分"></el-table-column>
        <el-table-column prop="difficulty" label="考试难度">
        </el-table-column>
    </el-table>

    <Page :total="total"
        show-total
        show-sizer
        :page-size-opts="[10, 20, 30, 40, 10000]"
        v-show="tableDataShow"
        @on-change="changePage"
        @on-page-size-change="changePageSize"
        style="margin-left: 400px; margin-top: 10px;"
    />

  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: "achievement",
  inject:['reload'],
  data() {
    return {
      tableData: [],
      currentNum: 1,
      pageSize: 10,
      paperName:'',
      userName:'',
      className:'',
      difficulty:'',
      keyWords:'',
      startDate: '',
      total: 0,
      tableDataShow: false,
      achievementShow:false,
      charts: '',
      opinionData: ["3", "2", "4", "4", "5"],
    }
  },
  //调用
  mounted() {
    this.$nextTick(function() {
      this.drawLine('main')
    })
  },
  methods: {

    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    queryAchievement(){
      let param = {
      };
      const form = document.createElement('form');
      form.id = 'form';
      form.name = 'form';
      document.body.appendChild(form);
      for (const obj in param) {
        if (param.hasOwnProperty(obj)) {
          const input = document.createElement('input');
          input.tpye = 'hidden';
          input.name = obj;
          input.value = param[obj];
          form.appendChild(input);
        }
      }
      form.method = 'GET'; //请求方式
      form.action = '/zj/paper/queryExport.htm';
      form.submit();
      document.body.removeChild(form);
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
    queryPage() {
      let params = {
        keyWords:this.keyWords,
        currentNum: this.currentNum,
        pageSize: this.pageSize,
        paperName:this.paperName,
        userName:this.userName,
        className:this.className,
        difficulty:this.difficulty
      };
      this.axios
          .post('/zj/paper/queryPage.htm', params)
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
    },
  },
  created() {
    this.queryPage()
  }
}
</script>

<style scoped>
#chart{
  text-align: left;
}
#chart-line,#chart-bar,#chart-pie {
  width: 100%;
  height: 300px;
}
.el-icon-searching{
  margin-top: 20px;
}
</style>