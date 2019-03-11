<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
                 text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon" style='color: rgb(191, 203, 217);margin-right: 4px;'></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <!--<el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index" v-show='subItem.power'>-->
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <!--<el-menu-item :index="item.index" :key="item.index" v-show='item.power'>-->
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon" style='color: rgb(191, 203, 217);margin-right: 4px;'></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: []
            }
        },
        computed: {
            onRoutes() {
                if(typeof this.$route.path == 'string'){
                    bus.$emit('position',this.$route.meta.position)
                }
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });
            // let power = JSON.parse(sessionStorage.getItem('auth'));
            let power = {};
            let item = [
                {
                    icon: 'fontfamily te-oa-icon-test',
                    index: 'monitor',
                    title: '实时监控',
                },
                {
                    icon: 'fontfamily te-oa-shujuguanli',
                    index: '1',
                    title: '车辆与轮胎',
                    subs: [
                        {
                            index: 'cars',
                            title: '车辆管理',
                        },
                        {
                            index: 'tires',
                            title: '轮胎管理',
                        },
                    ]
                },
                {
                    icon: 'fontfamily te-oa-shujuguanli',
                    index: 'store',
                    title: '门店查询',
                },
                {
                    icon: 'fontfamily te-oa-shujuguanli',
                    index: 'statisticalreport',
                    title: '统计报表',
                },
                {
                    icon: 'fontfamily te-oa-shujuguanli',
                    index: 'devicemanagement',
                    title: '设备管理',
                },
                {
                    icon: 'fontfamily te-oa-shujuguanli',
                    index: '6',
                    title: '历史记录',
                    subs:[
                        {
                            index:'tiresinfo',
                            title: '胎温胎压',
                        },
                        {
                            index:'alarmrecord',
                            title: '报警记录',
                        },
                    ]
                },
                {
                    icon: 'fontfamily te-oa-shujuguanli',
                    index: '7',
                    title: '系统管理',
                    subs:[
                        {
                            index:'usercenter',
                            title:'个人中心'
                        },
                        {
                            index:'usermanagement',
                            title:'用户管理'
                        },
                        {
                            index:'systemparameter',
                            title:'系统参数 '
                        },
                        {
                            index:'operationlog',
                            title:'操作日志 '
                        },
                        {
                            index:'devicelog',
                            title:'设备日志 '
                        },
                    ]
                }

            ];
            this.items =item;
        },
    }
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
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
