import React,{useState, useEffect} from 'react';
import './App.css';
import { List, Avatar } from 'antd';
import Nav from './Nav'
import {Link} from 'react-router-dom';
import { connect } from 'react-redux'


function ScreenSource(props) {
  
  const [sourceList, setSourceList] = useState([])

  let loadSources = async () => {
    var rawResponse = await fetch(`https://newsapi.org/v2/sources?country=${props.choice.country}&language=${props.choice.language}&apiKey=ca18ba6333904117b3e0b5ba1fd8d59f`)
    var response = await rawResponse.json()
    setSourceList(response.sources)
  }

  let addChoiceToBdd = async () => {
    let choiceStringified = JSON.stringify(props.choice)
    var rawResponse = await fetch('/users/add-choice', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `choice=${choiceStringified}&token=${props.token}`
    })
    await rawResponse.json()    
  }

  let getWishListFromBdd = async () => {
    var rawResponse = await fetch(`/users/get-article/${props.token}`)
    var response = await rawResponse.json() 
    props.addToStoreWishList(response.wishList)
  }

  useEffect(() => {  
    getWishListFromBdd()
    return function cleanup() {
      getWishListFromBdd()
    }
  }, [])

  useEffect(() => {
    loadSources()
    addChoiceToBdd()
    return function cleanup() {
      loadSources()
    }
  
  }, [props.choice])

  let styleFr = {width: '40px', borderRadius: '40px', margin: '20px', cursor: 'pointer'}
  if(props.choice.language === 'fr') {
    styleFr = {width: '44px', borderRadius: '40px', margin: '18px', cursor: 'pointer', border: 'solid 2px #B2FF33'}
  } 
  let styleEn = {width: '40px', borderRadius: '40px', margin: '20px', cursor: 'pointer'}
  if (props.choice.language === 'en') {
    styleEn = {width: '44px', borderRadius: '40px', margin: '18px', cursor: 'pointer', border: 'solid 2px #B2FF33'}
  }

  return (
    <div>
      <Nav/>
       
      <div className="Banner">

        <div  style={{display:'flex', justifyContent: 'center', flexWrap: 'center', height: '80px'}}>
          <img style={styleFr} src='../images/frenchFlag.png' alt='french flag' onClick={() => props.handleClickOnFrenchFlag({country: 'fr', language: 'fr'})}/>
          <img style={styleEn} src='../images/englishFlag.png' alt='english flag' onClick={() => props.handleClickOnEnglishFlag({country: 'gb', language: 'en'})}/>
        </div>

      </div>

      <div className="HomeThemes">
          
        <List
          itemLayout="horizontal"
          dataSource={sourceList}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={`/images/${item.category}.png`} />}
                title = {<Link to={`/screenarticlesbysource/${item.id}`} >{item.name}</Link>}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </div>                
  </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    handleClickOnFrenchFlag: function (choice) {
      dispatch({type: 'addSource', choice})
    },
    handleClickOnEnglishFlag: function (choice) {
      dispatch({type: 'addSource', choice})
    },
    addToStoreWishList: function(wishList) {
      dispatch( {type: 'addWishList', wishList} )
    }
  }
}

function mapStateToProps(state) {
  return {
    choice: state.choice,
    token: state.token
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenSource)
