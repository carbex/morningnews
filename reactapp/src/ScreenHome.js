import React, { useState } from 'react';
import './App.css';
import { Input, Button, Alert } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {Redirect} from 'react-router-dom';
import { connect } from 'react-redux';


function ScreenHome(props) {

  const [signUpFirstName, setSignUpFirstName] = useState('')
  const [signUpLastName, setSignUpLastName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [isLogin, setIsLogin] = useState(false)
  const [signUpMessage, setSignUpMessage] = useState('')
  const [signInMessage, setSignInMessage] = useState('')


  let handleOnSignIn = async () => {
     
    var rawResponse = await fetch('/users/sign-in', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `email=${signInEmail}&password=${signInPassword}`
    })
    var response = await rawResponse.json()
    props.handleToken(response.user.token)
    if(response.user.choice) {
      props.handleChoice(response.user.choice)
    }
    setIsLogin(response.isLogin)
    setSignInMessage(<Alert message={response.message} type="error" />)
  }

  let handleOnSignUp = async () => {
    var rawResponse = await fetch('/users/sign-up', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `firstName=${signUpFirstName}&lastName=${signUpLastName}&email=${signUpEmail}&password=${signUpPassword}`
    })
    var response = await rawResponse.json()
    props.handleToken(response.user.token)
    setIsLogin(response.isLogin)
    setSignUpMessage(<Alert message={response.message} type="error" />) 
  }

  if(isLogin) {
    return (<Redirect to="/screensource" />)
  } else {
    return (
      <div className="Login-page" >
  
        {/* SIGN-IN */}
        
        <div className="Sign">

          {signInMessage}

          <div className="Sign background">

            <Input 
              className="Login-input" 
              placeholder="arthur@lacapsule.com" 
              onChange={(e) => setSignInEmail(e.target.value)} 
              value={signInEmail}
            />

            <Input.Password 
              className="Login-input" 
              placeholder="password"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              onChange={(e) => setSignInPassword(e.target.value)} 
              value={signInPassword}
            />
            
            <Button style={{width:'80px'}} type="primary" onClick={() => handleOnSignIn()}>Sign-in</Button>

          </div>
        </div>

        {/* SIGN-UP */}

        <div className="Sign">

          {signUpMessage}

          <div className="Sign background">

            <Input 
              className="Login-input" 
              placeholder="first name" 
              onChange={(e) => setSignUpFirstName(e.target.value)} 
              value={signUpFirstName}
            />

            <Input 
              className="Login-input" 
              placeholder="last name" 
              onChange={(e) => setSignUpLastName(e.target.value)} 
              value={signUpLastName}
            />

            <Input 
              className="Login-input" 
              placeholder="arthur@lacapsule.com" 
              onChange={(e) => setSignUpEmail(e.target.value)} 
              value={signUpEmail}
            />

            <Input.Password 
              className="Login-input" 
              placeholder="password"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              onChange={(e) => setSignUpPassword(e.target.value)} 
              value={signUpPassword}
            />
          
            <Button style={{width:'80px'}} type="primary" onClick={() => handleOnSignUp()}>Sign-up</Button>

          </div>
        </div>            
      </div>
    );
  } 
}

function mapDispatchToProps(dispatch) {
  return {
    handleToken: function(token) {
      dispatch({type: 'sign-up', token})
    },
    handleChoice: function(choice) {
      dispatch({type: 'addSource', choice})
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(ScreenHome);

