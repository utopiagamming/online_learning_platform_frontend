<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i>学习管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>知识架构</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="wrapper">
      <div class="left">
        <div style="height: auto;">
          <el-select class="crumbs-selection" v-model="chapterId" placeholder="默认展示章节图谱" style="width: 12%">
            <el-option v-for="item in this.chapterList"
                       :key="item.chapterId"
                       :label="item.chapterName"
                       :value="item.chapterId">
            </el-option>
          </el-select>
          <el-button type="primary" @click="queryChapter" style="margin-left: 20px;">查询</el-button>
        </div>
        <div style="margin-left: 200px;">
          <img :src="imgPath" style="width:55%; height: auto; margin-left: -200px;margin-top: 5px;" >
        </div>
      </div>

      <div class="right" style="margin-left: -550px;">
        <div class="treeName" style="font-size: 20px;">课程章节目录</div>
        <div class="chapTree" style="margin-top: 10px;">
          <el-tree :data="computerComposition"
                   @node-click="handleNodeClick" :default-expanded-keys="[12, 121, 1211]">
          </el-tree>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
//import chapTree from "@/components/common/chapTree";
import ChapTree from "@/components/page/study/conceptTree";
export default {
  name: "KnowledgeGraph",
  components: {ChapTree},
  data(){
    return{
      imgPath:require("../../../assets/img/chapterAndSection.png"),
      chap2ImgPath:require("../../../assets/img/chapter2AndAllRelations.png"),
      chapterList:[
        {chapterId:11,chapterName:'计算机系统概述'},
        {chapterId:12,chapterName:'数据的表示和运算'},
        {chapterId:13,chapterName:'存储器概述'},
        {chapterId:14,chapterName:'指令系统'},
        {chapterId:15,chapterName:'中央处理器'},
        {chapterId:16,chapterName:'总线'},
        {chapterId:17,chapterName:'输入/输出系统'}
      ],
      computerComposition:[
        {
          id:11,
          label: "计算机系统概述",
          children:[
            {id:111, label: "计算机发展历程"},
            {id:112, label: "计算机系统层次结构"},
            {id:113, label: "计算机的性能指标"}
          ]
        },
        {
          id:12,
          label: "数据的表示和运算",
          children:[
            {id:121, label: "数制与编码", children:[
                {id:1211,label:"进位计数制及其相互转换",
                  children:[{id:12111,label:"进制计数法"},{id:12112,label:"不同进制之间的相互转换"}]},
                {id:1212,label:"真值和机器数"},
                {id:1213,label:"BCD码"},
                {id:1214,label:"字符与字符串",
                  children:[{id:12141,label:"字符编码ASCII码"},{id:12142,label:"汉字的表示和编码"}]},
                {id:1215,label:"校验码",
                  children:[{id:12151,label:"奇偶校验码"},{id:12152,label:"海明(汉明)校验码"},{id:12153,label:"循环冗余校验(CRC)码"}]}]},
            {id:122, label: "定点数的表示与运算", children:[
                {id:1221,label:"定点数的表示",
                  children:[{id:12211,label:"无符号数和有符号数"},{id:12212,label:"机器数的定点表示"},{id:12213,label:"原码、补码、反码、移码"}]},
                {id:1222,label:"定点数的运算",
                  children:[{id:12221,label:"定点数的移位运算"},{id:12222,label:"原码定点加减运算"},{id:12223,label:"补码定点加减运算"}
                    ,{id:12224,label:"符号扩展"},{id:12225,label:"溢出概念及判别方法"},{id:12226,label:"定点数乘法运算"},{id:12227,label:"定点数除法运算"}]},
                {id:1223,label:"强制类型转换",
                  children:[{id:12231,label:"有符号数与无符号数的转换"},{id:12232,label:"不同字长整数间的转换"}]},
                {id:1224,label:"数据的存储和排列",
                  children:[{id:12241,label:"大端小端存储"},{id:12242,label:"边界对齐存储"}]}]},
            {id:123, label: "浮点数的表示与运算", children:[
                {id:1231,label:"浮点数的表示",
                  children:[{id:12311,label:"浮点数表示格式"},{id:12312,label:"浮点数规格化"},{id:12313,label:"IEEE754标准"},{id:12314,label:"定点浮点表示区别"}]},
                {id:1232,label:"浮点数的加减运算",
                  children:[{id:12321,label:"对阶"},{id:12322,label:"尾数求和"},{id:12323,label:"规格化"}
                    ,{id:12324,label:"舍入"},{id:12325,label:"溢出判断"},{id:12326,label:"C语言浮点数类型转换"}]},]},
            {id:124, label: "算术逻辑单元", children:[
                {id:1241,label:"串行加法器与并行加法器",
                  children:[{id:12411,label:"一位全加器"},{id:12412,label:"串行加法器"},{id:12413,label:"并行加法器"}]},
                {id:1242,label:"算术逻辑单元的功能和结构"}]}
          ]
        },
        {
          id:13,
          label: "存储器概述",
          children:[
            {id:131, label: "存储器的分类"},
            {id:132, label: "存储器的层次化结构"},
            {id:133, label: "半导体随机存储器"},
            {id:134, label: "主存储器与CPU的连接"},
            {id:135, label: "双端口RAM和多模块存储器"},
            {id:136, label: "高速缓冲存储器"},
            {id:137, label: "虚拟存储器"}
          ]
        },
        {
          id:14,
          label: "指令系统",
          children:[
            {id:141, label: "指令格式"},
            {id:142, label: "指令的寻址方式"},
            {id:143, label: "CISC和RISC的基本概念"}
          ]
        },
        {
          id:15,
          label: "中央处理器",
          children:[
            {id:151, label: "CPU 的功能和基本结构"},
            {id:152, label: "指令执行过程"},
            {id:153, label: "数据通路的功能和基本结构"},
            {id:154, label: "控制器的功能和工作原理"},
            {id:155, label: "指令流水线"}
          ]
        },
        {
          id:16,
          label: "总线",
          children:[
            {id:161, label: "总线概述"},
            {id:162, label: "总线仲裁"},
            {id:163, label: "总线操作和定时"},
            {id:164, label: "总线标准"}
          ]
        },
        {
          id:17,
          label: "输入/输出系统",
          children:[
            {id:171, label: "I/O系统基本概念"},
            {id:172, label: "外部设备"},
            {id:173, label: "I/O接口"},
            {id:174, label: "I/O方式"}
          ]
        }
      ],
    }
  },
  methods:{
    getChapterImagePath(chapterId) {
      switch (chapterId) {
        case 12:
          return require("../../../assets/img/chapter2AndAllRelations.png");
        default:
          return require("../../../assets/img/chapterAndSection.png"); // 默认图片路径
      }
    },
    queryChapter(){
      const selectedChapterId = this.chapterId;
      this.imgPath = this.getChapterImagePath(selectedChapterId);
    }
  }
}
</script>

<style scoped>
.wrapper{
  display: flex;
}

</style>