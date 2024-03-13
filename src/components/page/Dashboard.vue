<template>
   <div class="dashboard_bg" ></div>
</template>

<script>
    export default {
        name: 'dashboard',
        data() {
           return {

           }
		    },
        components: {
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
        methods: {
        }
    }
</script>

<style scoped>
   .dashboard_bg {
       position: relative;
       width: 100%;
       height: 100%;
       background-image: url(../../assets/img/welcome.png);
       background-size: 100%;
   }
</style>