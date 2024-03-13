<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 系统管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div>
            <Row class="row_line">
                <div class="cell_options">
                    <span class="cell_options_span" style="cell_options_label">模糊查询:</span>
                    <el-input v-model="search" style="width: 70%" placeholder="请输入搜索内容" width="250px"></el-input>
                </div>
                <div class="cell_options_button">
                    <el-button type="primary" class="global_button" icon="ios-search" @click="queryUserInfoByBaseQuery">查询</el-button>
                </div>
            </Row>
        </div>

        <div>
            <el-table class="table1"
                    :data="tableData"
                    height="550"
                    border
                    style="width: 88%">
                <el-table-column type="index" width="50px"></el-table-column>
                <el-table-column prop="userId" label="人员id" width="150px"></el-table-column>
                <el-table-column prop="userName" label="人员姓名" width="150px"></el-table-column>
                <el-table-column prop="className" label="班级" width="180px"></el-table-column>
                <el-table-column prop="roleId" label="所属角色" width="100px">
<!--                        <template slot-scope="scope">{{ scope.row.roleId}}</template>-->
                    <template slot-scope="scope">{{ scope.row.roleId === "student" ? '学生' : '老师' }}</template>
                </el-table-column>
                <el-table-column prop="password" label="用户密码" width="250px"></el-table-column>
                <el-table-column prop="isDelete" label="是否删除" width="80px">
                    <template slot-scope="scope">{{ scope.row.isDelete === 0 ? '否' : '是' }}</template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="150px"></el-table-column>
                <el-table-column  label="操作" width="60">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text">编辑</el-button>
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
                  style="margin-left: 450px;"
                  class="pager1"
            />
        </div>

        <el-dialog title="用户注册" :visible.sync="dialogFormVisible" center width="25%" :destroy-on-close="true">
            <el-form :model="form" ref="form">
                <el-form-item label="登录姓名：" label-width="100px" >
                    <el-input v-model="form.userName" :label-width="formLabelWidth" placeholder="姓名"
                              style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="登录账号：" label-width="100px" >
                    <el-input v-model="form.userId" :label-width="formLabelWidth" :disabled="true" placeholder="学号或者教师号"
                              style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="登录密码：" label-width="100px">
                    <el-input type="password" v-model="form.password" :label-width="formLabelWidth" :disabled="true"
                              placeholder="密码"
                              style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="是否删除：" label-width="100px">
                    <el-select v-model="form.isDelete" placeholder="是否删除" :label-width="formLabelWidth"
                               style="width: 200px">
                        <el-option label="否" :value= 0></el-option>
                        <el-option label="是" :value= 1></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="updaeForm(form)">修 改</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        data() {
            return {
                formLabelWidth: '100px',
                dialogFormVisible: false,
                search: '',
                tableData: [],
                currentNum: 1,
                pageSize: 10,
                startDate: '',
                total: 0,
                endDate: '',
                tableDataShow: false,
                form: {
                    userName: '',
                    userId: '',
                    password: '',
                    isDelete: '',
                    typeId: '',
                },


            }
        },
        methods: {
            updaeForm(form) {
                console.log(form)
                let params = {
                    userId: form.userId,
                    password: form.password,
                    typeId: form.typeId,
                    userName: form.userName,
                    isDelete: form.isDelete,
                }
                axios.post('/zj/login/updateUserInfo.htm', params)
                    .then(response => {
                        if (response.data.code == "0000") {
                            this.$message({message: "修改成功", type: 'success'});
                            this.dialogFormVisible = false;
                        } else {
                            this.$message({message: "修改出错", type: 'error'});
                            // return false;
                        }
                    });
            },
            handleClick(row) {
                console.log(row);
                this.form = row;
                this.dialogFormVisible = true;
            },
            //清除当前表单里面数据
            resetForm() {
                this.dialogFormVisible = false;
            },


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
                this.queryUserInfoByBaseQuery();
            },
            changePageSize(pageSize) {
                //设置每页展示数量
                this.pageSize = pageSize;
                this.queryUserInfoByBaseQuery();
            },

            queryUserInfoByBaseQuery() {
                let params = {
                    currentNum: this.currentNum,
                    pageSize: this.pageSize,
                    keyWords: this.search,
                };
                this.axios
                    .post('/zj/login/queryUserInfo.htm', params)
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
            this.queryUserInfoByBaseQuery();
        }
    }
</script>

<style scoped>
    .row_line {
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 20px;
    }

    .is-finish {
        padding: 0 !important;
    }

    .is-process {
        padding: 0 !important;
    }

    .is-wait {
        padding: 0 !important;
    }

    .ivu-modal-body {
        padding: 0;
    }

    .global_button {
        margin-left: 20px;
    }

    .item {
        margin-top: 10px;
        margin-right: 40px;
    }

    .cell_options {
        width: 15%;
        float: left;
    }

    /*.cell_options_span{*/
    /*  margin-right: 40px;*/
    /*}*/

    .cell_options_label {
        width: 30%;
    }

    /*.cell_options_button{*/
    /*  margin-right: 140px;*/
    /*}*/
    .table1{
      margin-left: 20px;
    }
    .pager1{
      margin-top: 10px;
    }
</style>
