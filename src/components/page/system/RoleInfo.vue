<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 系统管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-button type="primary" @click="addRoleShow=true" style="margin-left: 50%">角色新增</el-button>

        <div>
            <el-table
                    :data="tableData"
                    height="200"
                    border
                    style="width: 60%; margin-top: 10px;">
                <el-table-column type="index" label="ID" width:100px></el-table-column>
                <el-table-column prop="roleId" label="角色ID"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="type" label="操作" style="padding-left: 100%">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="queryRoleMenu(scope.row.roleId)">角色菜单配置</el-button>
                        <el-button type="danger" @click="deleteRole(scope.row.id)">角色删除</el-button>
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
                  style="text-align: center;"
                  class="pager1"
            />
        </div>

        <el-dialog
                title="角色新增"
                :visible.sync="addRoleShow"
                width="25%"
                :before-close="handleClose">
            <span>
                <el-form ref="form" :model="form">
                    <el-form-item label="角色ID" label-width="100px">
                        <el-input v-model="form.roleId" style="width: 180px"></el-input>
                    </el-form-item>
                    <el-form-item label="角色名称" label-width="100px">
                        <el-input v-model="form.roleName" style="width: 180px"></el-input>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleShow = false">取 消</el-button>
                <el-button type="primary" @click="insertRoleInfo">确 定</el-button>
            </span>
        </el-dialog>

        <!--        <el-button type="text" @click="addRoleShow">点击打开 Message Box</el-button>-->

        <Modal v-model="menuShow" title="角色菜单" @on-ok="ok" @on-cancel="cancel" style="width: 400px">
            <div style="max-height: 50rem">
                <el-tree
                        :data="data"
                        show-checkbox
                        node-key="id"
                        highlight-current
                        ref="tree"
                        :props="defaultProps"
                        :default-checked-keys="checkData">
                </el-tree>
            </div>
        </Modal>

    </div>
</template>

<script>
    export default {
        name: "RoleInfo",
        //局部刷新控制
        inject:['reload'],
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                addRoleShow: false,
                menuShow: false,
                menu: '',
                data: [],
                checkData: [],
                tableData: [],
                currentNum: 1,
                pageSize: 10,
                startDate: '',
                total: 0,
                endDate: '',
                tableDataShow: false,
                roleId: '',
                form: {
                    roleId: '',
                    roleName: ''
                },
            }

        },
        methods: {
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
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
                this.queryRoleBaseQuery();
            },
            changePageSize(pageSize) {
                //设置每页展示数量
                this.pageSize = pageSize;
                this.queryRoleBaseQuery();
            },
            ok() {
                let checkedKeys = this.$refs.tree.getCheckedKeys();
                let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
                console.log(halfCheckedKeys)
                halfCheckedKeys.forEach(f=>{
                    checkedKeys.push(f)
                })
                let params = {
                    roleId: this.roleId,
                    menuIdString: JSON.stringify(checkedKeys)
                };
                this.axios
                    .post('/zj/menu/updateRoleMenuInfo.htm', params)
                    .then(
                        function (response) {
                            if (response.data.code == "0000") {
                                this.$message.success("配置修改成功");
                            } else {
                                this.$message.error("配置修改失败");
                            }
                        }.bind(this)
                    )
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            getCheckedKeys() {
                console.log(this.$refs.tree.getCheckedKeys());
            },
            cancel() {
                this.$Message.info('保存取消');
            },
            queryRoleBaseQuery() {
                let params = {
                    currentNum: this.currentNum,
                    pageSize: this.pageSize,
                    keyWords: this.search,
                };
                this.axios
                    .post('/zj/role/rolePage.htm', params)
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
            insertRoleInfo() {
                let param = {
                    roleId: this.form.roleId,
                    roleName: this.form.roleName
                }
                this.axios
                    .post('/zj/role/insertRoleInfo.htm', param)
                    .then(
                        function (response) {
                            if (response.data.code == "0000") {
                                this.$message.success("新增成功");
                                this.addRoleShow = false
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
            deleteRole(sid) {
                console.log(sid)
                let param = {
                    id: sid,
                }
                this.axios
                    .post('/zj/role/deleteRole.htm', param)
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
            queryRoleMenu(roleId) {
                this.roleId = roleId;
                let params = {
                    roleId: roleId,
                };
                this.axios
                    .post('/zj/menu/queryMenuListByRoleId.htm', params)
                    .then(
                        function (response) {
                            this.menuShow = true;
                            this.data = response.data.result;
                        }.bind(this)
                    )
                    .catch(function (error) {
                        console.log(error);
                    });

                this.axios
                    .post('/zj/menu/queryMenuIdListByRoleId.htm', params)
                    .then(
                        function (response) {
                            this.checkData = response.data.result;
                        }.bind(this)
                    )
                    .catch(function (error) {
                        console.log(error);
                    });


            },
        }
        ,
        created() {
            this.queryRoleBaseQuery();
        }
    }
</script>

<style scoped>
  .pager1{
    margin-top: 10px;
    margin-left: -500px;
  }
</style>
