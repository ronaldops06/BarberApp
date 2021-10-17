import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import ExpandIcon from '../../assets/expand.svg';
import NavPrevIcon from '../../assets/nav_prev.svg';
import NavNextIcon from '../../assets/nav_next.svg';

import Api from '../../Api';

import {
    Modal,
    ModalArea,
    ModalBody,
    ModalItem,
    CloseButton,
    FinishButton,
    FinishButtonText,
    UserInfo,
    UserAvatar,
    UserName,
    ServiceInfo,
    ServiceName,
    ServicePrice,
    DateInfo,
    DateItem,
    DatePrevArea,
    DateNextArea,
    DateTitleArea,
    DateTitle,
    DateList,
    DateItemNumber,
    DateItemWeekDay,
    TimeList,
    TimeItem,
    TimeItemText
} from './styles';

const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
];

const days = [
    'Dom',
    'Seg',
    'Ter',
    'Qua',
    'Qui',
    'Sex',
    'Sab'
];

const BarberModal = ({show, setShow, user, service}) => {

    const navigation = useNavigation();

    const [selectedYear, setSelectedYear] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedDay, setSelectedDay] = useState(0);
    const [selectedHour, setSelectedHour] = useState(null);
    const [listDays, setListDays] = useState([]);
    const [listHours, setListHours] = useState([]);

    useEffect(() => {
        if (user.available){
            let daysInMonth = new Date(selectedYear, selectedMonth+1, 0).getDate();
            let newListDays = [];

            for (let i = 1; i <= daysInMonth; i++ ){
                let d = new Date(selectedYear, selectedMonth, i)
                let availability = getAvailabilityByDate(d);

                newListDays.push({
                    status: availability.length > 0 ? true : false,
                    weekday: days[ d.getDay() ],
                    number: i
                });
            }
            
            setListDays(newListDays);
            setSelectedDay(0);
            setListHours([]);
            setSelectedHour(0);
        }
    }, [user, selectedMonth, selectedYear]);

    useEffect(() => {
        if (user.available && selectedDay > 0){
            
            let d = new Date(selectedYear, selectedMonth, selectedDay)

            let availability = getAvailabilityByDate(d);
            
            if (availability.length > 0) {
                setListHours( availability[0].hours );
            }
        }
        setSelectedHour(null);
    }, [user, selectedDay]);

    useEffect(() => {
        let today = new Date();
        setDate(today);
    },[]);

    const handleCloseButton = () => {
        setShow(false);
    }

    const handleLeftDateClick = () => {
        let mountDate = new Date(selectedYear, selectedMonth, 1);
        mountDate.setMonth( mountDate.getMonth() - 1 );
        setDate(mountDate);
    }

    const handleRightDateClick = () => {
        let mountDate = new Date(selectedYear, selectedMonth, 1);
        mountDate.setMonth( mountDate.getMonth() + 1 );
        setDate(mountDate);
    }

    const getAvailabilityByDate = (date) => {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        
        let selDate = `${year}-${month}-${day}`;

        return user.available.filter(e => e.date === selDate);
    }

    const setDate = (date) => {
        setSelectedYear( date.getFullYear() );
        setSelectedMonth( date.getMonth() );
        setSelectedDay( date.getDate() );
    }

    const handleFinishClick = async () => {
        if (user.id && service != null && selectedYear > 0 && selectedMonth > 0 && selectedDay > 0 && selectedHour != null){
            let res = await Api.setAppointment(user.id, service, selectedYear, selectedMonth, selectedDay, selectedHour);

            if (res.error == ''){
                setShow(false);
                navigation.navigate('Appointments');
            } else {
                alert(res.erros);
            }
        } else {
            alert("Preencha todos as informações");
        }
    }

    return (
        <Modal
            transparent={true}
            visible={show}
            animationType="slide"
        >
            <ModalArea>
                <ModalBody>
                    <CloseButton onPress={handleCloseButton}>
                        <ExpandIcon width="40" height="40" fill="#000000" />
                    </CloseButton>
                    <ModalItem>
                        <UserInfo>
                            <UserAvatar source={{uri: user.avatar}}/>
                            <UserName>{user.name}</UserName>
                        </UserInfo>
                    </ModalItem>
                    {service != null &&
                        <ModalItem>
                            <ServiceInfo>
                                <ServiceName>{user.services[service].name}</ServiceName>
                                <ServicePrice>R$ {user.services[service].price.toFixed(2)}</ServicePrice>
                            </ServiceInfo>
                        </ModalItem>
                    }
                    <ModalItem>
                        <DateInfo>
                            <DatePrevArea onPress={handleLeftDateClick}>
                                <NavPrevIcon width="35" height="35" fill="#000000" />
                            </DatePrevArea>
                            <DateTitleArea>
                                <DateTitle>{months[selectedMonth]} {selectedYear}</DateTitle>
                            </DateTitleArea>
                            <DateNextArea onPress={handleRightDateClick}>
                                <NavNextIcon width="35" height="35" fill="#000000" />
                            </DateNextArea>
                        </DateInfo>
                        <DateList horizontal={true} showsHorizontalScrollIndicator={false}>
                            {listDays.map((item, key) => (
                                <DateItem 
                                    key={key}
                                    onPress={()=> item.status ? setSelectedDay(item.number) : null }
                                    style={{
                                        opacity: item.status ? 1 : 0.5,
                                        backgroundColor: item.number === selectedDay ? '#4EADBE' : '#FFFFFF'
                                    }}
                                >
                                    <DateItemWeekDay
                                        style={{
                                            color: item.number === selectedDay ? '#FFFFFF' : '#000000'
                                        }}
                                    >{item.weekday}</DateItemWeekDay>
                                    <DateItemNumber
                                        style={{
                                            color: item.number === selectedDay ? '#FFFFFF' : '#000000'
                                        }}
                                    >{item.number}</DateItemNumber>
                                </DateItem>
                            ))}
                        </DateList>
                    </ModalItem>
                    {listHours.length > 0 &&
                        <ModalItem>
                            <TimeList horizontal={true} showsHorizontalScrollIndicator={false}>
                                {listHours.map((item, key) => (
                                    <TimeItem
                                        key={key}
                                        onPress={() => setSelectedHour(item)}
                                        style={{
                                            backgroundColor: item === selectedHour ? '#4EADBE' : '#FFFFFF'
                                        }}
                                    >
                                        <TimeItemText
                                            style={{
                                                color: item === selectedHour ? '#FFFFFF' : '#000000',
                                                fontWeight: item === selectedHour ? 'bold' : 'normal'
                                            }}
                                        >{item}</TimeItemText>
                                    </TimeItem>
                                ))}
                            </TimeList>
                        </ModalItem>
                    }

                    <FinishButton onPress={handleFinishClick}>
                        <FinishButtonText>Finalizar Agendamento</FinishButtonText>
                    </FinishButton>
                </ModalBody>
            </ModalArea>

        </Modal>
    );
}

export default BarberModal;