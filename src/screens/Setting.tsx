import React, {useContext} from 'react';
import {SafeAreaView, View, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Text} from 'react-native-paper';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {colors, commonStyles} from '../theme/globalTheme';
import ButtonGoBack from '../components/ButtonGoBack';
import LogoSofy from '../components/LogoSofy';
import {AuthContext} from '../context/authContext/authContext';

export default function Settings({navigation}: any) {
  const {logout} = useContext(AuthContext);
  return (
    <ScrollView style={commonStyles.container}>
      <SafeAreaView>
        <SafeAreaView>
          <View style={{marginHorizontal: 20}}>
            <ButtonGoBack navigation={navigation} />
            <LogoSofy />

            {/* Account Setting Section */}
            <View style={{marginTop: 20}}>
              <Text
                variant="titleMedium"
                style={{fontWeight: 'bold', marginBottom: 10}}>
                Account Setting
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditPhoneNumber')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.backgroundSecondary,
                }}>
                <MaterialDesignIcons
                  name="phone"
                  size={24}
                  style={{marginRight: 10}}
                />
                <View style={{flex: 1}}>
                  <Text>Phone Number</Text>
                  <Text style={{color: colors.textSecondary}}>
                    573194268291
                  </Text>
                </View>
                <MaterialDesignIcons name="chevron-right" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {}}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.backgroundSecondary,
                }}>
                <MaterialDesignIcons
                  name="email"
                  size={24}
                  style={{marginRight: 10}}
                />
                <View style={{flex: 1}}>
                  <Text>Email</Text>
                  <Text style={{color: colors.textSecondary}}>
                    h95160746@gmail.com
                  </Text>
                </View>
                <MaterialDesignIcons name="chevron-right" size={24} />
              </TouchableOpacity>
            </View>

            {/* Location Section */}
            <View style={{marginTop: 20}}>
              <Text
                variant="titleMedium"
                style={{fontWeight: 'bold', marginBottom: 10}}>
                Location
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SeeLocation')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.backgroundSecondary,
                }}>
                <MaterialDesignIcons
                  name="map-marker"
                  size={24}
                  style={{marginRight: 10}}
                />
                <View style={{flex: 1}}>
                  <Text>Bogotá, Bogotá</Text>
                  <Text style={{color: colors.textSecondary}}>
                    Change locations to find matches anywhere.
                  </Text>
                </View>
                <MaterialDesignIcons name="chevron-right" size={24} />
              </TouchableOpacity>
            </View>

            {/* Contact Us Section */}
            <View style={{marginTop: 20}}>
              <Text
                variant="titleMedium"
                style={{fontWeight: 'bold', marginBottom: 10}}>
                Contact Us
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('ContactUs')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.backgroundSecondary,
                }}>
                <MaterialDesignIcons
                  name="help"
                  size={24}
                  style={{marginRight: 10}}
                />
                <Text>Help & Support</Text>
                <MaterialDesignIcons
                  name="chevron-right"
                  size={24}
                  style={{marginLeft: 'auto'}}
                />
              </TouchableOpacity>
            </View>

            {/* Privacy Section */}
            <View style={{marginTop: 20}}>
              <Text
                variant="titleMedium"
                style={{fontWeight: 'bold', marginBottom: 10}}>
                Privacy
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Privacy')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.backgroundSecondary,
                }}>
                <MaterialDesignIcons
                  name="lock"
                  size={24}
                  style={{marginRight: 10}}
                />
                <Text>Privacy Policy</Text>
                <MaterialDesignIcons
                  name="chevron-right"
                  size={24}
                  style={{marginLeft: 'auto'}}
                />
              </TouchableOpacity>
            </View>

            {/* Legal Section */}
            <View style={{marginTop: 20}}>
              <Text
                variant="titleMedium"
                style={{fontWeight: 'bold', marginBottom: 10}}>
                Legal
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('TermsAndServices')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.backgroundSecondary,
                }}>
                <MaterialDesignIcons
                  name="file"
                  size={24}
                  style={{marginRight: 10}}
                />
                <Text>Terms of Service</Text>
                <MaterialDesignIcons
                  name="chevron-right"
                  size={24}
                  style={{marginLeft: 'auto'}}
                />
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={() => logout()}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                marginTop: 20,
              }}>
              <MaterialDesignIcons
                name="logout"
                size={24}
                style={{marginRight: 10}}
              />
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>
  );
}
