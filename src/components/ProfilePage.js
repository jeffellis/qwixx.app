import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import UserContext from '../UserContext';
import useFormValidation from '../useFormValidation';
import PageHeader from './PageHeader';

const MIN_NAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 6;

const INITIAL_STATE = {
    displayName: "",
    email: "",
    password: "",
};

const AUTH_ERRORS = {
    "auth/email-already-in-use": "A user with this Email already exists",
    "auth/user-not-found": "No user was found for this Email Address",
    "auth/wrong-password": "Password does not match",
};

export const ProfilePage = () => {
    return <SignOnPage/>
}

export const CreateProfilePage = () => {
    const history = useHistory();
    const { createUser } = useContext(UserContext);
    const [authError, setAuthError] = useState();   

    const createProfile = async (values) => {
        try {
            await createUser(values);
            history.push('/');
        } catch (error) {
            console.error(error);
            setAuthError(error.code);            
        }
    };

    const validate = (values) => {
        const errors = {}
        
        errors.displayName = validateDisplayName(values.displayName);
        errors.email = validateEmailAddress(values.email);
        errors.password = validatePassword(values.password);
        
        return errors;
    };

    const { errors, handleBlur, handleChange, handleSubmit, values } =
        useFormValidation(INITIAL_STATE, validate, createProfile);
    
    const promptProps = {
        errors,
        handleBlur,
        handleChange,
        values,
    };

    return (        
        <div className="app-page ProfilePage mt-3">
            <PageHeader title="Create a Player"/>
            <form onSubmit={handleSubmit}>
                <NamePrompt {...promptProps} />
                <EmailPrompt {...promptProps} />
                <PasswordPrompt {...promptProps} />                
                <button className="btn btn-primary" type="submit">Create</button>
            </form>
            <div className='text-danger mt-2'>{authError ? (AUTH_ERRORS[authError] || authError) : ''}</div>
        </div>
    );
}

export const SignOnPage = () => {
    const history = useHistory();
    const { login } = useContext(UserContext);
    const [authError, setAuthError] = useState();

    const handleProfileSubmit = async (values) => {
        try {
            await login(values);
            history.push('/');
        } catch (error) {
            console.error(error);
            setAuthError(error.code);
        }
    };

    const validate = (values) => {
        const errors = {}
        
        errors.email = validateEmailAddress(values.email);
        errors.password = validatePassword(values.password);
        
        return errors;
    };

    const { errors, handleBlur, handleChange, handleSubmit, values } =
        useFormValidation(INITIAL_STATE, validate, handleProfileSubmit);
    
    const promptProps = {
        errors,
        handleBlur,
        handleChange,
        values,
    };

    return (        
        <div className="app-page ProfilePage mt-3">
            <PageHeader title="Sign In"/>
            <form onSubmit={handleSubmit}>
                <EmailPrompt {...promptProps} />
                <PasswordPrompt {...promptProps} />                
                <button className="btn btn-primary" type="submit">Sign In</button>
                <Link className="ml-3" to="/profile">Create a new user</Link>
            </form>
            <div className='text-danger mt-2'>{authError ? (AUTH_ERRORS[authError] || authError) : ''}</div>
        </div>
    );
};

const ErrorText = ({ errors, fieldName }) => (<span className='text-danger ml-1'>{errors[fieldName] || ''}</span>);

const Prompt = ({ errors, fieldName, handleBlur, handleChange, text, type, value }) => (
    <div className="mb-2 text-start">
        <label htmlFor={fieldName} className="form-label">{text}</label>
        <ErrorText errors={errors} fieldName={fieldName} />
        <input type={type} className="form-control" id={fieldName} onBlur={handleBlur} name={fieldName}
            onChange={handleChange} value={value} />
    </div>
);

const EmailPrompt = (props) => {
    const promptProps = {
        fieldName: 'email',
        text: 'Email Address',
        type: 'email',
        value: props.values.email,
        ...props,
    };

    return <Prompt { ...promptProps } />
};

const PasswordPrompt = (props) => {
    const promptProps = {
        fieldName: 'password',
        text: 'Password',
        type: 'password',
        value: props.values.password,
        ...props,
    };

    return <Prompt { ...promptProps } />
};

const NamePrompt = (props) => {
    const promptProps = {
        fieldName: 'displayName',
        text: 'Your Name (e.g. Qwixxster)',
        value: props.values.displayName,
        ...props,
    };

    return <Prompt { ...promptProps } />
};

 
const validateDisplayName = (displayName) => {
    if (displayName.length < MIN_NAME_LENGTH) {
        return `${MIN_NAME_LENGTH}+ characters required`;        
    }
    return null;
}

const validateEmailAddress = (emailAddress) => {
    if (!emailAddress) {
        return 'Email address required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailAddress)) {
        return 'Invalid email addreass';
    }
    return null;
};

const validatePassword = (password) => {
    if (password.length < MIN_PASSWORD_LENGTH) {
        return `${MIN_PASSWORD_LENGTH}+ characters required`;
    }
    return null;
};