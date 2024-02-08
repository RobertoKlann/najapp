import React from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import TabBar from '../components/TabBar';
import FinanceFilterButton from '../components/FinanceFilterButton';

// // screens
import AdvChoiceScreen from '../screens/AdvChoiceScreen';
import HomeScreen from '../screens/HomeScreen';
import ToPayScreen from '../screens/ToPayScreen';
import ToReceiveScreen from '../screens/ToReceiveScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AgendamentosScreen from '../screens/AgendamentosScreen';
import NewEventScreen from '../screens/NewEventScreen';
import AttachmentProcessListScreen from '../screens/AttachmentProcessListScreen';
import AttachmentActivitiesListScreen from '../screens/AttachmentActivitiesListScreen';
import NotificationListScreen from '../screens/NotificationListScreen';
import ChatScreen from '../screens/ChatScreen';
import ActiveProcessesScreen from '../screens/ActiveProcessesScreen';
import CompletedProcessesScreen from '../screens/CompletedProcessesScreen';
import AllProcessesScreen from '../screens/AllProcessesScreen';
import ProgressOfTheProcessListScreen from '../screens/ProgressOfTheProcessListScreen';
import PartsOfTheProcessListScreen from '../screens/PartsOfTheProcessListScreen';
import ProcessActivitiesListScreen from '../screens/ProcessActivitiesListScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import DeviceListScreen from '../screens/DeviceListScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';

// colors
import { colors } from '../globals';

const defaultOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
};

const defaultScreenOptions = {
  style: {
    backgroundColor: colors.primary,
    borderTopColor: colors.primary,
    borderTopWidth: 2,
  },
  activeTintColor: '#fff',
  indicatorStyle: {
    backgroundColor: colors.secundary,
    height: 5,
  },
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const FinanceTabTop = createMaterialTopTabNavigator();
const ProcessTabTop = createMaterialTopTabNavigator();
const ProfileStack = createStackNavigator();

const PrcTabTop = () => (
  <ProcessTabTop.Navigator screenOptions={defaultScreenOptions}>
    <ProcessTabTop.Screen
      name="ActiveProcesses"
      component={ActiveProcessesScreen}
      options={{ title: 'ativos' }}
    />
    <ProcessTabTop.Screen
      name="CompletedProcesses"
      component={CompletedProcessesScreen}
      options={{ title: 'encerrados' }}
    />
    <ProcessTabTop.Screen
      name="AllProcesses"
      component={AllProcessesScreen}
      options={{ title: 'todos' }}
    />
  </ProcessTabTop.Navigator>
);

const FneTabTop = ({ navigation, route }) => {
  function renderHeaderRightButton() {
    return <FinanceFilterButton />;
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRightButton,
    });
  }, []);

  const { values } = route.params;

  const _ToPayScreen = () => <ToPayScreen values={values} />;
  const _ToReceiveScreen = () => <ToReceiveScreen values={values} />;

  return (
    <FinanceTabTop.Navigator screenOptions={defaultScreenOptions}>
      <FinanceTabTop.Screen
        name="ToReceive"
        component={_ToReceiveScreen}
        options={{ title: 'a receber' }}
      />
      <FinanceTabTop.Screen
        name="ToPay"
        component={_ToPayScreen}
        options={{ title: 'a pagar' }}
      />
    </FinanceTabTop.Navigator>
  );
};

const PrfStack = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ ...defaultOptions, title: 'Usuário' }}
    />
  </ProfileStack.Navigator>
);

const AuthTabNavigator = () => (
  <Tab.Navigator tabBar={props => <TabBar {...props} />}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Serviços', icon: 'dashboard' }}
    />
    <Tab.Screen
      name="ProfileStack"
      component={PrfStack}
      options={{ title: 'Usuário', icon: 'person' }}
    />
  </Tab.Navigator>
);

export default function AuthStackNavigator() {
  const auth = useSelector(state => state.auth);
  const initialRoute = auth.adv ? 'AuthTab' : 'AdvChoiceScreen';
  // const initialRoute = 'AuthTab';

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="AuthTab"
        component={AuthTabNavigator}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="AdvChoiceScreen"
        component={AdvChoiceScreen}
        options={{
          ...defaultOptions,
          title: 'prestadores de serviço',
        }}
      />
      <Stack.Screen
        name="Agenda"
        //component={AgendaScreen}
        component={AgendamentosScreen}
        options={{
          ...defaultOptions,
          title: 'agendamentos',
        }}
      />
      <Stack.Screen
        name="NewEvent"
        component={NewEventScreen}
        options={{
          ...defaultOptions,
          title: 'novo agendamento',
        }}
      />
      <Stack.Screen
        name="Activities"
        component={ActivitiesScreen}
        options={{
          ...defaultOptions,
          title: 'atividades',
        }}
      />
      <Stack.Screen
        name="NotificationList"
        component={NotificationListScreen}
        options={{
          ...defaultOptions,
          title: 'notificações',
        }}
      />
      <Stack.Screen
        name="ProcessActivitiesList"
        component={ProcessActivitiesListScreen}
        options={{
          ...defaultOptions,
          title: 'atividades',
        }}
      />
      <Stack.Screen
        name="ProgressOfTheProcessList"
        component={ProgressOfTheProcessListScreen}
        options={{
          ...defaultOptions,
          title: 'movimentações',
        }}
      />
      <Stack.Screen
        name="PartsOfTheProcessList"
        component={PartsOfTheProcessListScreen}
        options={{
          ...defaultOptions,
          title: 'partes do processo',
        }}
      />
      <Stack.Screen
        name="DeviceList"
        component={DeviceListScreen}
        options={{
          ...defaultOptions,
          title: 'dispositivos',
        }}
      />
      <Stack.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{
          ...defaultOptions,
          title: 'atendimentos',
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          ...defaultOptions,
          title: 'minhas mensagens',
        }}
      />
      <Stack.Screen
        name="Finance"
        component={FneTabTop}
        options={{
          ...defaultOptions,
          headerStyle: {
            backgroundColor: colors.primary,
            elevation: 0,
          },
          title: 'financeiro',
        }}
      />
      <Stack.Screen
        name="Process"
        component={PrcTabTop}
        options={{
          ...defaultOptions,
          headerStyle: {
            backgroundColor: colors.primary,
            elevation: 0,
          },
          title: 'processos',
        }}
      />
      <Stack.Screen
        name="AttachmentProcessList"
        component={AttachmentProcessListScreen}
        options={{
          ...defaultOptions,
          title: 'anexos do processo',
        }}
      />
      <Stack.Screen
        name="AttachmentActivitiesList"
        component={AttachmentActivitiesListScreen}
        options={{
          ...defaultOptions,
          title: 'anexos da atividade',
        }}
      />
    </Stack.Navigator>
  );
}
