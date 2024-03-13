<template>
	<div class="sidebar" v-if="$route.meta.isBlank!==true">
		<el-menu
			class="sidebar-el-menu"
			:default-active="onRoutes"
			:collapse="collapse"
			background-color="#fff"
			text-color="#080807"
			active-text-color="#080807"
			unique-opened
			router
		>
			<template v-for="item in items">
				<template v-if="item.subs">
					<el-submenu :index="item.index" :key="item.index">
            <!--一级菜单名-->
						<template slot="title">
							<i :class="item.icon"></i>
							<span slot="title">{{ item.title }}</span>
						</template>
            <!--二级菜单名-->
						<template v-for="subItem in item.subs">
							<el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
								<template slot="title">
									{{ subItem.title }}
								</template>
								<el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">{{ threeItem.title }}</el-menu-item>
							</el-submenu>
							<el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
						</template>
					</el-submenu>
				</template>

				<template v-else>
					<el-menu-item :index="item.index" :key="item.index">
						<i :class="item.icon"></i>
						<span slot="title">{{ item.title }}</span>
					</el-menu-item>
				</template>
			</template>

		</el-menu>
	</div>
</template>

<script>
import bus from '../common/bus';
export default {
	props: {
		routes: {
			default: () => []
		}
	},
	data() {
		return {
			collapse: false,
			items:[],
		};
	},
	computed: {
		onRoutes() {
			return this.$route.path.replace('/', '');
		}
	},
	mounted() {
		if(this.routes!=''&&this.routes!=undefined){
			this.items = this.routes;
		}
	},
	created() {
		// 通过 Event Bus 进行组件间通信，来折叠侧边栏
		bus.$on('collapse', msg => {
			this.collapse = msg;
			bus.$emit('collapse-content', msg);
		});
		let param={
            roleId:sessionStorage.getItem('role')
		};
		this.axios
				.post('/zj/login/queryMenuList.htm',param)
				.then(
						function (response) {
							this.items=response.data.result
						}.bind(this)
				)
				.catch(function (error) {
					console.log(error);
				});
	}
};
</script>

<style scoped>
.sidebar {
	display: block;
	position: absolute;
	left: 0px;
	top: 70px;
	bottom: 0;
	overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
	width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
	width: 170px;
}
.sidebar > ul {
	height: 100%;
}
</style>