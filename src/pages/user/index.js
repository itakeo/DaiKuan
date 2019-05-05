import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import TabNav from '../tab/index.js'
import Ajax from '../../util/ajax.js'
export default class User extends Component {
    state = {
        formInfo : '',
        isLogin : false,
        showGzhDialog : 0,
        showShare : 0,
        userInfo : '',
        userImg : require('../../images/mine_touxiang.png')
    }
    config = {
        navigationBarTitleText: '我的'
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
    componentDidShow () { 
        let _userInfo = Taro.getStorageSync('userInfo')
        console.log('用户信息',_userInfo)
        if(!_userInfo){
            this.setState({
                isLogin : true
            })
        }else{
            this.setState({
                userInfo : _userInfo
            })
        }
    }
    showGZH=()=>{
        let _dom = this.refs.text;
        _dom.select();
        _dom.setSelectionRange(0, _dom.value.length);
        document.execCommand("copy");
        this.setState({
            showGzhDialog : 1
        })
    }
    showShare=()=>{
        this.setState({
            showShare : 1
        })
    }
    closeDialog=()=>{
        this.setState({
            showGzhDialog : 0,
            showShare : 0
        })
    }
    goTo=(e)=>{
        Taro.navigateTo({
            url: e.target.dataset.url
        })        
    }
    render () {
        return (
            <View className='wrap'>
                <textarea readonly="" ref="text" style="position: fixed;left:-9999px; top:-9999px;">{this.state.formInfo.wechat}</textarea>
                <div className={(this.state.isLogin ? 'show' : '')+" loginDialog"}>
                    <div className="loginDialogCon">
                        <h1>您还未登录，请登录</h1>
                        <button data-url="/pages/login/index" onClick={this.goTo}>登录</button>
                    </div>
                </div>  
                <div className="userTop" flex>
                    <div className="userImg">
                        <img src={this.state.userInfo.avatar_image || this.state.userImg}/>
                    </div>
                    <a href="javascript:;"  data-url='/pages/myInfo/index'  onClick={this.goTo} className="userName dot" box="1">
                        {this.state.userInfo.nickname || '未登录'}
                    </a>
                </div>
                <div className="userItem">
                    <div className="userTitle">
                        常用工具
                    </div>   
                    <div className="userBox">
                        <a href="javascript:;" data-url='/pages/history/index'  onClick={this.goTo} className="userBox_link">
                            <img src={require("../../images/shenqing_lishi.png")} alt=""/>
                            <p>申请历史</p>
                        </a>
                        <a href="javascript:;"  data-url='/pages/feedback/index'  onClick={this.goTo} className="userBox_link">
                            <img src={require("../../images/yijian_fankui.png")} alt=""/>
                            <p>意见反馈</p>
                        </a>
                        {/*<a href="javascript:;"   className="userBox_link"  onClick={this.showShare}>
                            <img src={require("../../images/share.png")} alt=""/>
                            <p>分享</p>
                        </a>*/}
                        <a href="javascript:;" id="copyBtn" onClick={this.showGZH} className="userBox_link" >
                            <img src={require("../../images/guanzhu_gongzhonghao.png")} alt=""/>
                            <p>关注公众号</p>
                        </a>
                        <a href="javascript:;"   data-url='/pages/setting/index'  onClick={this.goTo}  className="userBox_link">
                            <img src={require("../../images/set.png")} alt=""/>
                            <p>设置</p>
                        </a>
                    </div> 

                </div>


                <div className={(this.state.showShare ? 'show' : '')+" shareDialog"} id="shareDialog">
                    <div className="mask"  onClick={this.closeDialog}></div>
                    <div className="shareDialogCon">
                        <div className="shareBox">
                            <a href="http://connect.qq.com/widget/shareqq/iframe_index.html?url=http:www.baidu.com">
                                <img src={require("../../images/qq.png")} alt=""/>
                                <p>QQ</p>
                            </a>
                            <a href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=http:www.baidu.com">
                                <img src={require("../../images/qz.png")} alt=""/>
                                <p>QQ空间</p>
                            </a>
                            <a href="http://service.weibo.com/share/share.php?url=http:www.baidu.com">
                                <img src={require("../../images/wb.png")} alt=""/>
                                <p>新浪微博</p>
                            </a>
                        </div> 
                    </div>
                </div>
                <div className={(this.state.showGzhDialog ? 'show' : '')+" copyWxDialig"} id="copyWxDialig">
                    <div className="mask" onClick={this.closeDialog}></div>
                    <div className="copyWxDialigCon">
                        <p className="p1">公众号<span>{this.state.formInfo.wechat}</span>已复制</p>
                        <p className="p2">点击去微信搜索公众号关注</p>
                        <img src={require("../../images/weixin_gongzhonghao.png")} width="100%" alt=""/>
                        {/*<a href="#">去微信</a>*/}
                    </div>
                </div>
                <TabNav/>
            </View>
        )
    }
}
