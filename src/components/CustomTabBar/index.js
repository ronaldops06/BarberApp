import React, { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext' ;

import HomeIcon from '../../assets/home.svg';
import SearchIcon from '../../assets/search.svg';
import TodayIcon from '../../assets/today.svg';
import FavoriteIcon from '../../assets/favorite.svg';
import AccountIcon from '../../assets/account.svg';

import { 
    TabArea,
    TabItem,
    TabItemCenter,
    AvatarIcon
} from './styles';

const CustomTabBar = ({ state, navigation }) => {
    const { state:user } = useContext(UserContext);

    const goTo = (screenName) => {
        navigation.navigate(screenName);
    };

    const opacityItem = (index) => {
        return state.index === index ? 1 : 0.5;
    };

    return(
        <TabArea>
            <TabItem onPress={ ()=> goTo('Home') }>
                <HomeIcon style={{ opacity: opacityItem(0) }} width="24" height="24" fill="#FFFFFF" /> 
            </TabItem>
            <TabItem onPress={ ()=> goTo('Search') }>
                <SearchIcon style={{ opacity: opacityItem(1) }} width="24" height="24" fill="#FFFFFF" /> 
            </TabItem>
            <TabItemCenter onPress={ ()=> goTo('Appointments') }>
                <TodayIcon width="32" height="32" fill="#4EADBE" /> 
            </TabItemCenter>
            <TabItem onPress={ ()=> goTo('Favorites') }>
                <FavoriteIcon style={{ opacity: opacityItem(3) }} width="24" height="24" fill="#FFFFFF" /> 
            </TabItem>
            <TabItem onPress={ ()=> goTo('Profile') }>
                {user.avatar != '' ? 
                    <AvatarIcon source={{uri: user.avatar}} />
                    :
                    <AccountIcon style={{ opacity: opacityItem(4) }} width="24" height="24" fill="#FFFFFF" /> 
                }
            </TabItem>
        </TabArea>
    );
}

export default CustomTabBar;