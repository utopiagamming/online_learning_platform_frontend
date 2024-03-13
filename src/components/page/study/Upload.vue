<template>
  <div>
    <div>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-calendar"></i>学习管理
          </el-breadcrumb-item>
          <el-breadcrumb-item>视频管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-button style="" type="primary" @click="dialogInsert = true" style="margin-left: 980px;margin-top: -150px;">上传视频</el-button>
    </div>

    <el-table
        :data="tableData"
        border
        stripe
        v-show="dataShow"
        style="width: 80%; margin-top: 10px;">
      <el-table-column type="index" width="50"  label="序号"></el-table-column>
      <el-table-column prop="videoName" label="视频名称" width="200"></el-table-column>
      <el-table-column prop="videoUrl" label="视频地址" width="100"></el-table-column>
      <el-table-column prop="videoDuration" label="视频时长" width="140">
        <template slot-scope="scope">{{ Math.floor(scope.row.videoDuration/60)}}分{{ scope.row.videoDuration%60}}秒</template>
      </el-table-column>
      <el-table-column prop="videoSize" label="视频大小" width="100" >
        <template slot-scope="scope">{{ scope.row.videoSize}}M</template>
      </el-table-column>
      <el-table-column prop="createTime" label="上传时间" width="160"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" width="160"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="updateClick(scope.row.videoId)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="deleteClick(scope.row.videoId)" >删除</el-button>
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

    <el-dialog
        title="提示"
        :visible.sync="dialogUpdate"
        width="30%"
        :before-close="handleClose">
      <el-form ref="form" :model="video">
        <el-form-item label="视频名称" prop="videoName">
          <el-input v-model="video.videoName"></el-input>
        </el-form-item>
        <el-form-item label="视频时长" prop="videoDuration">
          <el-input v-model="video.videoDuration"></el-input>
        </el-form-item>
        <el-form-item label="视频大小" prop="videoSize">
          <el-input v-model="video.videoSize"></el-input>
        </el-form-item>
        <el-form-item label="知识点ID" prop="conceptId">
          <el-input v-model="video.conceptId"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
              <el-button @click="dialogUpdate = false">取 消</el-button>
              <el-button type="primary" @click="updateVideo()">确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog
        title="提示"
        :visible.sync="dialogInsert"
        width="30%"
        :before-close="handleClose">
      <el-form ref="form" :model="video">
        <el-form-item label="视频名称" label-width="100px" prop="videoName">
          <el-input v-model="video.videoName" style="width: 270px"></el-input>
        </el-form-item>
<!--        <el-form-item label="视频时长" prop="videoDuration">-->
<!--          <el-input v-model="video.videoDuration"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="视频大小" prop="videoSize">-->
<!--          <el-input v-model="video.videoSize"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="所在知识点" label-width="115px" prop="conceptId">
          <el-input v-model="video.conceptId" style="width: 255px"></el-input>
        </el-form-item>
      </el-form>
<!--      <el-upload accept=".mp4"></el-upload>-->
      <input type="file" ref="fileInput" style="display: none" @change="handleFileChange">
      <el-button @click="openFileBrowser" style="width: 200px;height: 100px;font-size: 20px; margin-left: 120px;">选择视频文件</el-button>
      <span slot="footer" class="dialog-footer">
              <el-button @click="dialogInsert = false">取 消</el-button>
              <el-button type="primary" @click="uploadVideo()">确 定</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Upload",
  data() {
    return {
      videoName:'',
      videoUrl:'',
      videoDuration:0,
      videoSize:0.0,
      conceptId:0,
      tableData: [],
      currentNum: 1,
      pageSize: 10,
      total: 0,
      dataShow:true,
      tableDataShow: true,
      // 修改删除
      dialogUpdate:false,
      video:{},
      form:{
        videoName:'',
        videoUrl:'',
        videoDuration:0,
        videoSize:0.0,
        conceptId:0,
      },
      // 新增
      dialogInsert:false,
      file:null,
      videoData:null,
      formData:null,
    }
  },
  methods:{
    queryPage(){
      let params={
        currentNum: this.currentNum,
        pageSize: this.pageSize,
      };
      this.axios
          .post('/zj/title/queryVideoList.htm',params)
          .then(
              function (response){
                this.tableData=response.data.result.list;
                console.log(this.tableData);
                this.total = response.data.result.count;
                this.tableDataShow=true;
                this.dataShow=true;
              }.bind(this)
          )
          .catch(function (error){
            console.log(error);
          });
    },
    updateVideo(){

    },
    deleteVideo(){

    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
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
    // 修改删除
    updateClick(row){
      this.dialogUpdate=true;
    },
    deleteCick(row){
      let params={
        videoId:row
      };
      this.axios
          .post('/zj/title/deleteVideo.htm')
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
          ).catch(function (erorr){
            console.log(erorr);
      });
    },
    // 上传视频
    openFileBrowser() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      // 处理选择的文件，例如上传到服务器等操作
      let formData = new FormData();
      formData.append("file",file);
      this.formData=formData;
    },
    uploadVideo(){
      let params={
        videoName:this.form.videoName,
        videoUrl:this.form.videoUrl,
        videoDuration:this.form.videoDuration,
        videoSize:this.form.videoSize,
        conceptId:this.form.conceptId,
        videoData:this.formData,
      };
      // 将 params 和 formData 合并到一个 FormData 对象中
      let formData = new FormData();
      formData.append("file", this.formData.get("file")); // 从原来的 formData 中获取文件数据
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, value);
      });
      console.log(formData);
      this.axios
          .post('zj/title/uploadVideo.htm',formData, {
            headers: {
              'Content-Type': 'multipart/form-data' // 设置请求头为 multipart/form-data
            }}
          )
          .then(
              function (response) {
                if (response.data.code == "0000"){
                  this.$message.success("上传成功");
                  this.dialogVisible  = false;
                  this.reload();
                }else {
                  this.$message.error("该视频与库中已有视频重复，上传失败，请重新选择");
                }
              }.bind(this)
          )
          .catch(function (error){
            console.log(error);
          })
    },
  },
  created(){
    this.queryPage();
    console.log('created method called');
  }
}
</script>

<style scoped>

</style>