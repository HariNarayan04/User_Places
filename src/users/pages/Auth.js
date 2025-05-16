import React, {useState, useContext} from 'react';

import { useForm } from '../../shared/hooks/form-hook';
import Button from '../../shared/components/Button/Button';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/Button/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_EMAIL, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-contex';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/Button/ImageUpload';

import './Auth.css' 

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm({
        username: {
            value: '',
            isValid: false
        },
        Password: {
            value: '',
            isValid: false
        }
    },false);

    const switchModeHandler = () =>{
        if (!isLoginMode){
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            }, 
            formState.inputs.username.isValid && formState.inputs.Password.isValid);
        }
        else {
            setFormData({
                ...formState.inputs,
                name:{
                    value: '',
                    isValid : false
                },
                image:{
                    value: null,
                    isValid: false
                }
            }, false);
        }
        setIsLoginMode(prevMode => !prevMode)
    }

    const authenticateHandler = async event => {
        event.preventDefault();


        if(isLoginMode){
            try{
                const responseData=await sendRequest(process.env.REACT_APP_BACKEND_URL+'/users/login', 
                    'POST', 
                    JSON.stringify({    
                        email: formState.inputs.username.value,
                        password: formState.inputs.Password.value}),
                    {'Content-Type': 'application/JSON'});

                auth.login(responseData.userId, responseData.token);
            }

            catch(err){
                
            }
        }
        else{
            try{
                const formData = new FormData();
                formData.append('email', formState.inputs.username.value);
                formData.append('name', formState.inputs.name.value);
                formData.append('password', formState.inputs.Password.value);
                formData.append('image', formState.inputs.image.value);
                const responseData=await sendRequest(process.env.REACT_APP_BACKEND_URL+'/users/signup',
                    'POST',
                    formData,);
                auth.login(responseData.userId, responseData.token);
            }
            catch(err){
                
            }
        }
    };

    return(
        <React.Fragment>
            <ErrorModal error ={error} onClear = {clearError}/>
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay/>}
                <h2>Login Required!</h2>
                <hr/>
            <form onSubmit = {authenticateHandler}>
                {!isLoginMode && (<Input 
                    element = "input" 
                    id = "name" 
                    type = "text" 
                    label = "Your Name" 
                    validators = {[VALIDATOR_REQUIRE]} 
                    errorText = "Please enter a name." 
                    onInput = {inputHandler}/>)}
                    {!isLoginMode && <ImageUpload center id = "image" onInput = {inputHandler} errorText = "Please upload a valid image" />}
                <Input
                id = "username"
                element = "input"
                type = "email"
                label = "Enter Email"
                validators = {[VALIDATOR_EMAIL()]}
                errorText = "Username is not valid. "
                onInput = {inputHandler}
                />
                <Input
                id = "Password"
                element = "input"
                type = "text" 
                label = "Enter Password"
                validators = {[VALIDATOR_MINLENGTH(6)]}
                errorText = "Password must be of 6 character long"
                onInput = {inputHandler}
                />
                <Button type = "submit" disabled = {!formState.isValid}> {isLoginMode ? 'LOGIN' : 'SIGNUP'} </Button>
            </form>
            <Button inverse onClick ={switchModeHandler} > SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'} </Button>
            </Card>
        </React.Fragment>
    );
};

export default Auth;