<template>
  <div class="wrapper">
    <div class="crumbs" style="margin-top: 0px;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i>成绩管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>成绩分段</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class=" el-searching">
      <el-row :gutter="20">
        <el-col :span="6"></el-col>
        <el-col :span="6" style="margin-left: 10%">
          <el-select v-model="value" placeholder="请选择班级" clearable>
            <el-option
                v-for="item in options"
                :key="item.classId"
                :label="item.className"
                :value="item.classId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" style="margin-left: 10%">
          <el-select v-model="value1" placeholder="请选择试卷" clearable>
            <el-option
                v-for="item in options1"
                :key="item.paperId"
                :label="item.paperName"
                :value="item.paperId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" >
          <el-button type="primary" style="margin-left: 150px;" @click="queryLine">查询</el-button>
        </el-col>
      </el-row>
    </div>

    <div id="main" style="width: 100%;height: 600px;">

    </div>

  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: "subsection",
  data() {
    return {
      value:'计算机科学与技术1班',
      value1:'test-20230209',
      charts: '',
      opinionData: [],
      options:[],
      options1:[]
    }

  },
  //调用

  methods: {
    queryLine(){
      let param = {
        classId:this.value,
        paperId:this.value1
      };
      this.opinionData=[];
      this.axios
          .post('/zj/paper/queryAchievement.htm',param)
          .then(
              function (response) {
                response.data.result.filter((item, i) => {
                  this.opinionData.push(item)
                })
                // this.charts.setOption(true)
                this.drawLine('main')
              }.bind(this)
          )
          .catch(function (error) {
            console.log(error);
          });
    },

    drawLine(id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        title: {
          text: '成绩分段'
        },

        tooltip: {},
        legend: {
          data: ['成绩分段']
        },
        // grid: {
        //     left: '3%',
        //     right: '4%',
        //     bottom: '3%',
        //     containLabel: true
        // },

        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          data: ["0-30分", "30-60分", "60-80分", "80-100分"]
        },
        yAxis: {
          // 纵轴标尺固定
          type: 'value',
          scale: true,
          max: 15,
          min: 0,
          splitNumber: 20,
        },
        series: [{
          name: '总共人数',
          type: 'bar',
          stack: '总量',
          barCategoryGap: '60%',
          data: this.opinionData,
          itemStyle: {
            color: '#62A1A9'  //设置柱子颜色
          },
          emphasis: {
            itemStyle: {
              color: '#2F4654',   //hover时改变柱子颜色
              // shadowColor: 'rgba(102,102,102,0.50)',
              // shadowOffsetX: 0,
              // shadowOffsetY: 2,
              // shadowBlur: 6,
              borderWidth: 4,
              borderColor: '#2F4654',
              // borderType: 'solid'
            }
          },
        },

        ]
      })
    },
  },
  created() {
    this.axios
        .post('/zj/paper/queryAchievement.htm')
        .then(
            function (response) {
              response.data.result.filter((item, i) => {
                this.opinionData.push(item)
              })
              // this.charts.setOption(true)
              this.drawLine('main')
            }.bind(this)
        )
        .catch(function (error) {
          console.log(error);
        });

    this.axios
        .post('/zj/paper/queryClassIdList.htm')
        .then(
            function (response) {
              response.data.result.filter((item, i) => {
                this.options.push(item)
              })
              // this.charts.setOption(true)
            }.bind(this)
        )
        .catch(function (error) {
          console.log(error);
        });

    this.axios
        .post('/zj/paper/queryPaperIdList.htm')
        .then(
            function (response) {
              response.data.result.filter((item, i) => {
                this.options1.push(item)
              })
              // this.charts.setOption(true)
            }.bind(this)
        )
        .catch(function (error) {
          console.log(error);
        });
  },
  mounted() {
    this.$nextTick(function () {
      this.drawLine('main')
    })
  },
}
</script>

<style scoped>
.el-searching{
  margin-top: 20px;
}

.wrapper{
  width: 95%;
}

</style>