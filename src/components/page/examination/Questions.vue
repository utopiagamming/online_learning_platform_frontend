<template>
    <div class="wrapper" style="height: auto">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-calendar"></i>考试管理
          </el-breadcrumb-item>
          <el-breadcrumb-item>习题管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

        <el-row :gutter="20">
            <el-col :span="3"><el-input v-model="keywords" placeholder="请输入内容"></el-input></el-col>
          <el-col :span="3"><el-input v-model="titleName" placeholder="题目"></el-input></el-col>
          <el-col :span="3"><el-input v-model="subjectName" placeholder="科目"></el-input></el-col>
          <el-col :span="3"><el-input v-model="className" placeholder="班级"></el-input></el-col>
          <el-col :span="3"><el-input v-model="titleFraction" placeholder="分数"></el-input></el-col>
          <el-col :span="3"><el-input v-model="titleType" placeholder="难度"></el-input></el-col>
          <el-col :span="3" ><el-button type="primary" @click="queryPage">查询</el-button></el-col>
          <el-col :span="3" ><el-button style="margin-left: -70px;" type="primary" @click="dialogVisible = true">新增试题</el-button></el-col>
        </el-row>

        <el-table
                :data="tableData"
                border
                stripe
                style="width: 90%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="titleName" label="题目" width="280"></el-table-column>
            <el-table-column prop="subjectName" label="科目" width="130"></el-table-column>
            <el-table-column prop="titleFraction" label="分值" style="width: 50px;"></el-table-column>
            <el-table-column prop="titleStatus" label="题目类型" :formatter="sfktFormate"></el-table-column>
            <el-table-column prop="titleType" label="难度系数" style="width: 150px;"></el-table-column>
            <el-table-column prop="titleAnswer" label="答案" width="180"></el-table-column>
            <el-table-column prop="createTime" label="时间" width="160"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row.titleId)" type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteClick(scope.row.titleId)" >删除</el-button>
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
              style="margin-left: 400px; margin-top: 10px;"
        />

        <!--新增题目弹窗-->
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="科目：">
                    <el-col :span="11">
                        <el-select v-model="form.subjectId" clearable placeholder="请选择科目">
                            <el-option
                                    v-for="item in this.subjectList"
                                    :key="item.subjectId"
                                    :label="item.subjectName"
                                    :value="item.subjectId">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col class="line" :span="2"></el-col>
                    <el-col :span="11">
                        <el-form-item label="分值：">
                            <el-input v-model="form.titleFraction"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="题型：">
                    <el-col :span="11">
                        <el-select v-model="form.titleStatus" clearable placeholder="请选择题型">
                            <el-option label="单选题" :value='0'></el-option>
                            <el-option label="填空题" :value='1'></el-option>
                            <el-option label="主观题" :value='2'></el-option>
                        </el-select>
                    </el-col>
                    <el-col class="line" :span="2"></el-col>
                    <el-col :span="11">
                        <el-form-item label="难度：">
                            <el-input v-model="form.titleType"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="题目：">
                    <el-input v-model="form.titleName"></el-input>
                </el-form-item>
                <el-row v-show="number===2">
                    <el-form-item label="答案：">
                        <el-input type="textarea" v-model="form.answer"></el-input>
                    </el-form-item>
                </el-row>
                <el-row v-show="number===0">
                    <el-form-item label="答案：">
                        <el-input  v-model="form.answer"></el-input>
                    </el-form-item>
                    <el-form-item label="选项A：">
                        <el-input v-model="form.choice1"></el-input>
                    </el-form-item>
                    <el-form-item label="选项B：">
                        <el-input v-model="form.choice2"></el-input>
                    </el-form-item>
                    <el-form-item label="选项C：">
                        <el-input v-model="form.choice3"></el-input>
                    </el-form-item>
                    <el-form-item label="选项D：">
                        <el-input v-model="form.choice4"></el-input>
                    </el-form-item>
                </el-row>
                <el-row v-show="number===1">
                    <el-form-item label="答案：">
                        <el-input  v-model="form.answer"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="insertQuestions">确 定</el-button>
            </span>
        </el-dialog>

        <!--修改题目弹窗-->
        <el-dialog
                title="提示"
                :visible.sync="dialogUpdate"
                width="30%"
                :before-close="handleCloseUpdate">
            <el-form ref="form" :model="title" :rules="rules"  label-width="80px">
                <el-form-item label="科目：" prop="subjectId">
                    <el-col :span="11">
                        <el-select v-model="title.subjectId" clearable placeholder="请选择科目">
                            <el-option
                                    v-for="item in this.subjectList"
                                    :key="item.subjectId"
                                    :label="item.subjectName"
                                    :value="item.subjectId">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col class="line" :span="2"></el-col>
                    <el-col :span="11">
                        <el-form-item label="分值：" prop="titleFraction">
                            <el-input v-model="title.titleFraction"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="题型：" prop="titleStatus" >
                    <el-col :span="11">
                        <el-select v-model="title.titleStatus" disabled  clearable placeholder="请选择题目类型">
                            <el-option label="单选题" :value='0'></el-option>
                            <el-option label="填空题" :value='1'></el-option>
                            <el-option label="主观题" :value='2'></el-option>
                        </el-select>
                    </el-col>
                    <el-col class="line" :span="2"></el-col>
                    <el-col :span="11">
                        <el-form-item label="难度："  prop="titleType">
                            <el-input v-model="title.titleType"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="题目：" prop="titleName">
                    <el-input v-model="title.titleName"></el-input>
                </el-form-item>
                <el-form-item label="答案："  prop="titleAnswer">
                    <el-input type="textarea" v-model="title.titleAnswer"></el-input>
                </el-form-item>

                <el-row v-show="title.titleStatus===0" >
                    <el-form-item label="选项A：" prop="choice1">
                        <el-input v-model="title.choice1"></el-input>
                    </el-form-item>
                    <el-form-item label="选项B：" prop="choice2">
                        <el-input v-model="title.choice2"></el-input>
                    </el-form-item>
                    <el-form-item label="选项C：" prop="choice3">
                        <el-input v-model="title.choice3"></el-input>
                    </el-form-item>
                    <el-form-item label="选项D：" prop="choice1">
                        <el-input v-model="title.choice4"></el-input>
                    </el-form-item>
                </el-row>

            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogUpdate = false">取 消</el-button>
              <el-button type="primary" @click="updateQuestions()">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        inject:['reload'],
        data() {
            return {
              titleName:'',
              subjectName:'',
              className:'',
              titleType:'',
              titleFraction:'',
              classList:[],
                tableData: [],
                subjectList:[],
                currentNum: 1,
                pageSize: 10,
                startDate: '',
                total: 0,
                keywords:'',
                tableDataShow: false,
                dialogVisible: false,
                dialogUpdate:false,
                title:{},
                titleId:'',
                form: {
                    subjectId:'',
                    titleName: '',
                    titleType: '',
                    titleFraction: '',
                    titleAnswer: '',
                    titleStatus: '',
                    answer: '',
                    choice1: '',
                    choice2: '',
                    choice3: '',
                    choice4: '',
                },
                number: '',
                rules: {
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    subjectId: [
                        { required: true, message: '请选择科目', trigger: 'change' }
                    ],
                    titleName: [
                        { required: true, message: '请填写题目', trigger: 'blur' }
                    ],
                    titleType: [
                        { required: true, message: '请填写难度', trigger: 'blur' },
                        {type: 'number', message: '难度必须为数字值'}
                    ],
                    titleAnswer: [
                        { required: true, message: '请输入答案', trigger: 'blur' }
                    ],
                    titleStatus: [
                        { required: true, message: '请选择题目类型', trigger: 'change' }
                    ],
                    choice1: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    choice2: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    choice3: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    choice4: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],

                }
            }


        },
        watch: {
            form: {
                handler: function () {
                    this.number = this.form.titleStatus;
                },
                deep: true
            }
        },
        methods: {
            //table表格格式化
            sfktFormate(row,index){
                if (row.titleStatus == 1) {
                    return "填空题";
                } else if(row.titleStatus == 0){
                    return "单选题";
                }else if (row.titleStatus == 2){
                    return "主观题";
                }
            },
            updateQuestions(){
                console.log(this.title)
                let params = {
                    titleId :this.titleId,
                    subjectId: this.title.subjectId,
                    titleName: this.title.titleName,
                    titleType: this.title.titleType,
                    titleFraction: this.title.titleFraction,
                    titleStatus: this.title.titleStatus,
                    titleAnswer: this.title.titleAnswer,
                    choice1: this.title.choice1,
                    choice2: this.title.choice2,
                    choice3: this.title.choice3,
                    choice4: this.title.choice4,

                };
                this.axios
                    .post('/zj/title/updateTitle.htm',params)
                    .then(
                        function (response) {
                            if (response.data.code == "0000"){
                                this.$message.success("修改成功");
                                this.dialogUpdate  = false;
                                this.reload();
                            }else {
                                this.$message.error("修改失败");
                            }
                        }.bind(this)
                    )
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            insertQuestions(){
                let params = {
                    classId:this.form.classId,
                    subjectId: this.form.subjectId,
                    titleName: this.form.titleName,
                    titleType: this.form.titleType,
                    titleFraction: this.form.titleFraction,
                    titleStatus: this.form.titleStatus,
                    titleAnswer: this.form.answer,
                    choice1: this.form.choice1,
                    choice2: this.form.choice2,
                    choice3: this.form.choice3,
                    choice4: this.form.choice4,

                };
                this.axios
                    .post('/zj/title/insertByTitle.htm',params)
                    .then(
                        function (response) {
                            if (response.data.code == "0000"){
                                this.$message.success("新增成功");
                                this.dialogVisible  = false;
                                this.reload();
                            }else {
                                this.$message.error("新增失败");
                            }
                        }.bind(this)
                    )
                    .catch(function (error) {
                        console.log(error);
                    });

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
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            handleCloseUpdate(done){
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            handleClick(row) {
                this.titleId =row
                let params = {
                   titleId: row
                };
                this.axios
                    .post('/zj/title/queryTitleInfo.htm', params)
                    .then(
                        function (response) {
                            this.title = response.data.result;
                            console.log(this.title)
                            this.dialogUpdate =true;

                        }.bind(this)
                    )
                    .catch(function (error) {
                        console.log(error);
                    });

            },
            deleteClick(row){
                let params = {
                    titleId: row
                };
                this.axios
                    .post('/zj/title/deleteTileInfo.htm', params)
                    .then(
                        function (response) {
                            if (response.data.code == "0000"){
                                this.$message.success("删除成功");
                                this.dialogVisible  = false;
                                this.reload();
                            }else {
                                this.$message.error("删除失败");
                            }

                        }.bind(this)
                    )
                    .catch(function (error) {
                        console.log(error);
                    });
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
                  titleName:this.titleName,
                  subjectName:this.subjectName,
                  className:this.className,
                  titleType:this.titleType,
                  titleFraction:this.titleFraction,
                  currentNum: this.currentNum,
                  pageSize: this.pageSize,
                  keyWords:this.keywords
                };
                this.axios
                    .post('/zj/title/queryTitlePage.htm', params)
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
            queryClassList(){
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
            }
        },
        created() {
            this.queryPage()
            this.querySubjectList()
            this.queryClassList()
        }
    }
</script>

<style scoped>
    .el-row {
      margin-bottom: 20px;

    }
    .el-col {
        border-radius: 4px;
    }

    .wrapper{

    }

</style>
