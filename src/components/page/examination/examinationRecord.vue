<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i>考试管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>考试记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-col  style="margin-left: 300%">
          <el-button class="button1" @click="callBackPaperPage">返回试卷记录</el-button>
          <el-button class="button2" @click="callPersonalization">个性化组卷</el-button>
        </el-col>
      </el-col>
    </el-row>

    <el-table
        class="contentTable"
        :data="tableData"
        height="50%"
        v-show="dataShow"
        border
        stripe
        style="width: 100%">
        <el-table-column prop="paperName" label="试卷名称"></el-table-column>
        <el-table-column prop="userName" label="学生姓名"></el-table-column>
        <el-table-column prop="paperScore" label="试卷总分"></el-table-column>
        <el-table-column prop="fraction" label="试卷得分"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="queryPaper(scope)">查看试卷</el-button>
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
          style="text-align: center; margin-top: 10px;"
    />

    <div class="home">
      <el-card class="card-box" v-for="item of dataList" :key="item.id" v-show="examShow">
        <!-- 单选 1    填空2    主观3 -->
        <div>
          <div class="item-title"  v-for="(item2, index2) of item.list" :key="index2">

            <div class="title">
              {{ index2 + 1 }}.{{ item2.titleName }}&nbsp&nbsp{{ item2.titleFraction }}分</div>
            <div class="content-box1" v-if="item.type === 3">
              <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="item2.answer"></el-input>
              <br >
              <p style="color:red">
                学生答案 ： {{item2.studentAnswers}}
              </p>
            </div>
            <div class="item-box" v-if="item2.type === 1">
              <el-radio-group v-model="item2.answer">
                <el-radio :label="item2.choice1"></el-radio>
                <el-radio :label="item2.choice2"></el-radio>
                <el-radio :label="item2.choice3"></el-radio>
                <el-radio :label="item2.choice4"></el-radio>
              </el-radio-group>
              <br >
              <p style="color:red">
                学生答案 ： {{item2.studentAnswers}}
              </p>
            </div>
            <div class="item-box" v-if="item2.type === 2">
              <el-checkbox-group v-model="item2.answer">
                <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="item2.answer"></el-input>
              </el-checkbox-group>
              <br >
              <p style="color:red">
                学生答案 ： {{item2.studentAnswers}}
              </p>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <div v-show="formShow">
      <el-table :data="personForm" stripe style="width: 100%">
        <el-table-column prop="userId" label="用户ID" width="200"></el-table-column>
        <el-table-column prop="sectionName" label="小节名称" width="200"></el-table-column>
        <el-table-column prop="commandDegree" label="掌握程度（系数）" width="300"></el-table-column>
      </el-table>
      <el-button type="primary" @click="createPersonalRecommendationPaper()">确定生成</el-button>
    </div>

  </div>
</template>

<script>

export default {
  name: "examinationRecord",
  inject:['reload'],
  data(){
    return{
      tableData: [],
      currentNum: 1,
      pageSize: 10,
      startDate: '',
      total: 0,
      tableDataShow: false,
      examShow:false,
      dataShow:false,
      form:{
        subjectName: ''
      },
      dialogVisible: false,
      dataList: [],
      formShow:false,
      personForm:[],
      form2:{
        userId:'',
        sectionName:'',
        commandDegree:0.0
      }
    }
  },
  methods: {
    showPersonalization(){
      this.axios
          .post('/zj/personalization/showPersonalization.htm')
          .then(
              function (response){
                this.personForm=response.data.result;
                console.log("personForm: ",this.personForm);
              }.bind(this)
          )
          .catch(function (error) {
            console.log(error);
          });
    },
    callPersonalization(){
      this.dataShow=false;
      this.tableDataShow = false;
      this.formShow=true;
      this.showPersonalization();
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    handleClick(row) {
      console.log(row);
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
    callBackPaperPage() {
      this.dataShow = true;
      this.examShow = false;
      this.queryPage();
      this.reload();
    },
    queryPage() {
      let params = {
        currentNum: this.currentNum,
        pageSize: this.pageSize,
        menuName: this.menuName,
      };
      this.axios
          .post('/zj/title/queryPaperByUserId.htm', params)
          .then(
              function (response) {
                this.tableData = response.data.result.list;
                this.total = response.data.result.count;
                this.tableDataShow = true;
                this.dataShow=true;
              }.bind(this)
          )
          .catch(function (error) {
            console.log(error);
          });
    },
    queryPaper(row) {
      let params = {
        paperId: row.row.paperId
      };
      this.axios
          .post('/zj/title/queryPaperCompleted.htm', params)
          .then(
              function (response) {
                if (response.data.code == '0000') {
                  this.tableDataShow = false;
                  this.dataShow=false;
                  this.examShow = true;
                  this.dataList.push({
                    list: this.changeArray(response.data.result.oneList1, 1, 'type'),

                  });
                  this.dataList.push({
                    list: this.changeArray(response.data.result.oneList2, 2, 'type'),
                  });
                  this.dataList.push({
                    list: this.changeArray(response.data.result.oneList3, 2, 'type'),
                  });

                } else {
                  this.$message({message: '该试卷错误', type: 'error'});
                }
              }.bind(this)
          )
          .catch(function (error) {
            console.log(error);
          });
    },
    changeArray(one, val, name) {
      one.map((x) => {
        x[name] = val;
        x['val'] = '';
      });
      return one;
    },
    createPersonalRecommendationPaper(){
      this.axios
          .post('/zj/personalization/createPersonalRecommendationPaper.htm')
          .then(
              function (response){
                if(response.data.code==='0000'){
                  this.$message.success('生成成功');
                } else {
                  this.$message.error('生成失败');
                }
              }.bind(this)
          )
          .catch(function (error){
            console.log(error);
          });
    },
  },
  created() {
    this.queryPage()
  }
}
</script>

<style scoped lang='scss'>
 .home {
   min-width: 600px;
   overflow-x: auto;
 }
 .card-box {
   margin: 10px;

   .type-title {
     font-size: 16px;
     font-weight: bold;
     margin-bottom: 10px;

     .item-title {
       display: flex;
     }
   }

   .title {
     margin: 10px 0;
   }

   .item-box {
   }

   .content-box1 {
     margin-bottom: 30px;
   }
 }

 .button2{
   margin-left: 20px;
 }

 .contentTable{
   margin-top: 30px;
 }

</style>
