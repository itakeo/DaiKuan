import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import Ajax from '../../util/ajax.js'
export default class Search extends Component {
    state = {
        keyword : '',
        hotSearch : []
    }

    config = {
        navigationBarTitleText: '搜索'
    }
    componentWillMount () { }
    componentDidMount () { 
        Ajax('/api_v1/loan/getHotSearch').then(res=>{
            if(res.status == 1){
                this.setState({
                    hotSearch : res.data || []
                });
                console.log(res.data )
            }
        });
    }
    bindInput=(e)=>{
        this.setState({
            keyword : e.target.value
        })
    }
    setSearch=(e)=>{
        this.setState({
            keyword : e.target.dataset.value
        },()=>{
            this.goSearch();
        })
    }
    goSearch=(e)=>{
        console.log(e)
        Taro.navigateTo({
            url: '/pages/searchEnd/index'+`?search=${this.state.keyword}`
        }) 
    }
    submitFn=(e)=>{
        e.preventDefault();
        return false;
    }
    render () {
        return (
            <View className='wrap'>
                <div className="searchBox" >
                    <form className="formSeach" onSubmit={this.submitFn} flex>
                        <input type="search" box="1" onInput={this.bindInput} placeholder="搜索贷款产品"/>
                        <button onClick={this.goSearch}>搜索</button>
                    </form>
                </div>
                <div className="searchInfo">
                    {/*<p>历史搜索</p>
                    <div>
                        <a href="#">飞速贷</a>
                        <a href="#">飞速贷</a>
                        <a href="#">飞速贷</a>
                        <a href="#">飞速贷</a>
                    </div>*/}
                    <p>热门搜索</p>
                    <div>
                    {
                        this.state.hotSearch.map(res=>{
                            return <a href="javascript:;"  data-value={res.title} onClick={this.setSearch}>{res.title}</a>
                        })
                    }
                    </div>
                </div>
            </View>
        )
    }
}
