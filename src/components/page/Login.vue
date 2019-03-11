<template>
    <div class="login-wrap">
        <div class="bgc_img"></div>
        <div class="login_wrap_w">
            <div class="log_logo"><img src="../../../static/img/20190228230211.png" alt=""></div>
            <div class="ms-title">智能轮胎管理系统</div>
            <div class='ms-login' v-loading="loading">
                <el-form :model="ruleForm" :rules="{
                    username: [
                        { required: true, message: $t('message.loginPage.inputTip1'),trigger: 'blur'}
                    ],
                    password: [
                        { required: true, message: $t('message.loginPage.inputTip2'),trigger: 'blur'}
                    ]
                }" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                    <el-form-item prop="username">
                        <el-input v-model="ruleForm.username"
                                  :placeholder="$t('message.loginPage.userName')"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" :placeholder="$t('message.loginPage.passWord')"
                                  v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                    </el-form-item>
                    <div class='checkBox'>
                        <el-checkbox v-model="checked" @change='rememberMe'>记住密码</el-checkbox>
                    </div>
                    <div class="login-btn">
                        <el-button type="primary" @click="submitForm('ruleForm')">{{$t('message.loginPage.login')}}
                        </el-button>
                    </div>
                    <!--<div class="lg_tip">-->
                    <!--<p><span>中文</span>&nbsp;|&nbsp;<span>English</span></p>-->
                    <!--</div>-->
                    <div class="language_box">
                        <el-select v-model="value" placeholder="请选择" @change='switchLanguage'>
                            <el-option
                                v-for="item in language"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data: function () {
            return {
                value: this.$i18n.locale,
                checked: false,
                language: [
                    {
                        value: "cn",
                        label: "中文简体"
                    },
                    {
                        value: "en",
                        label: "English"
                    },
                ],
                loading: false,
                ruleForm: {
                    username: '',
                    password: ''
                },
                // rules: {
                //     username: [
                //         { required: true, message: '', trigger: 'blur' }
                //     ],
                //     password: [
                //         { required: true, message: '', trigger: 'blur' }
                //     ]
                // },
            }
        },
        mounted(){
            this.getCookie()
        },
        methods: {
            // 登录
            switchLanguage(lang) {
                let vm = this;
                switch (lang) {
                    case 'cn':
                        vm.$i18n.locale = 'cn';
                        break;
                    case 'en':
                        vm.$i18n.locale = 'en';
                        break;
                    default :
                        vm.$i18n.locale = 'cn';
                }
                // this.$cookie.set(
                //     "DefaultLanguage",
                //     (vm.value),        //
                //     {                     //
                //         expires: "30m"        //默认cookie有效时间为30分钟
                //     }
                // );
            },
            submitForm(formName) {
                let vm = this;
                vm.$refs[formName].validate((valid) => {
                    if (valid) {
                        vm.loading = true;
                        // sessionStorage.setItem('token','123456');
                        // vm.$router.push('/');
                        vm.$axios({
                            method: 'post',
                            url: window.$g_Api1 + '/api/login',
                            data: {
                                user: vm.ruleForm.username,
                                pass: vm.ruleForm.password,
                                language: 'cn'
                            }
                        })
                            .then(function (res) {
                                vm.loading = false;
                                if (res.data.errcode == 0) {
                                    sessionStorage.setItem('username', res.data.username);
                                    sessionStorage.setItem('userid', res.data.userid);
                                    sessionStorage.setItem('accesstoken', res.data.accesstoken);
                                    vm.$router.push('/monitor');
                                } else {
                                    return false;
                                }
                            })
                            .catch(function (err) {
                            });
                    } else {
                        vm.loading = false;
                        console.log('error submit!!');
                        return false;
                    }

                });
            },
            rememberMe(value) {
                let vm = this;
                if (value) {
                    vm.setCookie(vm.ruleForm.username, vm.ruleForm.password, 7)
                } else {
                    vm.clearCookie()
                }
            },
            setCookie(c_name, c_pwd, exdays) {
                var exdate = new Date();
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
                document.cookie = "userName=" + c_name + ";path=/;expires=" + exdate.toLocaleString()
                document.cookie = "userPwd=" + c_pwd + ";path=/;expires=" + exdate.toLocaleString()
            },
            //读取cookie
            getCookie:function () {
                if (document.cookie.length>0) {
                    var arr=document.cookie.split('; ');//这里显示的格式需要切割一下自己可输出看下
                    for(var i=0;i<arr.length;i++){
                        var arr2=arr[i].split('=');//再次切割
                        //判断查找相对应的值
                        if(arr2[0]=='userName'){
                            this.ruleForm.username=arr2[1];//保存到保存数据的地方
                            console.log(this.ruleForm.username);
                        }else if(arr2[0]=='userPwd'){
                            this.ruleForm.password=arr2[1];
                        }
                    }
                    if(this.ruleForm.username && this.ruleForm.password){
                        this.checked = true;
                    }else {
                        this.checked = false;
                    }
                }
            },
            //清除cookie
            clearCookie:function () {
                this.setCookie("","",-1);//修改2值都为空，天数为负1天就好了
            },
        }
    }
</script>

<style lang='scss'>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        padding-top: 40px;
        .login_wrap_w {
            position: relative;
            width: 400px;
            z-index: 888;
            margin: 0 auto;
            padding: 30px 40px;
            padding-top: 0px;
            border-radius: 5px;
            background-color: rgba(255, 255, 255, 0.4);
        }
        .bgc_img {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: url("../../../static/img/400730822.png") no-repeat center center;
            background-size: cover;
            opacity: 0.9;
        }
        .log_logo {
            width: 100%;
            text-align: center;
            font-size: 44px;
            color: #666666;
            img {
                width: 180px;
            }
        }
        .ms-title {
            margin-top: -50px;
            text-align: center;
            font-size: 22px;
            color: #999999;
        }
        .ms-login {
            width: 300px;
            padding: 30px 40px;
            border-radius: 5px;
            margin: 0 auto;
            .checkBox {
                width: 100%;
                display: flex;
                justify-content: flex-start;
                margin-bottom: 10px;
            }
        }
        .ti {
            width: 100%;
            text-align: center;
            margin-bottom: 20px;
        }
        .login-btn {
            text-align: center;
        }
        .login-btn button {
            width: 100%;
            height: 36px;
            font-size: 16px;
        }
        .language_box {
            text-align: left;
            padding-left: 0px;
            .el-input__inner {
                width: 100px;
                border: none;
                background-color: transparent;
                color: #409eff;
                padding-left: 0px !important;
            }
            .el-input__suffix {
                i {
                    color: #409eff !important;
                }
            }
        }
        .lg_tip {
            font-size: 12px;
            color: #409eff;
            text-align: left;
            margin-top: 8px;
            span {
                &:hover {
                    cursor: pointer;
                }
            }
        }
    }

</style>
