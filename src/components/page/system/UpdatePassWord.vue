<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar-user"></i> 系统管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>密码修改</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-card class="box-card" style="margin-right: 50% ;height: 70%">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="老密码" prop="oldPassword">
                    <el-input type="password" v-model="ruleForm.oldPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="pass">
                    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

    </div>
</template>

<script>
    export default {
        data() {
            var validateUserId2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入老密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };

            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    pass: '',
                    checkPass: '',
                    oldPassword:'',
                },
                rules: {
                    pass: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                    oldPassword:[{
                        validator: validateUserId2, trigger: 'blur'
                    }]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let params = {
                            pwd:this.ruleForm.pass,
                            oldPassword:this.ruleForm.oldPassword,
                        }
                        this.axios.post('/kousi/updatePwd.htm',params)
                            .then(function (response) {
                                if(response.data.code=="0000"){
                                   this.$message.success('修改成功');
                                    this.$router.push('/login');
                                }else{
                                   this.$message.success(response.data.description);
                                }
                                this.handleReset('formItem');
                            }.bind(this))
                            .catch(function (response) {
                                // this.$Message.error('系统异常');
                            });
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>
<style scoped>

</style>