import React,{useState, useEffect} from 'react';
import './App.css';
import { Card, Icon, Modal } from 'antd';
import Nav from './Nav'
// import {Link} from 'react-router-dom';
import { useParams } from "react-router-dom";
import { connect } from 'react-redux';


const { Meta } = Card;

function ScreenArticlesBySource(props) {
  
  const [articles, setArticles] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modal, setModal] = useState([])
 
  const showModal = (title, content) => {
    let modalArray = [title, content]
    setModal(modalArray)
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  let { id } = useParams();

  useEffect(() => {
    async function getArticles() {
      var rawResponse = await fetch(`https://newsapi.org/v2/top-headlines?sources=${id}&apiKey=ca18ba6333904117b3e0b5ba1fd8d59f`)
      var response = await rawResponse.json()
      setArticles(response.articles)
    }
    getArticles()
    return () => {
      getArticles()
    }
  }, [])

  let addToWishList = async (article) => {

    let articleModified = {...article, language: props.choice.language}
    let articleStringified = JSON.stringify(articleModified)    
    var rawResponse = await fetch('/users/add-article', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `article=${articleStringified}&token=${props.token}` 
    })     
    await rawResponse.json()
    props.addToStoreWishList(articleModified)   
  }


 
  let articleList = articles.map((article) => {
    let likeColor = {color: 'grey'}
    for(let i=0; i<props.myArticles.length; i++) {
      if(article.title === props.myArticles[i].title) {
        likeColor = {color: '#4267B2'}
      }
    }
    return (

        <Card
          key={article.title}
          className='cardStyle'
          cover={
            <img alt={article.title} src={article.urlToImage} />
          }
          actions={[
            <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title, article.content)}/>,
            <Icon  style={likeColor} type="like" key="ellipsis" onClick={() => addToWishList(article)}/>
          ]}
        >
          
          <Meta
            title={article.title}
            description={article.description}
          />

         </Card> 
    )
  })

  return (
    <div>
         
      <Nav/>

      <div className="Banner"/>

      <div className="Card">
        <div  style={{display:'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
          {articleList}
        </div>
        <Modal title={modal[0]} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <p>{modal[1]}</p>
        </Modal>
      </div>
            
    </div>
   
  );
}

function mapDispatchToProps(dispatch) {
  return {
    addToStoreWishList: function(article) {
      dispatch( {type: 'addArticle', article} )
    }
  }
}

function mapStateToProps(state) {
  return {
    myArticles: state.articles,
    choice: state.choice,
    token: state.token
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenArticlesBySource)
