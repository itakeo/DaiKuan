import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import CountDown from '../../util/CountDown.js'
import Ajax from '../../util/ajax.js'
function checkPhone(str){
    if(!(/^1(3|4|5|7|8|9|6)\d{9}$/.test(str))){
        return false
    }else{
        return true
    }
}
export default class Login extends Component {
    state = {
        off : 1,
        times : '获取验证码',
        phone : '',
        code : '',
        sendCode : ''
    }
    config = {
        navigationBarTitleText: '登录'
    }
    componentWillMount () { }
    componentDidMount () { 
    }
    getCode=()=>{
       
        if(!checkPhone(this.state.phone)){
            Taro.showToast({
                title: '手机号不正确',
                icon: 'none',
                duration: 1500
            })
            return;
        }
        if(!this.state.off) return;
        Ajax('/api_v1/user/sendSms',{
            mobile : this.state.phone
        }).then(res=>{
            console.log('sendSms', res)
            if(res.status==1) {
                Taro.showToast({
                    title: '发送成功',
                    icon: 'none',
                    duration: 1500
                })
                // this.setState({
                //     sendCode : ''
                // });
            }else if(res.status == 0){
                Taro.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500
                })
                return;
            }
        });
        new CountDown(59000).run(res=>{
            this.setState({
                off : 0,
                times :res.sec +'秒'
            })
        }).end(res=>{
            this.setState({
                off : 1,
                times :'获取验证码'
            })
        })


    }
    bindInput=(e)=>{
        this.setState({
            [e.target.dataset.type] : e.target.value
        },res=>{
            console.log(this.state)
        });
    }
    loginFn=(e)=>{
        if(!checkPhone(this.state.phone)){
            Taro.showToast({
                title: '手机号不正确',
                icon: 'none',
                duration: 1500
            })
            return;
        }
        if(this.state.code.length==0){
            Taro.showToast({
                title: '验证码不正确',
                icon: 'none',
                duration: 1500
            })
            return;
        }
        Ajax('/api_v1/user/login',{
            mobile : this.state.phone,
            code : this.state.code,
            channel : '',
            area : ''
        }).then(res=>{
            if(res.status==1) {
                console.log('userInfo', res.data);
                Taro.setStorageSync('userInfo', res.data)
                Taro.navigateTo({
                    url: '/pages/user/index?tab=3'
                })  
            }else if(res.status == 0){
                Taro.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500
                })
                return;
            }
        })
    }
    render () {
        return (
            <View className='wrap'>
                <div className="navBar">
                    登录
                </div>
                <img src={require("../../images/zhuce_banner.png")} width="100%" className="loginImg" alt=""/>
                <div class="loginBox">
                    <div flex class="inpBox" >
                       <label>手机号</label> 
                       <input type="text" box="1" value={this.state.phone} data-type="phone" onInput={this.bindInput} placeholder="请输入手机号"/>
                    </div>
                    <div flex class="inpBox">
                       <label>验证码</label> 
                       <input type="text" box="1" data-type="code" onInput={this.bindInput} placeholder="请输入验证码"/>
                       <span id="getCode" onClick={this.getCode}>{this.state.times}</span>
                    </div>
                    <button class="loginBtn" onClick={this.loginFn}>登陆</button>
                    <p class="loginTip">登录即同意贷款牛的 <a href="#">《用户协议与隐私条款》</a></p>
                </div>
            </View>
        )
    }
}
