// src/components/SummaryFooter.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';

export default function SummaryFooter({ total, onContinue }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleContinuePress = () => {
    if (total === 0) return;
    setModalVisible(true);
  };

  const handleProceed = () => {
    setModalVisible(false);
    if (typeof onContinue === 'function') onContinue();
  };

  return (
    <>
      <View style={styles.footer}>
        <View style={styles.countsRow}>
          <Text style={styles.totalText}>Total Dish Selected {total}</Text>
        </View>
        <View style={styles.separator} />
        <TouchableOpacity
          style={[styles.button, total === 0 && styles.buttonDisabled]}
          onPress={handleContinuePress}
          disabled={total === 0}
        >
          <Text
            style={[styles.buttonText, total === 0 && styles.buttonTextDisabled]}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Centered Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Thank you!</Text>
            <Text style={styles.modalMessage}>
              Thank you for reviewing it. Hoping for good news from your side.
            </Text>

            <View style={styles.modalButtonsRow}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonOutline]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonOutlineText}>Close</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleProceed}
              >
                <Text style={styles.modalButtonPrimaryText}>Proceed</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#FFFAF4',
  },
  countsRow: {
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 13,
    marginTop: 6,
    marginHorizontal: -20,
  },
  countText: { fontSize: 14, color: '#333' },
  totalText: { fontSize: 16, fontWeight: '600', color: '#111' },
  button: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#ddd' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  buttonTextDisabled: { color: '#888' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 18,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  modalButtonPrimary: {
    backgroundColor: '#111',
    marginLeft: 10,
  },
  modalButtonOutlineText: {
    color: '#111',
    fontWeight: '600',
  },
  modalButtonPrimaryText: {
    color: '#fff',
    fontWeight: '700',
  },
});
