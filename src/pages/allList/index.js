import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem } from '@tarojs/components'
import TabNav from '../tab/index.js'
import Ajax from '../../util/ajax.js'
export default class AllList extends Component {
    state = {
        size : ['不限','1千-3千','3千-5千','5千-8千','8千-1万','1万-10万'],
        time : ['不限','7-14天','14-30天','1-3个月','3-6个月','6-12个月','12月以上'],
        sort : ['不限','按额度','放款速度','最新产品','利率'],
        sizeIndex : null,
        timeIndex : null,
        sortIndex : null,
        dataArr : [],
        noData : 0
    }
    config = {
        navigationBarTitleText: '贷款大全'
    }
    selectChange=(e)=>{
        this.setState({
            [e.target.dataset.name+'Index'] : e.target.value
        },res=>{
            this.getProductListFn()
        });
        console.log(e.target.value)
    }
    componentDidMount () { 
        this.getProductListFn()
    }
    getProductListFn=()=>{
        Ajax('/api_v1/loan/getProductList',{
            type : 0,
            sort : this.state.sortIndex || 0,
            keyword : '',
            loan_range : this.state.sizeIndex || 0,
            loan_duration : this.state.timeIndex || 0,
            pagenum : 1,
            pagesize : 999
        }).then(res=>{
            
            if(res.status==1) {
                console.log('dataArr', res)
                this.setState({
                    dataArr : res.data || [],
                    noData : 0
                })
            }else if(res.status==0){
                this.setState({
                    dataArr : [],
                    noData : 1
                })
            }
        })
    }
    goSeach=()=>{
        Taro.navigateTo({
            url: '/pages/search/index'
        }) 
    }
    applyLoanFn=(e)=>{
        let _userInfo = Taro.getStorageSync('userInfo');
        if(!_userInfo.id){
            window.location.href= e.target.dataset.url
            return;
        }
        Ajax('/api_v1/loan/applyLoan',{
            uid : _userInfo.id,
            product_id : e.target.dataset.id
        }).then(res=>{
            if(res.status==1) {
                window.location.href= e.target.dataset.url
            }else if(res.status==0){
                Taro.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500
                })
            }
            console.log('点击申请',res)
        })
    }
    render () {
        return (
            <View className='wrap'>
                <div className="navBar">
                    贷款大全
                    <a href="javascript:;" onClick={this.goSeach} className="searchIcon"></a>
                </div>

                <div className="setSearchBox" flex>
                    <div className="select1" box="1">
                        <label id="label_1">{this.state.size[this.state.sizeIndex] || '额度'}</label>
                        <select name="" id="" data-name="size" onChange={this.selectChange}>
                            <option value="" disabled selected>请选择额度</option>
                            {
                                this.state.size.map((res,index)=>{
                                    return <option value={index}>{res}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="select1" box="1">
                        <label id="label_2">{this.state.time[this.state.timeIndex] || '期限'}</label>
                        <select name="" id=""  data-name="time"  onChange={this.selectChange}>
                            <option value="" disabled selected>请选择期限</option>
                            {
                                this.state.time.map((res,index)=>{
                                    return <option value={index}>{res}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="select1" box="1">
                        <label id="label_3">{this.state.sort[this.state.sortIndex] || '默认排序'}</label>
                        <select name="" id=""  data-name="sort"  onChange={this.selectChange}>
                            <option value="" disabled selected>请选择排序</option>
                            {
                                this.state.sort.map((res,index)=>{
                                    return <option value={index}>{res}</option>
                                })
                            }
                        </select>
                    </div>
                </div>

                <div className="eachBox" style="padding-top: .34rem;">
                {
                    this.state.noData ? <p className="noDateTip">暂无数据...</p> : 
                    this.state.dataArr.map(res=>{
                        return (
                            <div className="eachItem"  key={res.id}>
                                <div className="eachItemTop" flex>
                                    <div className="leftIcon">
                                        <img src={res.image} alt=""/>
                                    </div>
                                    <div className="flex1" box="1">
                                        <p>{res.title}</p>
                                        <span>{res.desc}</span>
                                    </div>
                                    <div className="tips">
                                        <span>{res.number}</span>人今日申请
                                    </div>
                                </div>
                                <div className="eachItemInfo" flex>
                                    <div box="1">
                                        <p>额度范围(元)</p>
                                        <span style="color:#FE5335">{res.apply_price}</span>
                                    </div>
                                    <div box="1">
                                        <p>日利率(%)</p>
                                        <span>{res.day_rate}</span>
                                    </div>
                                    <div box="1">
                                        <p>放款时间</p>
                                        <span>{res.apply_duration}</span>
                                    </div>
                                    <div>
                                        <a href='javascript:;' data-id={res.id} onClick={this.applyLoanFn} data-url={res.url} className="ApplyBtn">申请</a>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                </div>



                <TabNav/>
            </View>
        )
    }
}
