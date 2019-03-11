const vfilter = {
    setSub: function (a) {
        if(a[1]){
            let b = a[0] - a[1];
            let c = (b / a[1] *100).toFixed(2);
            return c+'%';
        }else {
            return ''
        }
    },
    setSub1: function (a) {
        if(a[1]){
            var r1,r2,m,n;
            try{r1=a[0].toString().split(".")[1].length}catch(e){r1=0}
            try{r2=a[1].toString().split(".")[1].length}catch(e){r2=0}
            m=Math.pow(10,Math.max(r1,r2));
            //动态控制精度长度
            n=(r1=r2)?r1:r2;
            return ((a[0]*m-a[1]*m)/m).toFixed(n);

        }else {
            return '';
        }
    },
    getName: function (name) {
        return (name.split('_'))[0];
    },
    sq: function (val) {
        return val?val:'未授权'
    },
    getType(type){
        let s ;
        switch (type) {
            case 1 : s='小车';
                break;
            case 2 : s = '大车';
                break;
            case 3 : s = '挂车';
                break;
            case 4 : s = '车头';
                break;
        }
        return s
    },
    getStatus(status){
        let s ;
        switch (status) {
            case 0 : s='未激活';
                break;
            case 1 : s = '在线';
                break;
            case -1 : s = '离线';
                break;
        }
        return s
    },  //时间戳转换
    //整型转时间格式
    getDateType(d){
        d = d+'';
        let year = 20+''+d.slice(0,2)
        let month = d.slice(2,4)
        let day = d.slice(4,6)
        let hour = d.slice(6,8)
        let min = d.slice(8,10)
        let sec = d.slice(10,12)
        return year+'年'+month+'月'+day+'日'+hour+':'+min+':'+sec
    },
    geterrType(val){
        let type;
        switch (val) {
            case 1:type='急漏气';
                break;
            case 2:type='慢漏气';
                break;
            case 3:type='温度高';
                break;
            case 4:type='气压高';
                break;
            case 5:type='气压低';
                break;
            case 6:type='发射器失联';
                break;
            case 7:type='发射器电池电压低';
                break;
            default:type ='未知错误'
        };
        return type
    }
};
export default vfilter;
