import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import Ajax from '../../util/ajax.js'
export default class History extends Component {
    state = {
        listArr : [],
        noData : 0,
        hotProductList : []
    }
    config = {
        navigationBarTitleText: '申请历史'
    }
    componentWillMount () { }
    componentDidMount () { 
        let _userInfo = Taro.getStorageSync('userInfo')
        Ajax('/api_v1/loan/getApplyLog',{
            uid : _userInfo.id,
            pagenum : 1,
            pagesize : 999
        }).then(res=>{
            if(res.status==1) {
                this.setState({
                    listArr : res.data || []
                })
            }else if(res.status==0){
                this.setState({
                    listArr : [],
                    noData : 1
                })
            }
            console.log(res)
        });


        Ajax('/api_v1/loan/getHotProductList').then(res=>{
            if(res.status==1) {
                this.setState({
                    hotProductList : res.data || []
                })
            }else if(res.status==0){
                this.setState({
                    hotProductList : [],
                })
            }
            console.log('热门推荐',res)
        })
        
    }
    goAllList=()=>{
        Taro.navigateTo({
            url: '/pages/index/index'
        })
    }
    applyLoanFn=(e)=>{
        let _userInfo = Taro.getStorageSync('userInfo')
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
                {
                    this.state.noData ? (
                        <div className="no_pro">
                            <img src={require("../../images/zanwudingdan.png")} alt="" />
                            <p>您还没有订单哦～</p>
                            <a href="javascript:;" onClick={this.goAllList}>马上去贷款</a>
                        </div>
                    ) : (
                        <div class="Apply_his">
                            {
                                this.state.listArr.map(res=>{
                                    return (
                                        <a href={res.url} class="listCell" flex>
                                            <div class="leftIcon">
                                                <img src={res.image} alt=""/>
                                            </div>
                                            <div class="flex1" box="1">
                                                <p>{res.title}</p>
                                                <span>{res.apply_time}</span>
                                            </div>
                                        </a>
                                    )
                                })
                            }
                        </div> 
                    )
                }
                   

                


                <div className="tjTitle">
                    <span>推荐贷款</span>
                </div>
                <div className="eachBox eachBox2">
                    {
                        this.state.hotProductList.map(res=>{
                            return (
                                <div className="eachItem">
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
