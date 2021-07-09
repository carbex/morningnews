import React from 'react';
import './App.css';
import { Card, Icon} from 'antd';
import Nav from './Nav';
// import {Link} from 'react-router-dom';
import { connect} from 'react-redux';


const { Meta } = Card;

function ScreenMyArticles(props) {

  let deleteToWishList = async (article, index) => { 
    let rawResponse = await fetch(`/users/delete-article/${props.token}/${article.title}`, {
      method: 'DELETE'
    })
    await rawResponse.json()
    props.deleteToStoreWishList(index)
  }

  let myArticlesFiltered = []
  if(props.choice.language === 'fr') {
    myArticlesFiltered = props.myArticles.filter(e => e.language === 'fr')
  } else if (props.choice.language === 'en') {
    myArticlesFiltered = props.myArticles.filter(e => e.language === 'en')
  }

  // console.log('mes articles filtrés : ', myArticlesFiltered)

  let myArticles = myArticlesFiltered.map((article, index) => {
    return(
      <Card
      key={article.title}
        className='cardStyle'
        cover={
        <img
            alt="example"
            src={article.urlToImage}
        />       
        }        
        actions={[
          <Icon type="read" key="ellipsis2" />,
            <Icon type="delete" key="ellipsis" onClick={() => deleteToWishList(article, index)}/>
        ]}
      >         
        <Meta
          title={article.title}
          description={article.description}
        />
      </Card>
    )
  })

  if(myArticlesFiltered.length === 0) {
    return(
      <div>
        <Nav/>
        <div className="Banner"/>
        <h3 style={{display:'flex',justifyContent:'center'}}>No Articles !</h3>
      </div>)

  } else {
  
    return (
      <div>          
        <Nav/>
        <div className="Banner"/>
        <div className="Card">
          <div  style={{display:'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
            {myArticles}
          </div>
        </div>       
      </div>
    );
    
  }

}

function mapDispatchToProps(dispatch) {
  return {
    deleteToStoreWishList: function(index) {
      dispatch( {type: 'delArticle', index} )
    }
  }
}

function mapStateToProps(state) {
  return {
    choice: state.choice, 
    myArticles: state.articles,
    token: state.token
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenMyArticles)

// export default ScreenMyArticles;
