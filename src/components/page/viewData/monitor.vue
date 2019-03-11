<template>
    <div id='monitor' :class="['my_wap', 'monitor',{'monitor1':fullscreen}]">
        <!--<baidu-map center="北京" class="mymap" ak="YOUR_APP_KEY"></baidu-map>-->
        <div id="mo_map"></div>
        <!--<div id="mo_map1" v-show=!type></div>-->
        <div class="mo_search_box">
            <span class="extend" @click='changeExtend'>
                <i :class="extend?'el-icon-arrow-right':'el-icon-arrow-left'"></i>
            </span>
            <el-select
                v-model="deviceNb"
                filterable
                remote
                reserve-keyword
                placeholder="设备号"
                :remote-method="remoteMethod"
                @change='search'
                :class='["mo_searchinput",{"mo_searchinput1":extend}]'
                :loading="searchLoading">
                <!--<i slot="suffix" class="el-input__icon el-icon-search" @click='search'></i>-->
                <el-option
                    v-for="item in options"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
            <i class="el-icon-rank fullscreen" @click="handleFullScreen"></i>
        </div>
        <div id="errBox">
            <div class="errbox">
                <p v-for='(value,index) in errorInfo' :class="['errType0',{'active':errAc==index?true:false}]" :key='index' @click='showerrInfo(value.rid,index)'>
                    <span class='title'><i class="el-icon-warning"></i>设备号:{{value.rid}}</span>
                    <span>时间:{{value.t | getDateType}}</span>
                    <span>轮位:{{value.sn}}</span>
                    <span>报警类别:{{value.wt | geterrType}}</span>
                </p>
            </div>
        </div>
        <div style='opacity: 0;position: relative;z-index: -100'>
            <div class="infoWindow" ref='infoWindow'>
                <div class="infoText">
                    <div class="textbox">
                        <div>
                            <span><i class='fontFamily myiconcheliangpengzhuang'></i>车队 <i>:</i></span>
                            <p></p>
                        </div>
                        <div>
                            <span><i class='fontFamily myiconchepai'></i>车牌 <i>:</i></span>
                            <p></p>
                        </div>
                        <div>
                            <span><i class='fontFamily myiconhuabanfuben'></i>设备号 <i>:</i></span>
                            <p>{{infoWindow.rid}}</p>
                        </div>
                        <div>
                            <span><i class='fontFamily myiconchexing'></i>类型 <i>:</i></span>
                            <p>{{infoWindow.type | getType()}}</p>
                        </div>
                        <div>
                            <span><i class='fontFamily myiconshebeizhuangtai'></i>状态 <i>:</i></span>
                            <p>{{infoWindow.status | getStatus()}}</p>
                        </div>
                        <div>
                            <span><i class='fontFamily myiconshijian'></i>时间 <i>:</i></span>
                            <p>{{infoWindow.time}}</p>
                        </div>
                        <div>
                            <span><i class='fontFamily myiconGroup-'></i>速度 <i>:</i></span>
                            <p>{{infoWindow.speed}}</p>
                        </div>
                        <div>
                            <span><i class='fontFamily myiconweizhi'></i>位置 <i>:</i></span>
                            <p>{{infoWindow.position}}</p>
                        </div>
                    </div>
                    <div class="tabBox" v-loading="loading">
                        <div id="lineBox" ref='myChart' v-show='!whoshow'></div>
                        <div id="sx_Map" v-show='whoshow'></div>
                        <div class="tabchangeIcon">
                            <div class="dateIcon">
                                <!--<i class="el-icon-date"></i>{{myDate}}-->
                                <el-date-picker
                                    v-model="myDate"
                                    type="date"
                                    value-format="timestamp"
                                    @change='dateChange'
                                    :clearable=false
                                    :default-value='defaultDate'>
                                </el-date-picker>
                            </div>
                            <p class="tireNb" v-show='!whoshow'><span>胎号:</span><i>8723592746</i></p>
                            <i class="fontFamily myiconicon-qihuan" @click='typeChange'></i>
                        </div>
                        <div class="tipInfo" v-show='tip'>{{tipInfo}}</div>
                    </div>
                </div>
                <div class='carBox1' v-if="infoWindow.type == 1">
                    <div class="tirebox">
                        <div :class="['tire',{'active':tires['2']['sn'] == ac?true:false}]"
                             v-show="tires['2']['sn'] == 2" @click="getlines(tires['2'])">
                            <span><i class='fontFamily myicondaqiyali'></i>{{tires['2']['pres']}}<em>Bar</em></span>
                            <span><i class='fontFamily myicontemperature'></i>{{tires['2']['temp']}}<em>℃</em></span>
                            <span><i class='fontFamily myicondianliang'></i>{{tires['2']['vol']}}v</span>
                        </div>
                        <div :class="['tire',{'active':tires['1']['sn'] == ac?true:false}]"
                             v-show="tires['1']['sn'] == 1" @click="getlines(tires['1'])">
                            <span><i class='fontFamily myicondaqiyali'></i>{{tires['1']['pres']}}<em>Bar</em></span>
                            <span><i class='fontFamily myicontemperature'></i>{{tires['1']['temp']}}<em>℃</em></span>
                            <span><i class='fontFamily myicondianliang'></i>{{tires['1']['vol']}}v</span>
                        </div>
                    </div>
                    <div class="tirebox">
                        <div :class="['tire',{'active':tires['4']['sn'] == ac?true:false}]"
                             v-show="tires['4']['sn'] == 4" @click="getlines(tires['4'])">
                            <span><i class='fontFamily myicondaqiyali'></i>{{tires['4']['pres']}}<em>Bar</em></span>
                            <span><i class='fontFamily myicontemperature'></i>{{tires['4']['temp']}}<em>℃</em></span>
                            <span><i class='fontFamily myicondianliang'></i>{{tires['4']['vol']}}v</span>
                        </div>
                        <div :class="['tire1',{'active':tires['5']['sn'] == ac?true:false}]"
                             v-show="tires['5']['sn'] == 5" @click="getlines(tires['5'])">
                            <span><i
                                class='fontFamily myicondaqiyali'></i>{{tires['5']['pres']?tires['5']['pres']:''}}<em>Bar</em></span>
                            <span><i class='fontFamily myicontemperature'></i>{{tires['5']['temp']}}<em>℃</em></span>
                            <span><i class='fontFamily myicondianliang'></i>{{tires['5']['vol']}}v</span>
                        </div>
                        <div :class="['tire',{'active':tires['3']['sn'] == ac?true:false}]"
                             v-show="tires['3']['sn'] == 3" @click="getlines(tires['3'])">
                            <span><i class='fontFamily myicondaqiyali'></i>{{tires['3']['pres']}}<em>Bar</em></span>
                            <span><i class='fontFamily myicontemperature'></i>{{tires['3']['temp']}}<em>℃</em></span>
                            <span><i class='fontFamily myicondianliang'></i>{{tires['3']['vol']}}v</span>
                        </div>
                    </div>
                </div>
                <div class="carBox2" v-else-if="infoWindow.type == 2 || infoWindow.type == 4 ">
                    <div class="tireBox">
                        <div class="tirebox">
                            <div class="tire" v-show='false'></div>
                            <div :class="['tire',{'active':tires['2']['sn'] == ac?true:false}]"
                                 v-show="tires['2']['sn'] == 2" @click="getlines(tires['2'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['2']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['2']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['2']['vol']}}v</span>
                            </div>
                        </div>
                        <div class="tirebox">
                            <div :class="['tire',{'active':tires['1']['sn'] == ac?true:false}]"
                                 v-show="tires['1']['sn'] == 1" @click="getlines(tires['1'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['1']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['1']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['1']['vol']}}v</span>
                            </div>
                            <div class="tire" v-show='false'></div>
                        </div>
                    </div>
                    <div class="tireBox">
                        <div class="tirebox">
                            <div class="tire" v-show='false'></div>
                            <div :class="['tire',{'active':tires['6']['sn'] == ac?true:false}]"
                                 v-show="tires['6']['sn'] == 6" @click="getlines(tires['6'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['6']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['6']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['6']['vol']}}v</span>
                            </div>
                        </div>
                        <div class="tirebox">
                            <div :class="['tire',{'active':tires['3']['sn'] == ac?true:false}]"
                                 v-show="tires['3']['sn'] == 3" @click="getlines(tires['3'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['3']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['3']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['3']['vol']}}v</span>
                            </div>
                            <div class="tire" v-show='false'></div>
                        </div>
                    </div>
                    <div class="tireBox">
                        <div class="tirebox">
                            <div :class="['tire',{'active':tires['10']['sn'] == ac?true:false}]"
                                 v-show="tires['10']['sn'] == 10" @click="getlines(tires['10'])">
                                <span><i
                                    class='fontFamily myicondaqiyali'></i>{{tires['10']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['10']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['10']['vol']}}v</span>
                            </div>
                            <div :class="['tire',{'active':tires['9']['sn'] == ac?true:false}]"
                                 v-show="tires['9']['sn'] == 9" @click="getlines(tires['9'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['9']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['9']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['9']['vol']}}v</span>
                            </div>
                        </div>
                        <div class="tirebox">
                            <div :class="['tire',{'active':tires['8']['sn'] == ac?true:false}]"
                                 v-show="tires['8']['sn'] == 8" @click="getlines(tires['8'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['8']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['8']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['8']['vol']}}v</span>
                            </div>
                            <div :class="['tire',{'active':tires['7']['sn'] == ac?true:false}]"
                                 v-show="tires['7']['sn'] == 7" @click="getlines(tires['7'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['7']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['7']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['7']['vol']}}v</span>
                            </div>
                        </div>
                    </div>
                    <div class="tireBox">
                        <div class="tirebox">
                            <div :class="['tire',{'active':tires['14']['sn'] == ac?true:false}]"
                                 v-show="tires['14']['sn'] == 14" @click="getlines(tires['14'])">
                                <span><i
                                    class='fontFamily myicondaqiyali'></i>{{tires['14']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['14']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['14']['vol']}}v</span>
                            </div>
                            <div :class="['tire',{'active':tires['13']['sn'] == ac?true:false}]"
                                 v-show="tires['13']['sn'] == 13" @click="getlines(tires['13'])">
                                <span><i
                                    class='fontFamily myicondaqiyali'></i>{{tires['13']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['13']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['13']['vol']}}v</span>
                            </div>
                        </div>
                        <div class="tire1">
                            <div :class="['tire2',{'active':tires['5']['sn'] == ac?true:false}]"
                                 v-show="tires['5']['sn'] == 5" @click="getlines(tires['5'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['5']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['5']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['5']['vol']}}v</span>
                            </div>
                        </div>
                        <div class="tirebox">
                            <div :class="['tire',{'active':tires['12']['sn'] == ac?true:false}]"
                                 v-show="tires['12']['sn'] == 12" @click="getlines(tires['12'])">
                                <span><i
                                    class='fontFamily myicondaqiyali'></i>{{tires['12']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['12']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['12']['vol']}}v</span>
                            </div>
                            <div :class="['tire',{'active':tires['11']['sn'] == ac?true:false}]"
                                 v-show="tires['11']['sn'] == 11" @click="getlines(tires['11'])">
                                <span><i
                                    class='fontFamily myicondaqiyali'></i>{{tires['11']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['11']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['11']['vol']}}v</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carBox3" v-else-if="infoWindow.type == 3">
                    <div class="tireBox">
                        <div class="tirebox">
                            <div :class="['tire',{'active':tires['4']['sn'] == ac?true:false}]"
                                 v-show="tires['4']['sn'] == 4" @click="getlines(tires['4'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['4']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['4']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['4']['vol']}}v</span>
                            </div>
                            <div :class="['tire',{'active':tires['3']['sn'] == ac?true:false}]"
                                 v-show="tires['3']['sn'] == 3" @click="getlines(tires['3'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['3']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['3']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['3']['vol']}}v</span>
                            </div>
                        </div>
                        <div class="tirebox">
                            <div :class="['tire',{'active':tires['2']['sn'] == ac?true:false}]"
                                 v-show="tires['2']['sn'] == 2" @click="getlines(tires['2'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['2']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['2']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['2']['vol']}}v</span>
                            </div>
                            <div :class="['tire',{'active':tires['1']['sn'] == ac?true:false}]"
                                 v-show="tires['1']['sn'] == 1" @click="getlines(tires['1'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['1']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['1']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['1']['vol']}}v</span>
                            </div>
                        </div>
                    </div>
                    <div class="tireBox">
                        <div class="tirebox">
                            <div :class="['tire',{'active':tires['8']['sn'] == ac?true:false}]"
                                 v-show="tires['8']['sn'] == 8" @click="getlines(tires['8'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['8']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['8']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['8']['vol']}}v</span>
                            </div>
                            <div :class="['tire',{'active':tires['7']['sn'] == ac?true:false}]"
                                 v-show="tires['7']['sn'] == 7" @click="getlines(tires['7'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['7']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['7']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['7']['vol']}}v</span>
                            </div>
                        </div>
                        <div class="tirebox">
                            <div :class="['tire',{'active':tires['6']['sn'] == ac?true:false}]"
                                 v-show="tires['6']['sn'] == 6" @click="getlines(tires['6'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['6']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['6']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['6']['vol']}}v</span>
                            </div>
                            <div :class="['tire',{'active':tires['5']['sn'] == ac?true:false}]"
                                 v-show="tires['5']['sn'] == 5" @click="getlines(tires['5'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['5']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['5']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['5']['vol']}}v</span>
                            </div>
                        </div>
                    </div>
                    <div class="tireBox">
                        <div class="tirebox">
                            <div :class="['tire',{'active':tires['12']['sn'] == ac?true:false}]"
                                 v-show="tires['12']['sn'] == 12" @click="getlines(tires['12'])">
                                <span><i
                                    class='fontFamily myicondaqiyali'></i>{{tires['12']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['12']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['12']['vol']}}v</span>
                            </div>
                            <div :class="['tire',{'active':tires['11']['sn'] == ac?true:false}]"
                                 v-show="tires['11']['sn'] == 11" @click="getlines(tires['11'])">
                                <span><i
                                    class='fontFamily myicondaqiyali'></i>{{tires['11']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['11']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['11']['vol']}}v</span>
                            </div>
                        </div>
                        <div class="tire1">
                            <div :class="['tire2',{'active':tires['15']['sn'] == ac?true:false}]"
                                 v-show="tires['15']['sn'] == 15" @click="getlines(tires['15'])">
                                <span><i
                                    class='fontFamily myicondaqiyali'></i>{{tires['15']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['15']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['15']['vol']}}v</span>
                            </div>
                        </div>
                        <div class="tirebox">
                            <div :class="['tire',{'active':tires['10']['sn'] == ac?true:false}]"
                                 v-show="tires['10']['sn'] == 10" @click="getlines(tires['10'])">
                                <span><i
                                    class='fontFamily myicondaqiyali'></i>{{tires['10']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['10']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['10']['vol']}}v</span>
                            </div>
                            <div :class="['tire',{'active':tires['9']['sn'] == ac?true:false}]"
                                 v-show="tires['9']['sn'] == 9" @click="getlines(tires['9'])">
                                <span><i class='fontFamily myicondaqiyali'></i>{{tires['9']['pres']}}<em>Bar</em></span>
                                <span><i
                                    class='fontFamily myicontemperature'></i>{{tires['9']['temp']}}<em>℃</em></span>
                                <span><i class='fontFamily myicondianliang'></i>{{tires['9']['vol']}}v</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else></div>
            </div>
        </div>
    </div>
</template>

<script>
    import MyOverlay from '../../../components/page/viewData/myoverlay'

    export default {
        name: 'monitor',
        data() {
            return {
                zoom: 7,
                deviceNb: '',
                options: '',
                extend: true,
                fullscreen: false,
                points: [],
                active: false,
                bdmap: "",//地图1
                myData: {},
                errData: {},
                mapHeight: 800,//地图初始化高度
                infoWindow: {
                    rid: '',
                    status: '',
                    time: '',
                    speed: '',
                    position: '',
                    type: ''
                },//车辆详情
                myKey: '',
                tires: {
                    1: {
                        sn: '',
                        pres: '',
                        temp: '',
                        vol: '',
                    },
                    2: {
                        sn: '',
                        pres: '',
                        temp: '',
                        vol: '',
                    },
                    3: {
                        sn: '',
                        pres: '',
                        temp: '',
                        vol: '',
                    },
                    4: {
                        sn: '',
                        pres: '',
                        temp: '',
                        vol: '',
                    },
                    5: {
                        sn: '',
                        pres: '',
                        temp: '',
                        vol: '',
                    },
                    6: {
                        sn: '',
                        pres: '',
                        temp: '',
                        vol: '',
                    },
                    7: {
                        sn: '',
                        pres: '',
                        temp: '',
                        vol: '',
                    },
                    8: {
                        sn: '',
                        pres: '',
                        temp: '',
                        vol: '',
                    },
                    9: {
                        sn: '',
                        pres: '',
                        temp: '',
                        vol: '',
                    },
                    10: {
                        sn: '',
                        pres: '',
                        temp: '',
                        vol: '',
                    },
                    11: {
                        sn: '',
                        pres: '',
                        temp: '',
                        vol: '',
                    },
                    12: {
                        sn: '',
                        pres: '',
                        temp: '',
                        vol: '',
                    },
                    13: {
                        sn: '',
                        pres: '',
                        temp: '',
                        vol: '',
                    },
                    14: {
                        sn: '',
                        pres: '',
                        temp: '',
                        vol: '',
                    },
                    15: {
                        sn: '',
                        pres: '',
                        temp: '',
                        vol: '',
                    },
                },
                //图表实例
                myPersChart: '',
                //温度胎压图表
                lineOptions: {
                    visualMap: [
                        {
                            show: false,
                            type: 'continuous',
                            seriesIndex: 0,
                            min: 0,
                            max: 400
                        },
                        {
                            show: false,
                            type: 'continuous',
                            seriesIndex: 1,
                            dimension: 0,
                            min: 0,
                            max: 400
                        }
                    ],
                    title: {
                        show: 'false'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: [
                        {
                            // name: '时间',
                            data: [],
                            boundaryGap: false
                        },
                        {
                            // name: '时间',
                            data: [],
                            gridIndex: 1,
                            boundaryGap: false
                        }
                    ],
                    yAxis: [
                        {
                            name: '胎压',
                            nameTextStyle: {
                                fontSize: 10,
                            }
                        },
                        {
                            name: '胎温',
                            gridIndex: 1,
                            nameTextStyle: {
                                fontSize: 10
                            }
                        }
                    ],
                    dataZoom: [
                        // {
                        //     startValue: '2014-06-01'
                        // },
                        // {
                        //     type: 'slider',
                        //     show:false
                        // },
                        // {
                        //     type: 'slider',
                        //     show:false
                        // }
                    ],
                    grid: [
                        {
                            // width:'100%',
                            height: 90,
                            top: 30,
                            left: 26,
                            tooltip: {
                                textStyle: {
                                    fontSize: 10
                                }
                            }
                        },
                        {
                            // width:'100%',
                            height: 90,
                            bottom: 20,
                            left: 26,
                            tooltip: {
                                textStyle: {
                                    fontSize: 10
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '压力',
                            type: 'line',
                            // showSymbol: false,
                            data: [],
                            lineStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: 'red' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: 'yellow' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                }
                            },

                        },
                        {
                            name: '温度',
                            type: 'line',
                            // showSymbol: false,
                            data: [],
                            lineStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: 'red' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: 'yellow' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                }
                            },
                            xAxisIndex: 1,
                            yAxisIndex: 1
                        },

                    ]
                },
                lineOption: {
                    visualMap: [
                        {
                            show: false,
                            type: 'continuous',
                            seriesIndex: 0,
                            min: 0,
                            max: 400
                        },
                        {
                            show: false,
                            type: 'continuous',
                            seriesIndex: 1,
                            dimension: 0,
                            min: 0,
                            max: 400
                        }
                    ],
                    title: {
                        show: 'false'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: [
                        {
                            // name: '时间',
                            data: [],
                            boundaryGap: false
                        },
                        {
                            // name: '时间',
                            data: [],
                            gridIndex: 1,
                            boundaryGap: false
                        }
                    ],
                    yAxis: [
                        {
                            name: '胎压',
                            nameTextStyle: {
                                fontSize: 10,
                            }
                        },
                        {
                            name: '胎温',
                            gridIndex: 1,
                            nameTextStyle: {
                                fontSize: 10
                            }
                        }
                    ],
                    dataZoom: [
                        // {
                        //     startValue: '2014-06-01'
                        // },
                        // {
                        //     type: 'slider',
                        //     show:false
                        // },
                        // {
                        //     type: 'slider',
                        //     show:false
                        // }
                    ],
                    grid: [
                        {
                            // width:'100%',
                            height: 90,
                            top: 30,
                            left: 26,
                            tooltip: {
                                textStyle: {
                                    fontSize: 10
                                }
                            }
                        },
                        {
                            // width:'100%',
                            height: 90,
                            bottom: 20,
                            left: 26,
                            tooltip: {
                                textStyle: {
                                    fontSize: 10
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '压力',
                            type: 'line',
                            // showSymbol: false,
                            data: [],
                            lineStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: 'red' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: 'yellow' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                }
                            },

                        },
                        {
                            name: '温度',
                            type: 'line',
                            // showSymbol: false,
                            data: [],
                            lineStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: 'red' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: 'yellow' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                }
                            },
                            xAxisIndex: 1,
                            yAxisIndex: 1
                        },

                    ]
                },
                //报警信息数据
                errorInfo: [],
                myDate: '',
                sxMap: '',//小地图
                whoshow: true,
                rid: '',
                sn: '',
                defaultDate: new Date(),
                loading: false,
                tipInfo: '提示信息',//提示信息
                tip: false,
                ac: '',
                searchLoading: false,
                errAc:'',
            }
        },
        components: {},
        mounted: function () {
            // this.addPoints();
            // this.draw();
            // this.getNowDate()
            this.myDate = this.defaultDate;
            this.getHeight();
            this.setBdMpa();
            // this.setSxMap();
            this.myPersChart = this.$echarts.init(this.$refs.myChart);
            this.myPersChart.setOption(this.lineOption)
            if ('WebSocket' in window) {
                this.initWebpack();
            } else {
                alert('当前浏览器 Not support websocket')
            }
        },
        computed: {},
        methods: {
            //获取日期整型
            getNowDate(t) {
                let myDate = new Date(t);
                let y = (myDate.getFullYear() + '').slice(2);
                let m = myDate.getMonth() + 1;
                let d = myDate.getDate();
                m = m < 10 ? '0' + m : m;
                d = d < 10 ? '0' + d : d;
                return y + '' + m + '' + d
            },
            //设置地图1
            setBdMpa() {
                this.bdmap = new BMap.Map("mo_map");// 创建Map实例
                // vm.bdmap.setMapStyle({style:'dark'})
                this.bdmap.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
                this.bdmap.enableScrollWheelZoom(true);
                this.getReceivergps();
            },
            //设置小地图
            setSxMap() {
                this.sxMap = new BMap.Map("sx_Map");
                this.sxMap.enableScrollWheelZoom(true);
                this.sxMap.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
            },
            //折叠
            changeExtend: function () {
                this.extend = this.extend ? false : true;
            },
            //全屏
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    (document.getElementById('mo_map')).style.height = (this.mywinHeight - 70) + 'px';
                    (document.getElementById('errBox')).style.maxHeight = (this.mywinHeight - 90) + 'px';
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    (document.getElementById('mo_map')).style.height = window.screen.height + 'px';
                    (document.getElementById('errBox')).style.maxHeight = (window.screen.height - 20) + 'px';
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            //getHeight
            getHeight() {
                let winHeight;
                if (window.innerWidth)
                    winHeight = window.innerHeight;
                else if ((document.body) && (document.body.clientHeight)) {
                    winHeight = document.body.clientHeight;
                }
                ;
                this.mywinHeight = winHeight;
                (document.getElementById('mo_map')).style.height = (this.mywinHeight - 70) + 'px';
                (document.getElementById('errBox')).style.maxHeight = (this.mywinHeight - 90) + 'px';
            },
            initWebpack() {//初始化websocket
                const wsuri = "ws://www.smartu365.com:9600/monitor";
                // const wsuri = "ws://frp.ttyuecai.com:10011/monitor";
                this.websock = new WebSocket(wsuri);//这里面的this都指向vue
                this.websock.onopen = this.websocketopen;
                this.websock.onsend = this.websocketsend;
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onclose = this.websocketclose;
                this.websock.onerror = this.websocketerror;
            },
            websocketopen() {//打开
                console.log("WebSocket1连接成功")
                let data = JSON.stringify({
                    action: 'register',
                    userid: sessionStorage.getItem('userid'),
                    accesstoken: sessionStorage.getItem('accesstoken'),
                    language: 'cn',
                    gpstype: 'bd'
                })
                this.websocketsend(data)
            },
            websocketsend(data) {//发送数据
                this.websock.send(data);
            },
            websocketonmessage(e) { //数据接收
                let vm = this;
                let newdata = JSON.parse(e.data);
                console.log(newdata);
                if ('errcode' in newdata) {
                    return false
                }
                if (newdata.action == 'gps') {
                    let marker = new BMap.Marker(new BMap.Point(newdata['lng'], newdata['lat']), {icon: new BMap.Icon("./static/img/point1.gif" + '?t=' + (+new Date()), new BMap.Size(40, 40))})
                    let xy = newdata.lat + ',' + newdata.lng;
                    let content = {
                        xy,
                        rid: newdata['rid'],
                        status: 1,
                        type: newdata['type'],
                    }
                    // vm.bdmap.centerAndZoom(new BMap.Point(newdata['lng'], newdata['lat']),17);
                    vm.delPoint(newdata['rid'], marker);//删除+增加
                    vm.addClickHandler(content, marker)
                } else if (newdata.action == 'alarm') {
                    vm.errorInfo.unshift(newdata);
                }
            },
            websocketclose() {  //关闭
                console.log("WebSocket1关闭");
            },
            websocketerror() {  //失败
                console.log("WebSocket1连接失败");
            },
            //接收所有接收器最新位置
            getReceivergps() {
                let vm = this;
                vm.$axios({
                    method: 'post',
                    url: window.$g_Api + '/api/data/receivergps',
                    data: {}
                }).then(function (res) {
                    if (res.data.errcode == 0) {
                        if (res.data.receivers.length > 0) {
                            let newarr = [];
                            let myObj = {}
                            for (let i = 0, len = res.data.receivers.length; i < len; i++) {
                                if (res.data.receivers[i]['lng'] != 0 && res.data.receivers[i]['lat'] != 0) {
                                    newarr.push(res.data.receivers[i])
                                    let marker = new BMap.Marker(new BMap.Point(res.data.receivers[i].lng, res.data.receivers[i].lat), {icon: new BMap.Icon("./static/img/point.gif", new BMap.Size(40, 40))})
                                    myObj[res.data.receivers[i]['rid']] = marker
                                    vm.bdmap.addOverlay(marker);
                                    let content = {
                                        status: res.data.receivers[i]['status'],
                                        xy: res.data.receivers[i].lat + ',' + res.data.receivers[i].lng,
                                        rid: res.data.receivers[i]['rid'],
                                        type: res.data.receivers[i]['type'],
                                    }
                                    vm.addClickHandler(content, marker)
                                    // lng: 122.09889999999992, lat: 30.61182788590724
                                }
                            }
                            ;
                            vm.myData = myObj;
                            vm.setMapcenter();
                        } else {
                            vm.bdmap.centerAndZoom('武汉', 5);
                            vm.$message.error('暂无定位信息');
                        }

                    } else {
                        vm.$message.error(res.data.error);
                    }
                })
                    .catch(function (err) {
                    });
            },
            //设置地图中心
            setMapcenter() {
                let vm = this;
                let pointArr = [];
                let pointArr1 = [];
                for (var key in vm.myData) {
                    pointArr.push(new BMap.Point(vm.myData[key]['point']['lng'], vm.myData[key]['point']['lat']))
                    pointArr1.push(vm.myData[key])
                }
                var v = vm.bdmap.getViewport(pointArr);
                vm.bdmap.centerAndZoom(v.center, v.zoom);
                new BMapLib.MarkerClusterer(vm.bdmap, {markers: pointArr1});
            },
            //获取单个点的数据
            getPointInfo(xy, rid) {
                let vm = this;
                let p1 = new Promise(function (resolve, reject) {
                    //做一些异步操作
                    vm.$axios({
                        method: 'get',
                        url: 'https://bird.ioliu.cn/v1/?url=http://api.map.baidu.com/geocoder/v2/?location=' + xy + '&output=json&pois=0&ak=aGf0sLjv7DOonc61fINdATGez2d3O8xB',
                    })
                        .then(function (res) {
                            resolve(res)
                        })
                        .catch(function (err) {
                            reject(err)
                        });
                });
                let p2 = new Promise(function (resolve, reject) {
                    //做一些异步操作
                    vm.$axios({
                        method: 'post',
                        url: window.$g_Api + '/api/data/laststatus',
                        data: {
                            receiver: rid
                        }
                    })
                        .then(function (res) {
                            if (res.data.errcode == 0) {
                                let lp = res.data.lp;
                                let arr = []
                                for (let i = 0, len = lp.length; i < len; i++) {
                                    if (lp[i]['temp'] != 0 || lp[i]['pres'] != 0) {
                                        arr.push(lp[i]);
                                    } else {
                                        continue
                                    }
                                }
                                res.data.lp = arr;
                            }
                            console.log(res.data.lp);
                            console.log(res);
                            resolve(res);
                        })
                        .catch(function (err) {
                            reject(err)
                        });
                });
                // let p3 = new Promise(function (resolve, reject) {
                //     //做一些异步操作
                //     vm.$axios({
                //         method: 'post',
                //         url: window.$g_Api + '/api/data/track',
                //         data: {
                //             receiver: rid,
                //             date: vm.getNowDate(vm.myDate),
                //         }
                //     })
                //         .then(function (res) {
                //             resolve(res)
                //         })
                //         .catch(function (err) {
                //             reject(err)
                //         });
                // });
                return Promise.all([p1, p2])
            },
            //坐标点击事件
            addClickHandler(content, marker) {
                let vm = this;
                marker.addEventListener("click", function (e) {
                        vm.whoshow = true;
                        vm.ac = '';
                        vm.myDate = vm.defaultDate;
                        vm.myPersChart.setOption(vm.lineOptions);
                        vm.rid = content.rid ? content.rid : '';
                        vm.getPointInfo(content.xy, content.rid)
                            .then((res) => {
                                let arr = res[1]['data']['lp'];
                                vm.tires = {
                                    1: {
                                        sn: '',
                                        pres: '',
                                        temp: '',
                                        vol: '',
                                    },
                                    2: {
                                        sn: '',
                                        pres: '',
                                        temp: '',
                                        vol: '',
                                    },
                                    3: {
                                        sn: '',
                                        pres: '',
                                        temp: '',
                                        vol: '',
                                    },
                                    4: {
                                        sn: '',
                                        pres: '',
                                        temp: '',
                                        vol: '',
                                    },
                                    5: {
                                        sn: '',
                                        pres: '',
                                        temp: '',
                                        vol: '',
                                    },
                                    6: {
                                        sn: '',
                                        pres: '',
                                        temp: '',
                                        vol: '',
                                    },
                                    7: {
                                        sn: '',
                                        pres: '',
                                        temp: '',
                                        vol: '',
                                    },
                                    8: {
                                        sn: '',
                                        pres: '',
                                        temp: '',
                                        vol: '',
                                    },
                                    9: {
                                        sn: '',
                                        pres: '',
                                        temp: '',
                                        vol: '',
                                    },
                                    10: {
                                        sn: '',
                                        pres: '',
                                        temp: '',
                                        vol: '',
                                    },
                                    11: {
                                        sn: '',
                                        pres: '',
                                        temp: '',
                                        vol: '',
                                    },
                                    12: {
                                        sn: '',
                                        pres: '',
                                        temp: '',
                                        vol: '',
                                    },
                                    13: {
                                        sn: '',
                                        pres: '',
                                        temp: '',
                                        vol: '',
                                    },
                                    14: {
                                        sn: '',
                                        pres: '',
                                        temp: '',
                                        vol: '',
                                    },
                                    15: {
                                        sn: '',
                                        pres: '',
                                        temp: '',
                                        vol: '',
                                    }
                                };
                                for (let i = 0, len = arr.length; i < len; i++) {
                                    arr[i].pres = arr[i].pres.toFixed(1);
                                    arr[i].temp = arr[i].temp.toFixed(0);
                                    arr[i].vol = arr[i].vol.toFixed(1);
                                    arr[i].sid = arr[i].sid ? arr[i].sid : '';
                                    arr[i].rid = content.rid ? content.rid : '';
                                    vm.tires[arr[i]['sn']] = arr[i];
                                    // vm.tires[arr[i]['sn']].pres = arr[i].pres;
                                    // vm.tires[arr[i]['sn']].temp = arr[i].temp;
                                    // vm.tires[arr[i]['sn']].vol = arr[i].vol;
                                }
                                content.position = res[0]['data']['result']['formatted_address'];
                                content.speed = (Math.round(res[1]['data']['ll']['speed'])) + '公里/小时';
                                content.time = vm.format(res[1]['data']['lt'] * 1000);
                                content.type = res[1]['data']['type'];
                                vm.openInfo(content, e)
                            })
                    }
                );
            },
            openInfo(content, e) {
                var p = e.target;
                var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                // this.setLine();
                this.infoWindow = content;
                var infoWindow = new BMap.InfoWindow(this.$refs.infoWindow, {
                    width:750,
                    height:650
                } );  // 创建信息窗口对象
                this.bdmap.openInfoWindow(infoWindow, point); //开启信息窗口
                this.setHistory();

            },
            //删除点
            delPoint(rid, marker) {
                let vm = this;
                var allOverlay = vm.bdmap.getOverlays();
                if (rid in vm.myData) {
                    vm.bdmap.removeOverlay(vm.myData[rid]);
                }
                marker.setTop(true);
                vm.bdmap.addOverlay(marker);
                vm.myData[rid] = marker;
            },
            //获取胎温胎压数据
            getlines(value) {
                // 基于准备好的dom，初始化echarts实例
                let vm = this;
                vm.whoshow = false;
                vm.loading = true;
                // if(!sid){
                //     vm.myPersChart.setOption(vm.lineOptions);
                //     return false
                // }
                let rid;
                let sn;
                if (value) {
                    rid = value.rid;
                    sn = value.sn;
                    vm.sn = sn
                } else {
                    if (!vm.sn) {
                        vm.loading = false;
                        vm.settipInfo('请先选择轮胎')
                        return false;
                    }
                    rid = vm.rid;
                    sn = vm.sn;
                }
                vm.tip = false;
                vm.ac = sn
                vm.$axios({
                    method: 'post',
                    url: window.$g_Api + '/api/data/sensordatahistory2',
                    data: {
                        // sensor: sid,
                        receiver: rid,
                        sn: sn,
                        date: vm.getNowDate(vm.myDate)
                    }
                })
                    .then(function (res) {
                        vm.loading = false;
                        let tyreData = {
                            time: [],
                            temp: [],
                            pres: []
                        };
                        if (res.data.errcode != 0 || res.data.datas.length < 1) {

                            [vm.lineOption.xAxis[0].data, vm.lineOption.xAxis[1].data] = [[], []];
                            [vm.lineOption.series[0].data, vm.lineOption.series[1].data] = [[], []];
                            console.log("kong");
                            vm.settipInfo(res.data.msg);
                            return false;
                        }
                        vm.tip = false;
                        let tiresData = res.data.datas;
                        let newtime, temp, pres;
                        for (let i = 0, len = tiresData.length; i < len; i++) {
                            if (tiresData[i].temp != 0 && tiresData[i].pres != 0) {
                                let hour = (tiresData[i].time / 10000).toFixed(0) > 9 ? (tiresData[i].time / 10000).toFixed(0) : '0' + (tiresData[i].time / 10000).toFixed(0);
                                let min = (tiresData[i].time % 10000 / 100).toFixed(0) > 9 ? (tiresData[i].time % 10000 / 100).toFixed(0) : '0' + (tiresData[i].time % 10000 / 100).toFixed(0);
                                let sec = (tiresData[i].time % 100).toFixed(0) > 9 ? (tiresData[i].time % 100).toFixed(0) : '0' + (tiresData[i].time % 100).toFixed(0)
                                newtime = hour + ':' + min + ':' + sec
                                tyreData.time.push(newtime);
                                tyreData.temp.push(tiresData[i].temp);
                                tyreData.pres.push((tiresData[i].pres).toFixed(1));
                            }
                        }
                        [vm.lineOption.xAxis[0].data, vm.lineOption.xAxis[1].data] = [tyreData.time, tyreData.time];
                        [vm.lineOption.series[0].data, vm.lineOption.series[1].data] = [tyreData.pres, tyreData.temp];
                        vm.myPersChart.setOption(vm.lineOption)
                    })
                    .catch(function (err) {
                    });

            },
            format(shijianchuo) {
                function add0(m) {
                    return m < 10 ? '0' + m : m
                }

                var time = new Date(shijianchuo);
                var y = time.getFullYear();
                var m = time.getMonth() + 1;
                var d = time.getDate();
                var h = time.getHours();
                var mm = time.getMinutes();
                var s = time.getSeconds();
                return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
            },
            //点击报警信息事件
            showerrInfo(rid,index) {
                this.errAc = index;
                // this.bdmap.centerAndZoom(this.myData[rid].point, 17);
                this.myData[rid].V.click();
            },
            //轨迹切换
            typeChange() {
                this.whoshow = this.whoshow ? false : true;
                if (this.whoshow) {
                    this.setHistory();
                } else {
                    this.getlines();
                }
            },
            //轨迹渲染
            setHistory() {
                let vm = this;
                vm.loading = true;
                vm.sxMap = new BMap.Map("sx_Map");
                vm.sxMap.enableScrollWheelZoom(true);
                vm.$axios({
                    method: 'post',
                    url: window.$g_Api + '/api/data/track',
                    data: {
                        receiver: vm.rid,
                        date: vm.getNowDate(vm.myDate),
                    }
                })
                    .then(function (res) {
                        vm.loading = false;
                        let tracks = res['data']['tracks']
                        vm.sxMap = new BMap.Map("sx_Map");
                        vm.sxMap.enableScrollWheelZoom(true);
                        // let tracks = res.data.tracks;
                        if (res.data.errcode != 0 || tracks.length < 1) {
                            vm.sxMap.centerAndZoom('深圳', 16);
                            vm.settipInfo('暂无该日数据');
                            return false
                        }
                        vm.tip = false;
                        let arrlist = []
                        for (let i = 0, len = tracks.length; i < len; i++) {
                            if (i != 0 && tracks[i]['lng'] == tracks[i - 1]['lng'] && tracks[i]['lat'] == tracks[i - 1]['lat']) {
                                continue;
                            } else {
                                arrlist.push(new BMap.Point(tracks[i]['lng'], tracks[i]['lat']))
                            }
                        }
                        ;
                        let v = vm.sxMap.getViewport(arrlist);
                        vm.sxMap.centerAndZoom(v.center, v.zoom);

                        function draw_line_direction(weight) {
                            let icons = new BMap.IconSequence(
                                new BMap.Symbol('M0 -5 L-5 -2 L0 -4 L5 -2 Z', {
                                    scale: weight / 10,
                                    strokeWeight: 1,
                                    rotation: 0,
                                    fillColor: 'white',
                                    fillOpacity: 1,
                                    strokeColor: 'white'
                                }), '100%', '3%', false);
                            return icons;
                        }

                        let polyline = new BMap.Polyline(arrlist, {
                            enableEditing: false,//是否启用线编辑，默认为false
                            enableClicking: true,//是否响应点击事件，默认为true
                            strokeColor: "#0075c7",
                            strokeWeight: '4',//折线的宽度，以像素为单位
                            strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
                            icons: [draw_line_direction(4)]
                            // icons: [icons]
                        });   //创建折线
                        let myIcon = new BMap.Icon('./static/img/qd.png', new BMap.Size(24, 32));
                        let myIcon1 = new BMap.Icon('./static/img/zd.png', new BMap.Size(24, 32));
                        let marker = new BMap.Marker(new BMap.Point(arrlist[0].lng, arrlist[0].lat), {icon: myIcon}); // 创建点
                        let marker1 = new BMap.Marker(new BMap.Point(arrlist[arrlist.length - 1].lng, arrlist[arrlist.length - 1].lat), {icon: myIcon1}); // 创建点
                        vm.sxMap.addOverlay(marker);
                        vm.sxMap.addOverlay(marker1);
                        vm.sxMap.addOverlay(polyline);          //增加折线
                    })
                    .catch(function (err) {
                        vm.sxMap.centerAndZoom('深圳', 16);
                    });
                // vm.sxMap.addEventListener("zoomend", function (evt) {
                //     vm.sxMap.addOverlay(vm.polyline);          //增加折线
                // });
            },
            //日期选择
            dateChange(val) {
                if (this.whoshow) {
                    this.setHistory();
                } else {
                    this.getlines();
                }
            },
            //提示信息
            settipInfo(msg) {
                let vm = this;
                vm.tip = true;
                vm.tipInfo = msg;
                // setTimeout(function () {
                //     vm.tip = false;
                // },3000)
            },
            //可选项
            remoteMethod(val) {
                if (val !== '') {
                    this.searchLoading = true;
                }
                setTimeout(() => {
                    let keyArr = []
                    for (var key in this.myData) {
                        keyArr.push(key);
                    }
                    ;
                    this.options = keyArr.filter(item => {
                        return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
                    });
                    this.searchLoading = false;
                }, 600)
            },
            //搜索
            search(val) {
                console.log(val);
                this.bdmap.centerAndZoom(this.myData[val].point, 19);
                this.myData[val].V.click();
            }
        },
    }

</script>


<style lang='scss'>
    .BMap_shadow {
        display: none !important;
    }

    .monitor {
        position: relative;
        #mo_map {
            width: 100%;
            min-height: 500px;
        }
        #errBox {
            width: 240px;
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 10px;
            border: 1px solid #97a8be;
            box-shadow: 3px 3px 10px #97a8be;
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 10px;
            overflow-x: hidden;
            display: flex;
            justify-content: flex-start;
            z-index: 999999;
            .errbox {
                width: 260px;
                margin-right: -20px;
                overflow-y: auto;
            }
            p {
                height: 24px;
                overflow: hidden;
                font-size: 14px;
                cursor: pointer;
                margin-bottom: 10px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                /*background-color: rgba(255,255,255,0.7);*/
                /*border-radius: 10px;*/
                /*border: 1px solid #97a8be;*/
                /*box-shadow: 3px 3px 10px #97a8be;*/
                transition: all 0.5s;
                span {
                    line-height: 24px;
                    padding-left: 20px;
                }
                span.title {
                    font-size: 16px;
                    padding: 0;
                    margin-bottom: 4px;
                    i {
                        margin-right: 6px;
                    }
                }
                /*&:nth-child(1) {*/
                    /*height: 100px;*/
                /*}*/
                &:hover {
                    cursor: pointer;
                    /*height: 100px;*/
                }
            }
            p.active{
                height: auto;
            }
            .errType0 {
                color: rgba(255, 0, 0, 0.8);
                color: #666666;
                border-bottom: 1px solid #ff0000;
                span.title {
                    color: #ff0000;
                }
            }
            .errType1 {
                color: rgba(255, 128, 0, 0.8);
                color: #666666;
                border-bottom: 1px solid #ff6100;
                span.title {
                    color: #ff6100;
                }
            }
            .errType2 {
                color: rgba(255, 128, 0, 0.8);
                color: #666666;
                border-bottom: 1px solid #ffd700;
                span.title {
                    color: #ffd700;
                }
            }
        }
        .mo_search_box {
            height: 32px;
            line-height: 32px;
            position: absolute;
            top: 8px;
            left: 8px;
            display: flex;
            justify-content: flex-start;
            .mo_searchinput {
                width: 204px;
                transition: all 0.3s;
                overflow: hidden;
                .el-input__inner {
                    border-radius: 0px 4px 4px 0px;
                    outline: none;
                }
            }
            .mo_searchinput1 {
                width: 0px;
            }
            .extend {
                display: block;
                height: 100%;
                width: 16px;
                background-color: #cccccc;
                border-radius: 4px 0px 0px 4px;
                &:hover {
                    cursor: pointer;
                }
                i {
                    color: #ffffff;
                }
                &:hover {
                    cursor: pointer;
                }
            }
            .el-icon-search {
                &:hover {
                    cursor: pointer;
                }
            }
            .fullscreen {
                transform: rotate(45deg);
                font-size: 32px;
                color: #409EFF;
                margin: 0 100px 0 20px;
                &:hover {
                    cursor: pointer;
                }
            }
        }
        .infoWindow {
            width: 730px;
            height: 520px;
            font-size: 14px;
            color: #7a7a7a;
            display: flex;
            overflow: hidden;
            justify-content: space-between;
            .infoText {
                width: 370px;
                /*flex:1;*/
                height: auto;
                line-height: 24px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding-right: 20px;
                div.textbox {
                    width: 100%;
                    height: 220px;
                    div {
                        width: 100%;
                        display: flex;
                        justify-content: flex-start;
                        flex-wrap: nowrap;
                        span {
                            display: block;
                            width: 90px;
                            color: #333333;
                            padding-right: 8px;
                            i {
                                font-style: normal;
                                margin-right: 6px;
                            }
                        }
                        p {
                            flex: 1;
                            word-wrap: break-word;
                        }
                    }
                }
                .tabBox {
                    width: 350px;
                    height: 290px;
                    position: relative;
                    div#lineBox {
                        width: 350px;
                        height: 290px;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                    }
                    div#sx_Map {
                        width: 350px;
                        height: 290px;
                    }
                    .tabchangeIcon {
                        width: 350px;
                        position: absolute;
                        top: -22px;
                        right: 0;
                        display: flex;
                        justify-content: space-between;
                        padding-left: 0px;
                        .dateIcon {
                            color: #409EFF;
                            .el-input {
                                width: 100px;
                                overflow-x: visible;
                                &:hover {
                                    cursor: pointer;
                                }
                            }
                            .el-input__inner {
                                height: 20px;
                                line-height: 20px;
                                border: none;
                                color: #409EFF;
                                padding-right: 0px;
                                background-color: transparent !important;
                            }
                            .el-date-editor--date {
                                margin-left: -10px;
                            }
                            .el-input__icon {
                                color: #409EFF;
                                height: 20px;
                                line-height: 20px;
                            }
                            /*i {*/
                            /*margin-right: 4px;*/
                            /*}*/
                        }
                        .tireNb {
                            font-size: 14px;
                            color: #E6A23C;
                            /*i{*/
                            /*color: #E6A23C;*/
                            /*margin-left: 4px;*/
                            /*}*/
                        }
                        .myiconicon-qihuan {
                            color: #409EFF;
                            float: right;
                            &:hover {
                                cursor: pointer;
                            }
                        }
                    }
                    .tipInfo {
                        width: 120px;
                        height: 32px;
                        line-height: 32px;
                        background-color: #E6A23C;
                        color: #ffffff;
                        font-size: 14px;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        margin-top: -26px;
                        margin-left: -60px;
                        text-align: center;
                        border-radius: 8px;
                    }
                }

            }
            .active {
                border: 1px solid #409EFF !important;
                background-color: rgba(64, 158, 255, 0.1);
            }
            .carBox1 {
                width: 360px;
                height: 520px;
                background: url("../../../../static/img/mcar.png") no-repeat center 100%;
                background-position-y: -30px;
                padding: 80px 40px 100px 40px;
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                .tirebox {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    sub {
                        font-size: 6px;
                    }
                    em {
                        font-size: 6px;
                    }
                    i {
                        font-size: 12px;
                    }
                    .tire, .tire1 {
                        width: 60px;
                        height: 80px;
                        border-radius: 20px;
                        border: 1px solid #7a7a7a;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        text-align: center;
                        font-size: 12px;
                        span {
                            text-align: left;
                        }
                        &:hover {
                            cursor: pointer;
                        }

                    }
                    .tire {
                        padding: 8px 0px 8px 3px !important;
                    }
                    .tire1 {
                        width: 80px;
                        height: 60px;
                        margin-top: 100px;
                    }
                }
            }
            .carBox2, .carBox3 {
                width: 360px;
                height: 520px;
                background: url("../../../../static/img/bcar.png") no-repeat center 100%;
                background-position-y: -100px;
                padding: 50px 0px 50px 0px;
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                .tireBox {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    .tirebox {
                        width: 124px;
                        display: flex;
                        justify-content: space-between;
                        position: relative;
                        sub {
                            font-size: 6px;
                        }
                        em {
                            font-size: 6px;
                        }
                        i {
                            font-size: 12px;
                        }
                        .tire {
                            width: 60px;
                            height: 80px;
                            border-radius: 20px;
                            border: 1px solid #7a7a7a;
                            position: absolute;
                            top: 0;
                            left: 0;
                            text-align: center;
                            padding: 8px 0px 8px 4px;
                            font-size: 12px;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            &:hover {
                                cursor: pointer;
                            }
                            span {
                                text-align: left;
                            }
                            &:nth-child(2) {
                                position: absolute;
                                top: 0;
                                left: 64px;
                            }
                        }
                    }
                    .tire1 {
                        position: relative;
                        width: 80px;
                        height: 60px;
                        font-size: 12px;
                        .tire2 {
                            position: absolute;
                            top: 40px;
                            width: 80px;
                            height: 60px;
                            border-radius: 20px;
                            border: 1px solid #7a7a7a;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            padding: 4px 14px 0px 14px !important;
                            text-align: center;
                            span {
                                text-align: left !important;
                            }
                            &:hover {
                                cursor: pointer;
                            }
                            i {
                                margin-right: 2px;
                            }
                        }

                    }
                }

            }
            .carBox3 {
                background: url("../../../../static/img/gcar.png") no-repeat center 100%;
                padding: 100px 0px 80px 0px;
                .tire2 {
                    top: 80px !important;
                }
            }
            .carOc {
            }
        }

    }

    .monitor1 {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
    }
</style>
