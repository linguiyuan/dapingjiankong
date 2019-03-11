import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/monitor',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/monitor',
                    component: resolve => require(['../components/page/viewData/monitor.vue'], resolve),
                    meta: { title: '实时监控' ,position:'实时监控'},
                },
                {
                    path: '/cars',
                    component: resolve => require(['../components/page/viewData/cars.vue'], resolve),
                    meta: { title: '车辆管理' ,position:'车辆与轮胎 > 车辆管理'},
                },
                {
                    path: '/tires',
                    component: resolve => require(['../components/page/viewData/tires.vue'], resolve),
                    meta: { title: '轮胎管理' ,position:'车辆与轮胎 > 轮胎管理'},
                },
                {
                    path: '/store',
                    component: resolve => require(['../components/page/viewData/store.vue'], resolve),
                    meta: { title: '门店查询' ,position:'门店查询'},
                },
                {
                    path: '/statisticalreport',
                    component: resolve => require(['../components/page/viewData/statisticalreport.vue'], resolve),
                    meta: { title: '统计报表' ,position:'统计报表'},
                },
                {
                    path: '/devicemanagement',
                    component: resolve => require(['../components/page/viewData/devicemanagement.vue'], resolve),
                    meta: { title: '设备管理' ,position:'设备管理'},
                },
                {
                    path: '/tiresinfo',
                    component: resolve => require(['../components/page/viewData/tiresinfo.vue'], resolve),
                    meta: { title: '胎温胎压' ,position:'历史记录 > 胎温胎压'},
                },
                {
                    path: '/alarmrecord',
                    component: resolve => require(['../components/page/viewData/alarmrecord.vue'], resolve),
                    meta: { title: '报警记录' ,position:'历史记录 > 报警记录'},
                },
                {
                    path: '/usercenter',
                    component: resolve => require(['../components/page/viewData/usercenter.vue'], resolve),
                    meta: { title: '用户中心' ,position:'系统管理 > 用户中心'},
                },
                {
                    path: '/usermanagement',
                    component: resolve => require(['../components/page/viewData/usermanagement.vue'], resolve),
                    meta: { title: '用户管理' ,position:'系统管理 > 用户管理'},
                },
                {
                    path: '/systemparameter',
                    component: resolve => require(['../components/page/viewData/systemparameter.vue'], resolve),
                    meta: { title: '系统参数' ,position:'系统管理 > 系统参数'},
                },
                {
                    path: '/operationlog',
                    component: resolve => require(['../components/page/viewData/operationlog.vue'], resolve),
                    meta: { title: '操作日志' ,position:'系统管理 > 操作日志'},
                },
                {
                    path: '/devicelog',
                    component: resolve => require(['../components/page/viewData/devicelog.vue'], resolve),
                    meta: { title: '设备日志' ,position:'系统管理 > 设备日志'},
                },
                // {
                //     path: '/oacustomer1',
                //     component: resolve => require(['../components/page/viewData/oacustomer1.vue'], resolve),
                //     meta: { title: '客户人数1' }
                // },
                // {
                //     path: '/order1',
                //     component: resolve => require(['../components/page/viewData/order1.vue'], resolve),
                //     meta: { title: '订单比1'}
                // },
                // {
                //     path: '/achievement1',
                //     component: resolve => require(['../components/page/viewData/achievement1.vue'], resolve),
                //     meta: { title: '员工绩效1'}
                // },
                // {
                //     path: '/profits1',
                //     component: resolve => require(['../components/page/viewData/profits1.vue'], resolve),
                //     meta: { title: '股东收益1'}
                // },
                // {
                //     path: '/devices1',
                //     component: resolve => require(['../components/page/viewData/devices1.vue'], resolve),
                //     meta: { title: '设备管理1'}
                // },
                // {
                //     path: '/moneylog1',
                //     component: resolve => require(['../components/page/viewData/moneylog1.vue'], resolve),
                //     meta: { title: '转账记录' }
                // },
                // {
                //     path: '/groupdata',
                //     component: resolve => require(['../components/page/viewData/groupdata.vue'], resolve),
                //     meta: { title: '分组数据' }
                // },
                // {
                //     path: '/datastatistics2',
                //     component: resolve => require(['../components/page/operData/dataDtatistics2.vue'], resolve),
                //     meta: { title: '实时数据2' }
                // },
                // {
                //     path: '/daydata2',
                //     component: resolve => require(['../components/page/operData/dayData2.vue'], resolve),
                //     meta: { title: '每日数据2' }
                // },
                // {
                //     path: '/oacustomer2',
                //     component: resolve => require(['../components/page/operData/oacustomer2.vue'], resolve),
                //     meta: { title: '客户人数2' }
                // },
                // {
                //     path: '/achievement2',
                //     component: resolve => require(['../components/page/operData/achievement2.vue'], resolve),
                //     meta: { title: '员工绩效2'}
                // },
                // {
                //     path: '/profits2',
                //     component: resolve => require(['../components/page/operData/profits2.vue'], resolve),
                //     meta: { title: '股东管理'}
                // },
                // {
                //     path: '/money',
                //     component: resolve => require(['../components/page/operData/money.vue'], resolve),
                //     meta: { title: '新建转账' }
                // },
                // {
                //     path: '/devices2',
                //     component: resolve => require(['../components/page/operData/devices2.vue'], resolve),
                //     meta: { title: '设备管理2'}
                // },
                // {
                //     path: '/groupmanagement',
                //     component: resolve => require(['../components/page/operData/groupmanagement.vue'], resolve),
                //     meta: { title: '分组管理'}
                // },
                // {
                //     path: '/usercenter',
                //     component: resolve => require(['../components/page/operData/usercenter.vue'], resolve),
                //     meta: { title: '用户中心'}
                // },
                // {
                //     path: '/devicestate',
                //     component: resolve => require(['../components/page/operData/devicestate.vue'], resolve),
                //     meta: { title: '设备推广'}
                // },
                // {
                //     path: '/accountoutput',
                //     component: resolve => require(['../components/page/operData/accountoutput.vue'], resolve),
                //     meta: { title: '账号产出'}
                // },
                // {
                //     // 权限页面
                //     path: '/manage',
                //     component: resolve => require(['../components/page/manage.vue'], resolve),
                //     meta: { title: '用户管理'}
                // },
                // {
                //     path: '/operationlog',
                //     component: resolve => require(['../components/page/operationlog.vue'], resolve),
                //     meta: { title: '操作日志'}
                // },
                // {
                //     path: '/403',
                //     component: resolve => require(['../components/page/403.vue'], resolve),
                //     meta: { title: '更新日志'}
                // },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
