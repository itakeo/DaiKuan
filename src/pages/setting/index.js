import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import Ajax from '../../util/ajax.js'
export default class Setting extends Component {
    state = {
        formInfo :'',
        showDialog : 0
    }
    config = {
        navigationBarTitleText: '设置'
    }
    showDialog=()=>{
        this.setState({
            showDialog : 1
        })
    }
    closeDialog=()=>{
        this.setState({
            showDialog : 0
        })
    }
    goAbout=()=>{
        Taro.navigateTo({
            url: '/pages/about/index'
        })   
    }
    componentWillMount () { }
    componentDidMount () {
        Ajax('/api_v1/Common/getPlatforminfo').then(res=>{
            if(res.status==1) {
                this.setState({
                    formInfo : res.data
                })
            }
            console.log('版本',res.data)
        })
    }
    logOutFn = ()=>{
        Taro.removeStorageSync('userInfo');
        Taro.showToast({
            title: '退出成功',
            icon: 'none',
            duration: 1500
        }).then(res=>{
            setTimeout(res=>{
                Taro.navigateTo({
                    url: '/pages/index/index'
                }) 
            },2000)
        })
    }
    render () {
        return (
            <View className='wrap'>
                
                <a href="javascript:;" onClick={this.goAbout} className="user_cell rec">
                    关于我们
                </a>
                <a href="javascript:;"  onClick={this.showDialog}  className="user_cell rec">
                    商务合作
                </a>

                <a href="javascript:;" onClick={this.logOutFn} className="user_cell user_cell2">安全退出</a>
                <div className={(this.state.showDialog ? 'show' : '')+" aboutDialog"} id="aboutDialog">
                    <div className="aboutDialogCon">
                        <p>商务合作联系方式</p>
                        <span>邮箱：{this.state.formInfo.cooperation}</span>
                        <a href="javascript:;"  onClick={this.closeDialog}>确定</a>
                    </div>
                </div>
            </View>
        )
    }
}
