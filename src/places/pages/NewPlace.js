import React, {useContext} from 'react';
import { useHistory} from 'react-router-dom';
import Input from '../../shared/components/Button/Input';
import Button from '../../shared/components/Button/Button'
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'; 
import ImageUpload from '../../shared/components/Button/ImageUpload';
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-contex';

import './PlaceForm.css';


const NewPlace = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const auth = useContext(AuthContext);
    const [formState,inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address:{
            value: '',
            isValid: false
        },
        image:{
            value: null,
            isValid:false
        }
    }, 
    false);

    const history = useHistory();

    const placeSubmitHandler = async(event) => {
        event.preventDefault();
        clearError();
        document.body.classList.add('loading');

        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('image', formState.inputs.image.value);

            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + '/places',
                'POST',
                formData,
                { Authorization: 'Bearer ' + auth.token }
            );

            history.push('/');
        } catch (err) {
            // handled by ErrorModal
        } finally {
            document.body.classList.remove('loading');
        }
    };
    

    return(
        <React.Fragment>
            <ErrorModal error = {error} onClear = {clearError}/>
            {isLoading && <LoadingSpinner asOverlay/>}
            <form className="place-form" onSubmit={placeSubmitHandler}>
                <Input 
                id = "title"
                    element = "input" 
                    type = "text" 
                    label = "Title" 
                    validators = {[VALIDATOR_REQUIRE()]} 
                    errorText = "please enter a valid title."
                    onInput =  {inputHandler}
                />
                <Input 
                    id = "description"
                    element = "textarea" 
                    label = "Description" 
                    validators = {[VALIDATOR_MINLENGTH(5)]} 
                    errorText = "please enter a valid description (at least 5 characters)."
                    onInput =  {inputHandler}
                />
                <Input 
                    id = "address"
                    element = "textarea" 
                    label = "Address" 
                    validators = {[VALIDATOR_REQUIRE()]} 
                    errorText = "please enter a valid address."
                    onInput =  {inputHandler}
                />
                <ImageUpload id = "image" center onInput = {inputHandler} errorText = "Please provide a valid image" />
                <Button type = "submit" disabled = {!formState.isValid}> ADD PLACE</Button>
            </form>
        </React.Fragment>);
};

export default NewPlace;