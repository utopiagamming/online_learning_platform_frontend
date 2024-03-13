<template>
  <div>

    <div class="title-paperName">
      <h1 style="text-align:center;">
        {{title.paperName}}
      </h1>
    </div>

    <div class="title-userName" style="margin-left: 20%">
      <el-row :gutter="20">
        <el-col :span="6"><h3>考试人：{{title.userName}}</h3></el-col>
        <el-col :span="6"><h3>限时  ：{{title.examDate}} 分钟</h3></el-col>
        <el-col :span="6">
          <h3>
            考试倒计时：<button v-if="!show"><span>{{hour? hourString+':'+minuteString+':'+secondString : minuteString+':'+secondString}}</span></button>
          </h3>
        </el-col>
      </el-row>
<!--      <br>考试人：{{title.userName}} <br/>-->
<!--      <br>限时  ：{{title.examDate}} 分钟 <br/>-->
<!--      <br>考试倒计时：<button v-if="!show"><span>{{hour? hourString+':'+minuteString+':'+secondString : minuteString+':'+secondString}}</span></button>-->
    </div>

    <div class="home">
      <el-card class="card-box" v-for="item of dataList" :key="item.id" v-show="examShow">
        <!-- 单选 1    填空2    主观3 -->
        <div>
          <div class="type-title">
            {{ getQuestionType(item) }}：{{ item.title }}共{{ item.list.length }}题，共{{ item.fraction }}分
          </div>
          <div class="item-title" v-for="(item2, index2) of item.list" :key="index2">
            <div class="title">{{ index2 + 1 }}.{{ item2.titleName }}&nbsp;&nbsp;{{ item2.titleFraction }}分</div>
            <div class="item-box" v-if="item2.type === 1">
              <el-radio-group v-model="item2.val">
                <el-radio :label="item2.choice1"></el-radio>
                <el-radio :label="item2.choice2"></el-radio>
                <el-radio :label="item2.choice3"></el-radio>
                <el-radio :label="item2.choice4"></el-radio>
              </el-radio-group>
            </div>
            <div class="item-box" v-if="item2.type === 2">
              <el-checkbox-group v-model="item2.val">
                <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="item2.val"></el-input>
              </el-checkbox-group>
            </div>
            <div class="content-box1" v-if="item.type === 3">
              <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="item2.val"></el-input>
            </div>
          </div>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
export default {
  props: ['allTitle', 'title'],
  data() {
    return {
      examShow: true,
      dataList: [],
      times:'',
      show:true,
      minute: '',
      second: '',
      hour:'',

    };
  },
  mounted() {
    if (this.times > 0) {
      this.hour = Math.floor(( this.times /60) % 24)
      this.minute = Math.floor((this.times) % 60)
      this.second = Math.floor((this.times / 60) % 60)
      this.countDowm()
    }
  },
  methods: {
    // 检查表单
    checkForm() {
      let all = [];
      this.allTitle.map((x) => {
        x.list &&
        x.list.map((y) => {
          all.push({ id: y.id, val: y.val });
        });
      });
      this.$emit('sendForm', all);
    },
    countDowm () {
      var self = this
      clearInterval(this.promiseTimer)
      this.promiseTimer = setInterval(function () {
        if (self.hour === 0) {
          if (self.minute !== 0 && self.second === 0) {
            self.second = 59
            self.minute -= 1
          } else if (self.minute === 0 && self.second === 0) {
            self.second = 0
            self.$emit('countDowmEnd', true)
            clearInterval(self.promiseTimer)
          } else {
            self.second -= 1
          }
        } else {
          if (self.minute !== 0 && self.second === 0) {
            self.second = 59
            self.minute -= 1
          } else if (self.minute === 0 && self.second === 0) {
            self.hour -= 1
            self.minute = 59
            self.second = 59
          } else {
            self.second -= 1
          }
        }
      }, 1000)
    },
    formatNum (num) {
      return num < 10 ? '0' + num : '' + num
    },
    getQuestionType(item) {
      if (item.list.some((item2) => item2.type === 1)) {
        return '单选题';
      } else if (item.list.some((item2) => item2.type === 2)) {
        return '主观题';
      } else if (item.list.some((item2) => item2.type === 3)) {
        return '填空题';
      } else {
        return '';
      }
    }
  },
  computed:{
    hourString () {
      return this.formatNum(this.hour)
    },
    minuteString () {
      return this.formatNum(this.minute)
    },
    secondString () {
      return this.formatNum(this.second)
    }
  },
  watch: {
    allTitle: {
      handler: function (val, oldval) {
        if (val != oldval) {
          this.$nextTick(() => {
            this.dataList = [];
            this.dataList = this.allTitle;
          });
        }
      },

      immediate: true, //关键
      deep: true
    }
  },
  created() {
    this.times = this.title.examDate;
    this.show = false
  }
};
</script>

<style  lang='scss' scoped>
.home {
  min-width: 600px;
  overflow-x: auto;
}

.card-box {
  margin: 10px;

  .type-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    .item-title {
      display: flex;
    }
  }
  .title {
    margin: 10px 0;
  }
  .item-box {
  }
  .content-box1 {
    margin-bottom: 30px;
  }
}
</style>
