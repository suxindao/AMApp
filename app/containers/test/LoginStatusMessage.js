import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button, StyleSheet, Text, View} from 'react-native';
import {NavigationActions} from 'react-navigation';

const styles = StyleSheet.create({
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

// const LoginStatusMessage = ({isLoggedIn, dispatch}) => {
//     if (!isLoggedIn) {
//         return <Text style={styles.welcome}>Please log in</Text>;
//     }
//     return (
//         <View>
//             <Text style={styles.welcome}>
//                 {'You are "logged in" right now'}
//             </Text>
//             <Button
//                 onPress={() =>
//                     dispatch(NavigationActions.navigate({routeName: 'Profile'}))}
//                 title="Profile"
//             />
//         </View>
//     );
// };

class LoginStatusMessage extends React.Component {
    render() {
        console.log("this.props = ", this.props)
        let {isLoggedIn, dispatch} = this.props
        if (!isLoggedIn) {
            return <Text style={styles.welcome}>Please log in</Text>;
        }
        return (
            <View>
                <Text style={styles.welcome}>
                    {'You are "logged in" right now'}
                </Text>
                <Button
                    onPress={() => dispatch(NavigationActions.navigate({routeName: 'Profile'}))}
                    title="Profile"
                />
            </View>
        );
    }
}

LoginStatusMessage.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn,
});

export default connect(mapStateToProps)(LoginStatusMessage);
