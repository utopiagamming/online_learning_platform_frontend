<template>
    <div class="login-wrap">
      <!--登录框-->
        <div class="ms-login">
            <div class="ms-title">在线学习系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.userId" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                            type="password"
                            placeholder="password"
                            v-model="param.password"
                            @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" plain @click="submitForm()">登录</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="primary" plain @click="dialogFormVisible = true">注册</el-button>
                </div>
            </el-form>
        </div>

      <!--注册框-->
        <el-dialog title="用户注册" :visible.sync="dialogFormVisible" center width="25%" :destroy-on-close="true">
            <el-form :model="form" :rules="rules1" ref="form">
                <el-form-item label="用户名：" label-width="100px" prop="userName">
                    <el-input v-model="form.userName" :label-width="formLabelWidth" placeholder="姓名"
                              style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="登录账号：" label-width="100px" prop="userId">
                    <el-input v-model="form.userId" :label-width="formLabelWidth" placeholder="学号或者教师号"
                              style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="登录密码：" label-width="100px" prop="password">
                    <el-input type="password" v-model="form.password" :label-width="formLabelWidth" placeholder="密码"
                              style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" label-width="100px" prop="confirmPassword">
                    <el-input type="password" v-model="form.confirmPassword" :label-width="formLabelWidth"
                              placeholder="确认密码" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="角色：" label-width="100px" prop="roleId" >
                    <el-select v-model="form.roleId" placeholder="请选择角色" :label-width="formLabelWidth"
                               style="width: 200px" @change="selectType">
                        <el-option label="学生" :value=0></el-option>
                        <el-option label="老师" :value=1></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级：" label-width="100px" prop="classId" v-show="this.status===0">
                    <el-select v-model="form.classId" placeholder="请选择班级" :label-width="formLabelWidth"
                               style="width: 200px">
                        <el-option
                                v-for="(item,index) in this.classList"
                                :label="item.className"
                                :value="item.classId"
                                :key="index">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary" @click="registerForm('form')">注 册</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import axios from 'axios'
    import {mapMutations} from 'vuex';
    export default {
        data: function () {
            return {
                classList:[
                  {classId:1,className:"计算机科学与技术1班"},
                  {classId:2,className:"计算机科学与技术2班"},
                  {classId:3,className:"软件工程1班"},
                  {classId:4,className:"软件工程2班"},
                  {classId:5,className:"信息安全"}
                ],
                status:1,
                param: {
                    userId: '',
                    password: '',
                },
                dialogFormVisible: false,
                rules: {
                    userId: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                },
                rules1: {
                    userName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur'}
                    ],

                    userId: [{required: true, message: '请输入用户id', trigger: 'blur'}],
                    confirmPassword: [{required: true, message: '请再次输入密码', trigger: 'blur'},
                        {min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur'}],
                  roleId: [{required: true, message: '请选择角色', trigger: 'change'}],
                },
                form: {
                    userName: '',
                    userId: '',
                    password: '',
                    delivery: false,
                    confirmPassword: '',
                  roleId: '',
                    classId:'',
                },
                formLabelWidth: '100px'

            };
        },
        methods: {
            ...mapMutations(['storeLogin']),
            selectType(event){
                console.log(event)
                this.status=event;
            },
            registerForm(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        let params = {
                            userId: this.form.userId,
                            password: this.form.password,
                            roleId: this.form.roleId,
                            userName: this.form.userName,
                            confirmPassword: this.form.confirmPassword,
                            classId:this.form.classId
                        }
                        if (this.form.password !== this.form.confirmPassword) {
                            this.$message({message: "密码不一致", type: 'error'});
                            return;
                        }
                        axios.post('/zj/login/registerLogin.htm', params)
                            .then(response => {
                                if (response.data.code == "0000") {
                                    this.$message({message: "注册成功", type: 'success'});
                                    this.$refs[form].resetFields();
                                    this.dialogFormVisible = false;
                                } else {
                                    this.$message({message: "注册出错", type: 'error'});
                                    // return false;
                                }
                            });
                    }
                });
            },
            resetForm(form) {
                this.$refs[form].resetFields();
                this.dialogFormVisible = false;
            },
            submitForm() {
                this.$refs.login.validate(valid => {
                    if (valid) {
                        let params = {
                            userId: this.param.userId,
                            password: this.param.password
                        }
                        axios.post('/zj/login/login.htm', params)
                            .then(response => {
                                if (response.data.code == "0000") {
                                    //生成uuid作为token
                                    const uuidv5 = require('uuid/v5');
                                    const token = uuidv5('zj', uuidv5.DNS);
                                    // 登陆成功 假设这里是后台返回的 token
                                    localStorage.setItem('token', response.data.result.token)
                                    sessionStorage.setItem('token', response.data.result.token)
                                    this.$message.success('登录成功');
                                    sessionStorage.setItem('role', JSON.stringify(response.data.result.role));
                                    sessionStorage.setItem('ms_username', response.data.result.userName);
                                    sessionStorage.setItem('uid', response.data.result.uid);
                                    sessionStorage.setItem('userId', response.data.result.userId);
                                    var user = this.param.userName;
                                    this.userToken = response.data.result.token;  //拿到返回数据里的token
                                    this.storeLogin({Authorization: this.userToken});
                                    this.$router.push('/')
                                } else {
                                    this.$message({message: response.data.description, type: 'error'});
                                }
                            })
                            .catch(error => {
                                console.log(error)
                                this.$message({message: "登录出错", type: 'error'});
                            });
                    } else {
                        this.$message.error('请输入账号和密码');
                        return false;
                    }
                });
            },
        },
        created() {
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
    };
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }

</style>