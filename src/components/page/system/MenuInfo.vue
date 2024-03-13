<template>
    <div class="wrapper">
        <div style="margin-top: 20px">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <span style="cell_options_label">菜单名称:</span>
                        <el-input v-model="menuName" style="width: 70%"
                                  placeholder="请输入菜单名称">
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" class="glocal_button" icon="ios-search"
                                   @click="queryPage">查询
                        </el-button>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" class="glocal_button" icon="ios-search"
                                   style="margin-left: 400px;" @click="addMenuShow=true">新增
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div>
            <el-table :data="tableData" stripe style="width: 90%">
                <el-table-column prop="menuId" label="菜单ID" width="180"></el-table-column>
                <el-table-column prop="menuName" label="菜单名称" width="250"></el-table-column>
                <el-table-column prop="menuIndex" label="菜单链接" width="250"></el-table-column>
                <el-table-column prop="menuDegree" label="菜单层级" width="250"></el-table-column>
                <el-table-column prop="parentId" label="父菜单ID">
                  <template slot-scope="scope">
                    {{ scope.row.parentId ? scope.row.parentId : '父级菜单' }}
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
                  style="margin-left: 400px;margin-top: 10px;"
            />
        </div>

        <!--菜单新增-->
        <el-dialog title="菜单新增" :visible.sync="addMenuShow" width="25%" :before-close="handleClose">
            <span>
                <el-form ref="form" :model="form">
                    <el-form-item label="菜单名称" label-width="100px">
                        <el-input v-model="form.menuName" style="width: 180px"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单链接" label-width="100px">
                        <el-input v-model="form.menuIndex" style="width: 180px"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单层级" label-width="100px">
                        <el-input v-model="form.menuDegree" style="width: 180px"></el-input>
                    </el-form-item>
                    <el-form-item label="父菜单ID" label-width="100px">
                        <el-input v-model="form.parentId" style="width: 180px"></el-input>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addMenuShow = false">取 消</el-button>
                <el-button type="primary" @click="insertMenuInfo">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "MenuInfo",
        data() {
            return {
                addMenuShow:false,
                tableData: [],
                currentNum: 1,
                pageSize: 10,
                startDate: '',
                total: 0,
                endDate: '',
                tableDataShow: false,
                menuName:'',
                form:{
                    menuName:'',
                    menuIcon:'',
                    menuIndex:'',
                    menuDegree:'',
                    parentId:'',
                }
            }
        },
        methods:{
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
                this.queryPage();
            },
            changePageSize(pageSize) {
                //设置每页展示数量
                this.pageSize = pageSize;
                this.queryPage();
            },
            queryPage(){
                let params = {
                    currentNum: this.currentNum,
                    pageSize: this.pageSize,
                    menuName: this.menuName,
                };
                this.axios
                    .post('/zj/menu/queryPage.htm', params)
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
            insertMenuInfo(){
                let params = {
                    menuName: this.form.menuName,
                    menuIndex:this.form.menuIndex,
                    menuDegree:this.form.menuDegree,
                    parentId: this.form.parentId,
                };
                this.axios
                    .post('/zj/menu/insertMenuInfo.htm', params)
                    .then(
                        function (response) {
                            if (response.data.code == "0000"){
                                this.$message.success("新增成功");
                                this.addMenuShow = false;
                            }else {
                                this.$message.error("新增失败");
                            }
                        }.bind(this)
                    )
                    .catch(function (error) {
                        console.log(error);
                    });

            },



        },
        created(){
            this.queryPage()
        }
    }
</script>

<style scoped>
.wrapper{
  width: 100%;
}

  .grid-content {
      border-radius: 10px;
      min-height: 50px;
  }
</style>
