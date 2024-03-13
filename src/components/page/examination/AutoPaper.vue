<template>
    <div>
        <div class="formClass" v-show="formShow">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="试卷名称：">
                    <el-input type="textarea" v-model="form.titleName" style="width: 20%"></el-input>
                </el-form-item>

                <el-form-item label="试卷科目：">
                    <el-select v-model="form.subjectId" clearable placeholder="请选择科目">
                        <el-option v-for="(item, index) in this.subjectList" :label="item.subjectName" :value="item.subjectId" :key="index">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="难度系数：">
                    <el-col :span="2">
                        <el-input v-model="form.titleType1"></el-input>
                    </el-col>
                    <el-col class="line" :span="0.8">-</el-col>
                    <el-col :span="2">
                        <el-input v-model="form.titleType2"></el-input>
                    </el-col>
                </el-form-item>

                <el-form-item label="题目选型：">
                    <el-checkbox-group v-model="form.titleStatus">
                        <el-checkbox label="单选题" name="type"></el-checkbox>
                        <el-checkbox label="主观题" name="type"></el-checkbox>
                        <el-checkbox label="填空题" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="题目数量：">
                    <el-input-number
                        v-model="form.num"
                        :step="5"
                        controls-position="right"
                        @change="handleChange"
                        :min="15"
                        :max="45"
                    ></el-input-number>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">开始组卷</el-button>
                    <el-button>取消</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formShow: true,
            subjectList: [],
            classList: [],
            radio: 3,
            form: {
                num: 15,
                subjectId: '',
                titleType1: '',
                titleType2: '',
                titleName: '',
                titleStatus: ''
            },
        };
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        },
        handleChange(value) {
            console.log(value);
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
        }
    },
    created() {
        this.querySubjectList();
        this.queryClassList();
    }
};
</script>

<style >
.box-card {
    float: left;
    width: 1000px;
    height: 1000px;
}
.checkCard {
    float: left;
}
</style>
