import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem } from '@tarojs/components'
import TabNav from '../tab/index.js'
import Ajax from '../../util/ajax.js'
import './index.css'
export default class Index3 extends Component {
    state = {
        bannerImg : [],
        dataArr : []
    }

    config = {
        navigationBarTitleText: '必下款'
    }
    selectChange=(e)=>{
        this.setState({
            [e.target.dataset.name+'Index'] : e.target.value
        })
        console.log(e.target.value)
    }
    componentWillMount () { }
    componentDidMount () { 
        Ajax('/api_v1/loan/getloanCarparty').then(res=>{
            this.setState({
                bannerImg : res.data || []
            })
        });
        this.getProductListFn()
    }
    getProductListFn=()=>{
        Ajax('/api_v1/loan/getProductList',{
            type : 1,
            sort :  0,
            keyword : '',
            loan_range : 0,
            loan_duration : 0,
            pagenum : 1,
            pagesize : 999
        }).then(res=>{
            console.log('dataArr', res)
            if(res.status==1) {
                this.setState({
                    dataArr : res.data || []
                })
            }else if(res.status==0){
                this.setState({
                    dataArr : []
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
                <Swiper className="homeBanner" indicatorDots indicatorActiveColor="#fff">
                    {
                        this.state.bannerImg.map(res=>{
                            return (
                                <SwiperItem>
                                    <img src={res.image} alt=""/>
                                </SwiperItem>
                            )
                        })
                    }
                </Swiper>
                <div className="topListBox">
                    <img src={require("../../images/top.png")} alt="" />
                </div>
                <div className="eachBox">
                {
                    this.state.dataArr.length==0 ? <p className="noDateTip">暂无数据...</p> : 
                    this.state.dataArr.map((res,index)=>{
                        return (
                            <div className="eachItem"  key={res.id}>
                                <div className="eachItemTop" flex>
                                    <div className="leftIcon">
                                        {index < 3 ? <img src={require(`../../images/NO_${index+1}.png`)} className="No_img" alt="" /> : ''}
                                        
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
