<template>
    <div>

      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-calendar"></i>教学管理
          </el-breadcrumb-item>
          <el-breadcrumb-item>班级管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

        <el-row :gutter="20">
            <el-col :span="6">
            </el-col>
            <el-col :span="6" style="margin-left: 85%">
                <el-button type="primary" @click="dialogVisible = true" style="margin-left: -80%">新增班级</el-button>
            </el-col>
        </el-row>

        <el-table
                :data="tableData"
                height="300"
                border
                stripe
                style="width: 80%; margin-top: 10px;">
            <el-table-column prop="classId" label="班级Id"></el-table-column>
            <el-table-column prop="className" label="班级"></el-table-column>
            <el-table-column fixed="right" label="操作">
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
              style="text-align: center; margin-left: -250px; margin-top: 10px;"
        />

        <el-dialog
              title="提示"
              :visible.sync="dialogVisible"
              width="30%"
              :before-close="handleClose">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="班级：">
                    <el-input v-model="form.className" style="width: 270px;"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="insert">新 增</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "classInfo",
        inject: ['reload'],
        data() {
            return {
                tableData: [],
                currentNum: 1,
                pageSize: 10,
                startDate: '',
                total: 0,
                tableDataShow: false,
                form: {
                    className: ''
                },
                dialogVisible: false,
            }
        },
        methods: {
            deleteSub(e) {
                console.log(e)
                let params = {
                    id: e.row.classId,
                };
                this.axios
                    .post('/zj/class/delete.htm', params)
                    .then(
                        function (response) {
                            if (response.data.code == "0000") {
                                this.$message.success("删除成功");
                                this.dialogVisible = false;
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
            insert() {
                let params = {
                    className: this.form.className,
                };
                this.axios
                    .post('/zj/class/insert.htm', params)
                    .then(
                        function (response) {
                            if (response.data.code == "0000") {
                                this.$message.success("新增成功");
                                this.dialogVisible = false;
                                this.reload();
                            } else {
                                this.$message.error("新增失败");
                            }
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
            queryPage() {
                let params = {
                    currentNum: this.currentNum,
                    pageSize: this.pageSize,
                };
                this.axios
                    .post('/zj/class/queryPageByClass.htm', params)
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

</style>
