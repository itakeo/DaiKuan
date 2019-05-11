import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem } from '@tarojs/components'
import Ajax from '../../util/ajax.js'
export default class SearchEnd extends Component {
    state = {
        dataArr : [],
        noData : 0
    }
    config = {
        navigationBarTitleText: '搜索结果'
    }
    componentDidMount () { 
        this.getProductListFn()
    }
    getProductListFn=()=>{
        Ajax('/api_v1/loan/getProductList',{
            type : 0,
            sort : 0,
            keyword : decodeURI(this.$router.params.search) || '',
            loan_range : 0,
            loan_duration : 0,
            pagenum : 1,
            pagesize : 999
        }).then(res=>{
            console.log('dataArr', res)
            if(res.status==1) {
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
                    搜索结果
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
            </View>
        )
    }
}
