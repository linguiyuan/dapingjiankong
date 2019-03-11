import zhLocale from 'element-ui/lib/locale/lang/zh-CN' //引入element语言包
const cn = {
    message: {
        loginPage:{
            userName: '用户名',
            passWord: '密码',
            login:'登录',
            inputTip1:'请输入用户名',
            inputTip2:'请输入密码'
        }
    },
    ...zhLocale
}
export default cn;
