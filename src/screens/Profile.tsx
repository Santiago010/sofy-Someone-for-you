import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
} from 'react-native';
import {colors, commonStyles} from '../theme/globalTheme';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {data} from '../animations/data/data';
import {ModalInfoUser} from '../components/ModalInfoUser';
import {AuthContext} from '../context/authContext/authContext';
import {resolveLocalhostUrl} from '../helpers/GetImageTemp';

export const Profile = () => {
  const [dataInfouser, setdataInfouser] = useState({
    name: '',
    lastName: '',
    age: '',
    profile: '',
  });

  const {detailsUser} = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    if (detailsUser !== null) {
      setdataInfouser({
        name: detailsUser.name,
        lastName: detailsUser.lastname,
        age: `${detailsUser.age}`,
        profile: detailsUser.individualFiles[0].file.url,
      });
    }
    console.log(detailsUser);
  }, [detailsUser]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={commonStyles.content}>
          <View style={styles.styleBoxOne}>
            {/* Foto de perfil circular centrada */}
            <View style={styles.profileImageContainer}>
              <TouchableOpacity
                style={styles.profileImage}
                onPress={toggleModal}>
                {dataInfouser.profile.length !== 0 ? (
                  <Image
                    source={{uri: resolveLocalhostUrl(dataInfouser.profile)}}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.profileImageText}>👤</Text>
                )}
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.cardFooterName}>
                  {dataInfouser?.name} {dataInfouser?.lastName}
                </Text>
                <Text style={styles.cardFooterAge}>, </Text>
                <Text style={styles.cardFooterAge}>{dataInfouser.age}</Text>
              </View>
            </View>

            {/* Tres botones de acción */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={{
                  ...styles.actionButton,
                }}
                onPress={() =>
                  navigation.navigate('StackSettingsApps' as never)
                }>
                <MaterialDesignIcons
                  name="cog"
                  size={43}
                  color={colors.secondary}
                />
                <Text
                  style={{...styles.actionButtonText, color: colors.secondary}}>
                  Setting
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  ...styles.actionButton,
                  ...styles.actionButtonProfile,
                }}
                onPress={() => navigation.navigate('EditProfile' as never)}>
                <MaterialDesignIcons
                  name="face-man-profile"
                  size={43}
                  color={colors.primary}
                />
                <Text
                  style={{...styles.actionButtonText, color: colors.primary}}>
                  Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  ...styles.actionButton,
                }}
                onPress={() => navigation.navigate('EditPhotos' as never)}>
                <MaterialDesignIcons
                  name="plus-box-multiple"
                  size={43}
                  color={colors.secondary}
                />
                <Text
                  style={{...styles.actionButtonText, color: colors.secondary}}>
                  Photos
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Segundo contenedor */}
          <View style={styles.styleBoxTwo}>
            <Text style={styles.platinumTitle}>Sofy Platinum™</Text>
            <Text style={styles.platinumSubtitle}>
              Level up every action you take on Sofy
            </Text>

            {/* Botón principal */}
            <TouchableOpacity style={styles.platinumButton}>
              <Text style={styles.platinumButtonText}>GET Sofy PLATINUM™</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {detailsUser !== null ? (
        <ModalInfoUser
          user={detailsUser}
          modalVisible={modalVisible}
          completeInfo={false}
          toggleModal={toggleModal}
        />
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.backgroundSecondary,
  },
  cardFooterName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  name: {
    color: colors.text,
    fontSize: 22,
  },
  styleBoxOne: {
    justifyContent: 'space-evenly',
    height: 539,
    backgroundColor: colors.background,
    borderRadius: 66,
    margin: 15,
    padding: 20,
    shadowColor: colors.textSecondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    ...(Platform.OS === 'android' && {
      top: 0,
      marginTop: 20,
      height: 480,
    }),
    ...(Platform.OS === 'ios' && {
      top: -99,
    }),
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 193,
    height: 193,
    borderRadius: 50,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  profileImageText: {
    fontSize: 99,
  },
  image: {
    width: 193,
    height: 193,
    resizeMode: 'cover',
    borderRadius: 50,
  },
  actionButtonProfile: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 50,
    top: 33,
    padding: 18,
    shadowColor: colors.textSecondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardFooterAge: {
    fontSize: 26,
    color: colors.text,
  },
  progressContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  progressText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionButtonIcon: {
    fontSize: 39,
    marginBottom: 5,
  },
  actionButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  styleBoxTwo: {
    backgroundColor: colors.background,
    margin: 15,
    marginTop: 5,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    ...(Platform.OS === 'android' && {
      marginTop: 15,
    }),
  },
  platinumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  platinumSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text,
    marginHorizontal: 3,
  },
  dotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textDisabled,
    marginHorizontal: 3,
  },
  platinumButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  platinumButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
