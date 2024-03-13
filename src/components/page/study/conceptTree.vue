<template>
  <div class="wholeBox">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i>学习管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>知识点树</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="treeName">
      <h2>课程章节目录</h2>
    </div>

    <div class="chapTree">
      <el-tree :data="computerComposition"
               @node-click="handleNodeClick">
      </el-tree>
    </div>

  </div>
</template>

<script>
export default {
  name: "chapTree",
  data(){
    return{
      sectionId:111,
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
                {id:1211,label:"进位计数制及其相互转换"},
                {id:1212,label:"真值和机器数"},
                {id:1213,label:"BCD码"},
                {id:1214,label:"字符与字符串"},
                {id:1215,label:"校验码"}]},
            {id:122, label: "定点数的表示与运算", children:[
                {id:1221,label:"定点数的表示"},
                {id:1222,label:"定点数的运算"},
                {id:1223,label:"强制类型转换"},
                {id:1224,label:"数据的存储和排列"}]},
            {id:123, label: "浮点数的表示与运算", children:[
                {id:1231,label:"浮点数的表示"},
                {id:1232,label:"浮点数的加减运算"}]},
            {id:124, label: "算术逻辑单元", children:[
                {id:1241,label:"串行加法器与并行加法器"},
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
      ]
      }
    },
  methods:{
    handleNodeClick(data){
      // console.log(data.id);
      this.sectionId=data.id;
      console.log(this.sectionId);
    }
  }
}
</script>

<style scoped>
.wholeBox{
  width: 230px;
}

</style>