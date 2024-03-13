<template>
  <div style="width: 99%">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i>考试管理</el-breadcrumb-item>
        <el-breadcrumb-item>试卷管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--按钮栏-->
    <el-row :gutter="20" style="margin-top: -30px;">
      <el-col :span="2" style="margin-left: 60%"><el-button @click="collBackPaperPage">返回试卷</el-button></el-col>
      <el-col :span="3"><el-button @click="handleEdit">随机组卷</el-button></el-col>
<!--      <el-col :span="3"><el-button size="mini" @click="createPersonalRecommendationPaper">个性化组卷</el-button></el-col>-->
      <!--点进单张试卷后出现的两个按钮-->
      <el-col :span="2"><el-button style="margin-left: -70px;" @click="updateTitle(dataList)" v-show="examShow">提交修改</el-button></el-col>
      <el-col :span="2"><el-button style="margin-left: -50px;" type="primary" @click="PrintRow"  v-show="examShow">打 印</el-button></el-col>
    </el-row>

    <!--试卷表格展示：dataShow-->
    <div v-show="dataShow">
      <el-table :data="tableData" border stripe style="width: 94%; margin-top: 10px;">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="paperName" label="试卷名称" width="200"></el-table-column>
        <el-table-column prop="subjectName" label="考试科目" width="120"></el-table-column>
        <el-table-column prop="className" label="班级" width="150">
          <template slot-scope="scope">
            <span v-if="!scope.row.className">该试卷为学生个性化拥有</span>
            <span v-else>{{ scope.row.className }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paperDate" label="考试日期" width="110"></el-table-column>
        <el-table-column prop="examDate" label="考试时间" width="90"></el-table-column>
        <el-table-column prop="paperScore" label="题目总分" width="80"></el-table-column>
        <el-table-column prop="teachName" label="组卷教师" width="90">
          <template slot-scope="scope">
            <span v-if="!scope.row.className">该试卷为学生自主生成</span>
            <span v-else>{{ scope.row.className }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" @click="queryPaper(scope.row)">查看试卷</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            <el-button size="mini" @click="exportPaper(scope.row.paperId)">试卷导出</el-button>
<!--            <button v-print="'#printMe'">Print local range</button>-->
          </template>
        </el-table-column>
      </el-table>
      <Page
          :total="total"
          show-total
          show-sizer
          :page-size-opts="[10, 20, 30, 40, 10000]"
          v-show="tableDataShow"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          style="margin-left: 380px; margin-top: 10px;"
      />
    </div>

    <!--组卷弹窗：formShow-->
    <div class="formClass" v-show="formShow" >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="试卷名称：">
          <el-input type="textarea" v-model="form.titleName" style="width: 20%"></el-input>
        </el-form-item>
        <el-form-item label="试卷科目：">
          <el-select v-model="form.subjectId" clearable placeholder="请选择科目">
            <el-option v-for="(item, index) in this.subjectList" :label="item.subjectName"  :value="item.subjectId" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试班级：">
          <el-select v-model="form.classId" clearable placeholder="请选择班级">
            <el-option v-for="(item, index) in this.classList" :label="item.className" :value="item.classId"  :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="难度系数：">
          <el-col :span="2">
            <el-input v-model="form.titleType"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="考试日期">
          <el-col :span="3.5">
            <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd"  v-model="form.date1"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="考试时间">
          <el-input v-model="form.examDate" style="width: 10%" value-format="HH-mm-ss"></el-input>分钟
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">开始组卷</el-button>
          <el-button @click="paperCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--单张试卷查看：examShow-->
    <div id="printMe" ref="print" class="home" >
      <el-card class="card-box" v-for="item of dataList" :key="item.id" v-show="examShow">
        <!-- 单选 1    填空2    主观3 -->
        <div>
          <div class="item-title"  v-for="(item2, index2) of item.list" :key="index2">
            <div class="title">
              {{ index2 + 1 }}.{{ item2.titleName }}{{ item2.titleFraction }}分
            </div>
            <div class="item-box" v-if="item2.type === 1">
              <el-radio-group v-model="item2.answer">
                <el-radio :label="item2.choice1"></el-radio>
                <el-radio :label="item2.choice2"></el-radio>
                <el-radio :label="item2.choice3"></el-radio>
                <el-radio :label="item2.choice4"></el-radio>
              </el-radio-group>
            </div>
            <div class="item-box" v-if="item2.type === 2">
              <el-checkbox-group v-model="item2.answer">
                <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="item2.answer"></el-input>
              </el-checkbox-group>
            </div>
            <div class="content-box1" v-if="item.type === 3">
              <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="item2.answer"></el-input>
            </div>
          </div>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
import { Loading } from 'element-ui';
import printPaper from "./printPaper";
import vueEasyPrint from "vue-easy-print";

export default {
  inject: ['reload'],
  data() {
    return {
      tabledata:[],
      tableData: [],
      currentNum: 1,
      pageSize: 10,
      total: 43,
      tableDataShow: false,
      subjectList: [],
      classList: [],
      dataShow: true,
      formShow: false,
      examShow: false,
      form: {
        date2: '',
        date1: '',
        num: 15,
        classId: '',
        subjectId: '',
        titleType: '',
        titleName: '',
        examDate: '',
        paperNum: ''
      },
      dataList: [],
    };
  },
  components: { vueEasyPrint,printPaper },

  methods: {
    PrintRow(index, row){
      this.$print(this.$refs.print) // 使用
    },

    updateTitle(dataList){
      let jsonArr = [];
      let newArr = dataList.filter((item, i) => {
        console.log("循环==i==", item);
        let listArr = item.list.filter((list,i)=>{
          let obj = {};
          obj.id = list.id;
          obj.answer = list.answer;
          jsonArr.push(JSON.stringify(obj))
        })
      })
      let params = {
        titleString:jsonArr,
      };
      this.axios
          .post('/zj/title/updateTitleByList.htm', params)
          .then(
              function (response) {
                if (response.data.code == '0000') {
                  this.$message.success('提交成功');
                  this.reload();
                } else {
                  this.$message.error('提交失败');
                }
              }.bind(this))
          .catch(function (error) {
            console.log(error);
          });
    },

    checkForm() {
      let all = [];
      this.dataList.map((x) => {``
        x.list &&
        x.list.map((y) => {
          all.push({ id: y.id, val: y.val });
        });
      });
      this.$emit('updateTitle', all);
    },

    endLoading() {    //使用Element loading-close 方法
      let loadingInstance = Loading.service();
      this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
        loadingInstance.close();
      });
    },

    onSubmit() {
      let params = {
        paperName: this.form.titleName,
        subjectId: this.form.subjectId,
        difficulty: this.form.titleType,
        classId: this.form.classId,
        titleStatus: this.form.titleStatus,
        titleAnswer: this.form.titleAnswer,
        paperDate: this.form.date1,
        examDate: this.form.examDate,
        paperNum: this.form.paperNum
      };
      Loading.service();
      this.axios
          .post('/zj/title/audioExam.htm', params)
          .then(
              function (response) {
                if (response.data.code == '0000') {
                  this.$message.success('组卷成功,请点击返回试卷然后查看');
                  this.formShow = false;
                  this.examShow = true;
                  this.endLoading();
                } else {
                  this.$message.error(response.data.description);
                  this.endLoading();
                }
              }.bind(this)
          )
          .catch(function (error) {
            this.endLoading();
            console.log(error);
          });
    },

    collBackPaperPage() {
      this.dataShow = true;
      this.formShow = false;
      this.examShow = false;
      this.queryPaperPage();
      this.reload();
    },

    changePage(page) {
      //设置页码
      this.currentNum = page;
      this.queryPaperPage();
    },

    changePageSize(pageSize) {
      //设置每页展示数量
      this.pageSize = pageSize;
      this.queryPaperPage();
    },

    handleChange(value) {
      console.log(value);
    },

    paperCancel(row) {
      this.dataShow = true;
      this.formShow = false;
      this.examShow = false;
    },
    handleEdit() {
      this.dataShow = false;
      this.formShow = true;
      this.examShow = false;
    },

    exportPaper(paperId){
      let param = {
        paperId:paperId
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
      form.action = '/zj/paper/paperExport.htm';
      form.submit();
      document.body.removeChild(form);
    },

    handleDelete(row) {
      let params = {
        paperId: row.paperId
      };
      this.axios
          .post('/zj/paper/deletePaper.htm', params)
          .then(
              function (response) {
                if (response.data.code == "0000") {
                  this.$message.success("删除成功");
                  this.reload();
                } else {
                  this.$message.error("删除失败");
                }
              }.bind(this)
          )
          .catch(function (error) {
            console.log(error);
          });
    },

    queryPaperPage() {
      let params = {
        currentNum: this.currentNum,
        pageSize: this.pageSize
      };
      this.axios
          .post('/zj/title/queryPaperPage.htm', params)
          .then(
              function (response) {
                this.tableData = response.data.result.list;
                // this.total = response.data.result.count;
                this.tableDataShow = true;
              }.bind(this)
          )
          .catch(function (error) {
            console.log(error);
          });
    },

    queryPaper(row) {
      let params = {
        paperId: row.paperId
      };
      this.axios
          .post('/zj/title/queryPaper.htm', params)
          .then(
              function (response) {
                if (response.data.code == '0000') {
                  this.formShow = false;
                  this.dataShow = false;
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
                  console.log(this.dataList);
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
    querySubjectList() {
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
    queryClassList() {
      this.axios
          .post('/zj/class/queryList.htm')
          .then(
              function (response) {
                this.classList = response.data.result;
              }.bind(this)
          )
          .catch(function (error) {
            console.log(error);
          });
    },
    createPersonalRecommendationPaper(){
      this.axios
          .post('/zj/personalization/createPersonalRecommendationPaper.htm')
          .then()
          .catch(function (error){
            console.log(error);
          });
    }
  },
  created() {
    this.querySubjectList();
    this.queryClassList();
    this.queryPaperPage();
  }
};
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
    /*  display: flex;*/
    /*width: 100%;*/
    /*align-items: center;*/
    /* height: 40px;*/
    /* .label {*/
    /*  width: 20px;*/
    /* }*/
    /*  .value {*/
    /*  flex: 1;*/
    /*  }*/
  }
  .content-box1 {
    margin-bottom: 30px;
  }
}
</style>