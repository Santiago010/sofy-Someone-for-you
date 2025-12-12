import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import LogoSofy from './LogoSofy';
import {colors} from '../theme/globalTheme';

interface ModalInfoPlanConnectProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

export default function ModalInfoPlanConnect({
  modalVisible,
  setModalVisible,
}: ModalInfoPlanConnectProps) {
  const benefits = [
    {
      icon: 'eye-outline',
      title: 'See Who Likes You',
    },
    {
      icon: 'eye-check',
      title: 'See Who Super Likes You',
    },
    {
      icon: 'message-badge',
      title: 'Unlimited Compliments & Super Likes',
    },
    {
      icon: 'comment-flash',
      title: 'Community Access & Admin Rights',
    },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <LogoSofy withMarginBotton={false} />

            <Text style={styles.title}>
              Connect with the most{'\n'}like-minded people without limits.
            </Text>

            <Text style={styles.subtitle}>What you get with Connect:</Text>

            <View style={styles.benefitsContainer}>
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <View style={styles.iconContainer}>
                    <MaterialDesignIcons
                      name={benefit.icon}
                      size={28}
                      color={colors.background}
                    />
                  </View>
                  <Text style={styles.benefitText}>{benefit.title}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.actionButtonText}>Get Sofy Connect™</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderRadius: 20,
    width: '90%',
    maxHeight: '85%',
    padding: 30,
  },
  scrollContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  benefitsContainer: {
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  benefitText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
