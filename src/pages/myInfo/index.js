import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import Ajax from '../../util/ajax.js'
export default class MyInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            userInfo : ''
        };
        let _userInfo = Taro.getStorageSync('userInfo')
        console.log('用户信息',_userInfo)
        if(!_userInfo){
            Taro.navigateTo({
                url: '/pages/login/index'
            })
        }else{
            this.setState({
                userInfo : _userInfo
            })
        }
    }
    config = {
        navigationBarTitleText: '意见反馈'
    }
    componentWillMount () { }
    componentDidMount () { }
    changeImgFn=(e)=>{
        let _type = (/.jpg|.gif|.png|.bmp|.jpeg/gi).test(e.target.files[0].type)
        if(!_type){
            Taro.showToast({
                title: '图片格式不正确',
                icon: 'none',
                duration: 1500
            })
        }else{
            let _formData = new FormData();
            _formData.append('image',e.target.files[0] );
            Taro.request({
                method: 'POST',
                url: '/api_v1/upload/up_avatar',
                data: _formData,
                success : res => {
                    console.log(1,res.data.data)
                    if(res.data.status==1) {
                        let _info = this.state.userInfo;
                        _info.avatar_image = res.data.data.file_url
                        this.setState({
                            userInfo : _info
                        },res=>{
                            console.log(333,this.state.userInfo)
                        });
                        Taro.setStorageSync('userInfo',this.state.userInfo)
                    }else if(res.status==0){
                        Taro.showToast({
                            title: res.msg,
                            icon: 'none',
                            duration: 1500
                        })
                    }
                },
                fail : res => {
                    console.log(2,res)
                }
            });
        }
    }
    render () {
        return (
            <View className='wrap'>
                
                <a href="javascript:;" className="user_cell rec">
                    头像
                    <div className="user_img2">
                        <input type="file" onChange={this.changeImgFn} />   
                        <img src={this.state.userInfo.avatar_image} />
                    </div>
                </a>
                <div className="user_cell">
                    昵称
                    <span>{this.state.userInfo.nickname}</span>
                </div>
                <div className="user_cell">
                    账号
                    <span>{this.state.userInfo.mobile}</span>
                </div>
            </View>
        )
    }
}
