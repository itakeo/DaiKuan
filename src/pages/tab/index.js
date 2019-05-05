import Taro, { Component } from '@tarojs/taro'
export default class TabNav extends Component {
    state = {
        activeIndex : 0
    }

    componentDidMount () {
        this.setState({
            activeIndex : this.$router.params.tab || 0
        })
    }

    goTo=(e)=>{
        Taro.navigateTo({
            url: e.target.dataset.url+`?tab=${e.target.dataset.index}`
        })        
    }
    render () {
        return (
            <div className="tabBarFixed" flex>
                <a href="javascript:;" 
                    data-url='/pages/index/index' 
                    className={this.state.activeIndex == 0 ? 'active' : ''}
                    data-index="0" onClick={this.goTo}  box="1">
                    <img src={require('../../images/shouye.png')} alt=""/>
                    <p>首页</p>
                </a>
                <a href="javascript:;"  data-url='/pages/allList/index' className={this.state.activeIndex == 1 ? 'active' : ''}  data-index="1"   onClick={this.goTo} box="1">
                    <img src={require("../../images/daikuan_daquan.png")} alt=""/>
                    <p>贷款大全</p>
                </a>
                <a href="javascript:;" data-url='/pages/index3/index'  onClick={this.goTo}  data-index="2"  className={this.state.activeIndex == 2 ? 'active' : ''}  box="1">
                    <img src={require("../../images/bixiakuan.png")} alt=""/>
                    <p>必下款</p>
                </a>
                <a href="javascript:;"  data-url='/pages/user/index'  onClick={this.goTo}  data-index="3" className={this.state.activeIndex == 3 ? 'active' : ''}  box="1">
                    <img src={require("../../images/mine.png")} alt=""/>
                    <p>我的</p>
                </a>
            </div>
        )
    }
}
