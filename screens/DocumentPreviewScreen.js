import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system/legacy';
import OpenAIService from '../services/OpenAIService';
import StorageService from '../services/StorageService';

const { width } = Dimensions.get('window');

export default function DocumentPreviewScreen({ route, navigation }) {
  const { imageUri, existingData } = route.params;
  const [analyzing, setAnalyzing] = useState(!existingData);
  const [documentData, setDocumentData] = useState(existingData || null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(existingData?.data || null);
  const [showRawText, setShowRawText] = useState(false);

  useEffect(() => {
    if (!existingData) {
      analyzeDocument();
    }
  }, []);

  const analyzeDocument = async () => {
    try {
      setAnalyzing(true);
      setError(null);

      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });

      // Analyze with OpenAI
      const result = await OpenAIService.analyzeDocument(base64);
      setDocumentData(result);
      setEditedData(result.data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze document');
      Alert.alert('Error', err.message || 'Failed to analyze document');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const documentToSave = {
        imageUri,
        ...documentData,
        data: editedData || documentData.data,
      };

      if (existingData && existingData.id) {
        // Update existing document
        await StorageService.updateDocument(existingData.id, documentToSave);
      } else {
        // Save new document
        await StorageService.saveDocument(documentToSave);
      }

      Alert.alert(
        'Success',
        existingData ? 'Document updated successfully!' : 'Document saved successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('History'),
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (key, value) => {
    setEditedData({
      ...editedData,
      [key]: value,
    });
  };

  const renderFieldValue = (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return (
          <View style={styles.arrayContainer}>
            {value.map((item, index) => (
              <View key={index} style={styles.arrayItem}>
                <Text style={styles.arrayItemTitle}>Item {index + 1}</Text>
                {typeof item === 'object' ? (
                  Object.entries(item).map(([k, v]) => (
                    <Text key={k} style={styles.arrayItemText}>
                      {k}: {String(v)}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.arrayItemText}>{String(item)}</Text>
                )}
              </View>
            ))}
          </View>
        );
      } else {
        return (
          <View style={styles.nestedObject}>
            {Object.entries(value).map(([k, v]) => (
              <View key={k} style={styles.nestedField}>
                <Text style={styles.nestedKey}>{k}:</Text>
                <Text style={styles.nestedValue}>{String(v)}</Text>
              </View>
            ))}
          </View>
        );
      }
    }

    if (editMode && typeof value === 'string') {
      return (
        <TextInput
          style={styles.editInput}
          value={editedData[key] || value}
          onChangeText={(text) => handleEdit(key, text)}
          multiline
        />
      );
    }

    return <Text style={styles.fieldValue}>{String(value)}</Text>;
  };

  const getDocumentIcon = (type) => {
    const icons = {
      passport: 'passport',
      id_card: 'card-account-details',
      driver_license: 'card-account-details',
      receipt: 'receipt',
      invoice: 'file-document',
      business_card: 'card-account-details-outline',
      prescription: 'medical-bag',
      contract: 'file-sign',
      generic: 'file-document-outline',
    };
    return icons[type] || 'file-document-outline';
  };

  const getDocumentColor = (type) => {
    const colors = {
      passport: '#6366F1',
      id_card: '#EF4444',
      driver_license: '#F59E0B',
      receipt: '#10B981',
      invoice: '#3B82F6',
      business_card: '#8B5CF6',
      prescription: '#EC4899',
      contract: '#F59E0B',
      generic: '#6B7280',
    };
    return colors[type] || '#6B7280';
  };

  if (analyzing) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Analyzing document...</Text>
        <Text style={styles.loadingSubtext}>
          Using AI to extract and structure data
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar style="dark" />
        <MaterialCommunityIcons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorTitle}>Analysis Failed</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={analyzeDocument}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Document Preview</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setEditMode(!editMode)}
        >
          <Ionicons
            name={editMode ? 'checkmark' : 'create-outline'}
            size={24}
            color="#6366F1"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Preview */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
        </View>

        {/* Document Type Card */}
        <View style={styles.typeCard}>
          <View
            style={[
              styles.typeIconContainer,
              { backgroundColor: `${getDocumentColor(documentData.documentType)}20` },
            ]}
          >
            <MaterialCommunityIcons
              name={getDocumentIcon(documentData.documentType)}
              size={32}
              color={getDocumentColor(documentData.documentType)}
            />
          </View>
          <View style={styles.typeInfo}>
            <Text style={styles.typeLabel}>Document Type</Text>
            <Text style={styles.typeName}>{documentData.data.type}</Text>
          </View>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>
              {Math.round(documentData.confidence * 100)}%
            </Text>
          </View>
        </View>

        {/* Languages Detected */}
        {documentData.languages && documentData.languages.length > 0 && (
          <View style={styles.languagesCard}>
            <Text style={styles.sectionTitle}>Languages Detected</Text>
            <View style={styles.languagesList}>
              {documentData.languages.map((lang, index) => (
                <View key={index} style={styles.languageChip}>
                  <Ionicons name="language" size={16} color="#6366F1" />
                  <Text style={styles.languageText}>{lang}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Extracted Data */}
        <View style={styles.dataCard}>
          <View style={styles.dataHeader}>
            <Text style={styles.sectionTitle}>Extracted Data</Text>
            {editMode && (
              <Text style={styles.editHint}>Tap to edit</Text>
            )}
          </View>
          
          {Object.entries(documentData.data)
            .filter(([key]) => key !== 'type')
            .map(([key, value]) => (
              <View key={key} style={styles.field}>
                <Text style={styles.fieldLabel}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Text>
                {renderFieldValue(key, value)}
              </View>
            ))}
        </View>

        {/* Raw Text Toggle */}
        <TouchableOpacity
          style={styles.rawTextToggle}
          onPress={() => setShowRawText(!showRawText)}
        >
          <Text style={styles.rawTextToggleText}>
            {showRawText ? 'Hide' : 'Show'} Raw Extracted Text
          </Text>
          <Ionicons
            name={showRawText ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#6366F1"
          />
        </TouchableOpacity>

        {showRawText && (
          <View style={styles.rawTextCard}>
            <Text style={styles.rawTextTitle}>Raw Text</Text>
            <Text style={styles.rawText}>{documentData.rawText}</Text>
          </View>
        )}

        {/* Additional Info */}
        {documentData.additionalInfo && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <Text style={styles.infoText}>{documentData.additionalInfo}</Text>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.metadataCard}>
          <Text style={styles.metadataTitle}>Analysis Details</Text>
          <View style={styles.metadataRow}>
            <Ionicons name="calendar-outline" size={16} color="#999" />
            <Text style={styles.metadataText}>
              {new Date(documentData.analyzedAt).toLocaleString()}
            </Text>
          </View>
          <View style={styles.metadataRow}>
            <Ionicons name="hardware-chip-outline" size={16} color="#999" />
            <Text style={styles.metadataText}>{documentData.model}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color="#666" />
          <Text style={styles.secondaryButtonText}>
            {existingData ? 'Close' : 'Cancel'}
          </Text>
        </TouchableOpacity>

        {!existingData && (
          <TouchableOpacity
            style={[styles.primaryButton, saving && styles.primaryButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark" size={24} color="#fff" />
                <Text style={styles.primaryButtonText}>Save Document</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {existingData && editMode && (
          <TouchableOpacity
            style={[styles.primaryButton, saving && styles.primaryButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="save-outline" size={24} color="#fff" />
                <Text style={styles.primaryButtonText}>Update</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 20,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#6366F1',
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  backButton: {
    marginTop: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    backgroundColor: '#fff',
    padding: 16,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  typeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeInfo: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  typeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  confidenceBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  languagesCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  languagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  languageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  dataCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  dataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  editHint: {
    fontSize: 12,
    color: '#6366F1',
    fontStyle: 'italic',
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 22,
  },
  editInput: {
    fontSize: 16,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#6366F1',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F8F9FF',
  },
  arrayContainer: {
    gap: 8,
  },
  arrayItem: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#6366F1',
  },
  arrayItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginBottom: 6,
  },
  arrayItemText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  nestedObject: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  nestedField: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  nestedKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  nestedValue: {
    fontSize: 14,
    color: '#1A1A1A',
    flex: 1,
  },
  rawTextToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  rawTextToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  rawTextCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  rawTextTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  rawText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    fontFamily: 'Courier',
  },
  infoCard: {
    backgroundColor: '#FFF7ED',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  infoText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
    marginTop: 8,
  },
  metadataCard: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
  },
  metadataTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  metadataText: {
    fontSize: 13,
    color: '#999',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  primaryButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#6366F1',
    borderRadius: 12,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
