import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import Ajax from '../../util/ajax.js'
export default class About extends Component {
    state = {
        formInfo : ''
    }
    config = {
        navigationBarTitleText: '关于我们'
    }
    copyFn=()=>{
        let _dom = this.refs.text;
        _dom.select();
        _dom.setSelectionRange(0, _dom.value.length);
        document.execCommand("copy");
        Taro.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
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
    render () {
        return (
            <View className='wrap'>
                <textarea readonly="" ref="text" style="position: fixed;left:-9999px; top:-9999px;">{this.state.formInfo.wechat}</textarea>
                <img src={require("../../images/shizhong@2x.png")} class="userIcon2" alt=""/>
                <p class="ver_p">版本号：v1.0.0</p>
                <a href="javascript:;" id="copyBtn" onClick={this.copyFn} class="user_cell ">
                    微信公众号<span style="color:#2176F6 ">点击复制</span>
                </a>
                <a href="javascript:;" class="user_cell ">
                    QQ群<span>{this.state.formInfo.qq}</span>
                </a>
                <div  onclick="aboutDialog.classList.add('show')"  class="user_cell ">
                    客服电话<a href="tel:021-1122" style="color:#2176F6;float: right;line-height: 1rem ">{this.state.formInfo.service_tel || '暂无'}</a>
                </div>

            </View>
        )
    }
}
