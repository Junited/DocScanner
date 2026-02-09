import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [scannedImage, setScannedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);

  // Mock data for recent scans
  const recentScans = [
    { id: 1, name: 'Invoice_2024', pages: 3, date: '2 hours ago' },
    { id: 2, name: 'Receipt_Grocery', pages: 1, date: 'Yesterday' },
    { id: 3, name: 'Contract_Document', pages: 5, date: '2 days ago' },
  ];

  // Handle camera launch
  const handleOpenCamera = async () => {
    if (!cameraPermission) {
      return;
    }

    if (!cameraPermission.granted) {
      const { granted } = await requestCameraPermission();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Camera permission is needed to scan documents.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    setShowCamera(true);
  };

  // Handle taking a photo
  const handleTakePhoto = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setScannedImage(photo.uri);
        setShowCamera(false);
        Alert.alert(
          'Document Captured!',
          'Your document has been scanned successfully.',
          [{ text: 'OK' }]
        );
      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
      }
    }
  };

  // Handle gallery upload
  const handleGalleryUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Gallery permission is needed to upload documents.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setScannedImage(result.assets[0].uri);
      Alert.alert(
        'Document Uploaded!',
        'Your document has been uploaded successfully.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.headerTitle}>Document Scanner</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Scan Button Card */}
        <View style={styles.scanCard}>
          <View style={styles.scanCardContent}>
            {scannedImage ? (
              <>
                <Image
                  source={{ uri: scannedImage }}
                  style={styles.scannedImagePreview}
                  resizeMode="cover"
                />
                <View style={styles.previewOverlay}>
                  <TouchableOpacity
                    style={styles.rescanButton}
                    onPress={handleOpenCamera}
                  >
                    <Ionicons name="camera" size={20} color="#fff" />
                    <Text style={styles.rescanText}>Scan Again</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <MaterialCommunityIcons 
                  name="scanner" 
                  size={48} 
                  color="#fff" 
                  style={styles.scanIcon}
                />
                <Text style={styles.scanCardTitle}>Ready to Scan</Text>
                <Text style={styles.scanCardSubtitle}>
                  Tap the button below to start scanning a document
                </Text>
                
                <TouchableOpacity 
                  style={styles.scanButton}
                  onPress={handleOpenCamera}
                >
                  <View style={styles.scanButtonInner}>
                    <Ionicons name="camera" size={32} color="#fff" />
                  </View>
                </TouchableOpacity>
                
                <Text style={styles.scanButtonLabel}>Start Scanning</Text>
              </>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleGalleryUpload}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="images-outline" size={24} color="#2196F3" />
              </View>
              <Text style={styles.actionText}>From Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="document-text-outline" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.actionText}>Import PDF</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="share-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Scans */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.recentScans}>
            {recentScans.map((scan) => (
              <TouchableOpacity key={scan.id} style={styles.scanItem}>
                <View style={styles.scanItemIcon}>
                  <MaterialCommunityIcons 
                    name="file-document-outline" 
                    size={28} 
                    color="#6366F1" 
                  />
                </View>
                <View style={styles.scanItemInfo}>
                  <Text style={styles.scanItemName}>{scan.name}</Text>
                  <Text style={styles.scanItemDetails}>
                    {scan.pages} {scan.pages === 1 ? 'page' : 'pages'} • {scan.date}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Activity</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Pages Scanned</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={() => setShowCamera(false)}
      >
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            ref={(ref) => setCameraRef(ref)}
            facing="back"
          >
            {/* Camera Header */}
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                style={styles.cameraCloseButton}
                onPress={() => setShowCamera(false)}
              >
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Scan Document</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Camera Controls */}
            <View style={styles.cameraControls}>
              <View style={styles.cameraGuide}>
                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />
              </View>
              
              <View style={styles.cameraActions}>
                <TouchableOpacity style={styles.cameraGalleryButton} onPress={handleGalleryUpload}>
                  <Ionicons name="images" size={28} color="#fff" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.cameraCaptureButton}
                  onPress={handleTakePhoto}
                >
                  <View style={styles.cameraCaptureInner} />
                </TouchableOpacity>
                
                <View style={{ width: 60 }} />
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  scanCard: {
    margin: 20,
    marginTop: 24,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  scanCardContent: {
    padding: 32,
    alignItems: 'center',
  },
  scanIcon: {
    marginBottom: 16,
    opacity: 0.9,
  },
  scanCardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  scanCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  scanButton: {
    marginBottom: 12,
  },
  scanButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  scanButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  recentScans: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
  },
  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  scanItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scanItemInfo: {
    flex: 1,
  },
  scanItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  scanItemDetails: {
    fontSize: 13,
    color: '#666',
  },
  statsCard: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6366F1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  scannedImagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  previewOverlay: {
    alignItems: 'center',
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
  },
  rescanText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cameraCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
  },
  cameraGuide: {
    width: width * 0.85,
    height: width * 0.85 * 1.4,
    alignSelf: 'center',
    marginBottom: 40,
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#fff',
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#fff',
    borderTopRightRadius: 8,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#fff',
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#fff',
    borderBottomRightRadius: 8,
  },
  cameraActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cameraGalleryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cameraCaptureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  cameraCaptureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
});
