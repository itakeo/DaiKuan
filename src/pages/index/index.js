import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem } from '@tarojs/components'
import TabNav from '../tab/index.js'
import Ajax from '../../util/ajax.js'

export default class Index extends Component {
    state = {
        bannerImg : [],
        LoanListArr : [],
        newsArr : [],
        dataArr : [],
        productList : []
    }
    config = {
        navigationBarTitleText: '首页',
    }

    componentWillMount () { }

    componentDidMount () {
        this.getLoanListFn();
        Ajax('/api_v1/loan/index').then(res=>{
            if(res.status==1) {
                this.setState({
                    bannerImg : res.data.banner || [],
                    newsArr : res.data.notice_array || [],
                    dataArr : res.data.data || []
                })
                console.log('dataInfo', res.data)
            }
        });

        Ajax('/api_v1/Common/getRecProductList').then(res=>{
            if(res.status==1) {
                this.setState({
                    productList : res.data || []
                });
                console.log('getRecProductList', res.data)
            }
        })
    }
    getLoanListFn=()=>{
        Ajax('/api_v1/loan/getLoanList').then(res=>{
            if(res.status==1) {
                this.setState({
                    LoanListArr : res.data || []
                })
                console.log('getLoanList', res.data)
            }
        })
    }
    goAllList=()=>{
        Taro.navigateTo({
            url: '/pages/allList/index?tab=1'
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
                                <SwiperItem  key={res.id}>
                                    <img src={res.image} alt=""/>
                                </SwiperItem>
                            )
                        })
                    }
                </Swiper>


                <div className="homeTabIcon" flex>
                    {
                        this.state.productList.map(res=>{
                            return (
                                <a href={res.url} key={res.id} box="1" className="tabicons">
                                    <img src={res.image} alt=""/>
                                    <p>{res.title}</p>
                                </a>
                            )
                        })
                    }
                </div>

                <div className="newsScroll">
                    <div className="newScrollBox">
                        <Swiper className="newsSwiper" circular autoplay vertical interval="3000">
                            {
                                this.state.newsArr.map(res=>{
                                    return (
                                        <SwiperItem className="dot"  key={res.id}>
                                            {res}
                                        </SwiperItem>
                                    )
                                })
                            }
                        </Swiper>
                    </div>
                </div>

                <div className="titleBox" style="border-bottom: 1px solid #E6E6E6">
                    经统计，同时申请以下4家，下款率达<span>90%</span>
                    <a href="javascript:;" onClick={this.getLoanListFn}  className="titleBtn">换一批</a>
                </div>

                <div className="homeTabIcon mb22" flex>
                    {
                        this.state.LoanListArr.map(res=>{
                            return (
                                <a href="javascript:;" box="1"  key={res.id} className="tabicons">
                                    <img src={res.image} alt=""/>
                                    <p>{res.title}</p>
                                </a>
                            )
                        })
                    }
                </div>
                <div className="titleBox">
                    推荐贷款
                    <a href="javascript:;" onClick={this.goAllList}  className="titleBtn">更多>></a>
                </div>


                <div className="eachBox">
                    {
                        this.state.dataArr.map(res=>{
                            return (
                                <div className="eachItem" key={res.id}>
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
                                            <span style="color:#FE5335">1000-20000元</span>
                                        </div>
                                        <div box="1">
                                            <p>日利率(%)</p>
                                            <span>0.03</span>
                                        </div>
                                        <div box="1">
                                            <p>放款时间</p>
                                            <span>24小时</span>
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

                <TabNav />
            </View>
        )
    }
}
