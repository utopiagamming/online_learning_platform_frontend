<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i>学习管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>视频观看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="wrapper">
      <div class="leftClass">
        <chap-tree class="chapTree" @node-selected="handleNodeSelected"></chap-tree>
      </div>
      <div class="rightClass">
        <video class="videoPlay" controls autoplay :src="videoSrc"></video>
      </div>
    </div>
  </div>
</template>

<script>
import chapTree from "@/components/common/chapTree";
import conceptTree from "@/components/page/study/conceptTree";

export default {
  name: "Videos",
  components:{
    chapTree
  },
  data(){
    return{
      videoSrc:require('../../../assets/video/12111.mp4'),
      idVideoSourceMap:{
        12111:require('../../../assets/video/12111.mp4'),
        12112:require('../../../assets/video/12112.mp4'),
        1213:require('../../../assets/video/1213.mp4'),
        12141:require('../../../assets/video/12141.mp4'),
        12151:require('../../../assets/video/12151.mp4'),
        12152:require('../../../assets/video/12152.mp4'),
        12153:require('../../../assets/video/12153.mp4'),
      },
      videoSrcNow:null,
    }
  },
  methods:{
    handleNodeSelected(nodeId) {
      console.log('Selected node ID:', nodeId);
      this.videoSrcNow=this.idVideoSourceMap[nodeId]
      console.log('Selected video source:', this.videoSrcNow);
      if (!this.videoSrcNow) {
        this.$message.info("该知识点下无教学视频，请前往下一层级或查看其他知识点");
      }
      this.videoSrc=this.videoSrcNow;
     //this.videoSrc=require(this.videoSrcNow);
    },
  }
}
</script>

<style scoped>

.wrapper{
  display: flex;
}
.left{
  display:inline-block;
}
.right{
  display:inline-block;
}


.chapTree{
  /*margin-top: 20px;*/
}

.videoPlay{
  width: 90%;
  margin-left: 10px;
}
</style>
