import React from 'react';
import {View, StyleSheet, Modal} from 'react-native';
import {Subscription} from 'react-native-iap';
import ContentInfoPlanConnect from './ContentInfoPlanConnect';

interface ModalInfoPlanConnectProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  productFromProfile: Subscription;
  userIdRef: number;
}

export default function ModalInfoPlanConnect({
  modalVisible,
  setModalVisible,
  productFromProfile,
  userIdRef,
}: ModalInfoPlanConnectProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <ContentInfoPlanConnect
          origin="modal"
          setModalVisible={setModalVisible}
          productFromProfile={productFromProfile}
          userIdRef={userIdRef}
        />
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
});
