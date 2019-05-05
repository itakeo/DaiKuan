import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import Ajax from '../../util/ajax.js'
function checkPhone(str){
    if(!(/^1(3|4|5|7|8|9|6)\d{9}$/.test(str))){
        return false
    }else{
        return true
    }
}
export default class FeedBack extends Component {
    state = {
        phone : '',
        txt: ''
    }
    config = {
        navigationBarTitleText: '意见反馈'
    }
    componentWillMount () { }
    componentDidMount () { }
    bindInputFn = (e)=>{
        this.setState({
            [e.target.dataset.type] : e.target.value
        },res=>{
            console.log(this.state.phone,this.state.txt)
        })
    }
    sendFn = (e)=>{
        if(this.state.txt.trim() == ''){
            Taro.showToast({
                title: '请输入点内容',
                icon: 'none',
                duration: 1500
            })
            return;
        }
        if(!checkPhone(this.state.phone)){
            Taro.showToast({
                title: '手机号不正确',
                icon: 'none',
                duration: 1500
            })
            return;
        }
        let _userInfo = Taro.getStorageSync('userInfo');
        console.log('user',_userInfo)
        Ajax('/api_v1/user/sendSms',{
            uid : _userInfo.id,
            message : this.state.txt,
            mobile : this.state.phone
        }).then(res=>{
            if(res.status == 1){
                Taro.showToast({
                    title: '提交成功',
                    icon: 'none',
                    duration: 1500
                }).then(res=>{
                    setTimeout(res=>{
                        Taro.navigateBack({ delta: 1 })
                    },2000)
                });

            }else if(res.status == 0){
                Taro.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500
                })
            }
            console.log(res)
        })
    }
    render () {
        return (
            <View className='wrap'>
                
                <p style="padding:.24rem .3rem;font-size: .26rem;color: #AEAEAE;">您对我们有什么意见吗？</p>
                <div className="textareaBox">
                    <textarea name="" data-type="txt" onInput = {this.bindInputFn} id="" cols="30" rows="10" placeholder="请输入您的意见和反馈"></textarea>
                </div>
                <div className="phoneBox" flex>
                    <span>联系方式(必填)</span><input data-type="phone" onInput = {this.bindInputFn}  box="1" type="text" placeholder="请输入您的联系方式" />
                </div>
                <button className="fedSubBtn" onClick={this.sendFn}>提交意见</button>

            </View>
        )
    }
}
