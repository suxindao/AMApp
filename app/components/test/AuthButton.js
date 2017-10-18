import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button} from 'react-native';
import {NavigationActions} from 'react-navigation';

const AuthButton = ({logout, loginScreen, isLoggedIn}) => (
    <Button style={{height: 50, color: '#F00', margin: 10}}
            title={isLoggedIn ? 'Log Out' : 'Open Login Screen'}
            onPress={isLoggedIn ? logout : loginScreen}
    />
);

AuthButton.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
    loginScreen: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch({type: 'Logout'}),
    loginScreen: () =>
        dispatch(NavigationActions.navigate({routeName: 'login'})),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthButton);
