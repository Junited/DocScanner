import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { Alert } from 'react-native';

class SharingService {
  /**
   * Share document image
   * @param {string} imageUri - URI of the image to share
   * @param {string} documentName - Name of the document
   */
  async shareImage(imageUri, documentName = 'Document') {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert(
          'Sharing Not Available',
          'Sharing is not available on this device'
        );
        return false;
      }

      await Sharing.shareAsync(imageUri, {
        mimeType: 'image/jpeg',
        dialogTitle: `Share ${documentName}`,
        UTI: 'public.jpeg',
      });

      return true;
    } catch (error) {
      console.error('Share image error:', error);
      Alert.alert('Error', 'Failed to share image');
      return false;
    }
  }

  /**
   * Share document as PDF with extracted data
   * @param {Object} document - Document object with data and imageUri
   */
  async shareDocument(document) {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert(
          'Sharing Not Available',
          'Sharing is not available on this device'
        );
        return false;
      }

      // For now, share the image. In the future, this could generate a PDF
      const documentName = document.data?.type || 'Document';
      await Sharing.shareAsync(document.imageUri, {
        mimeType: 'image/jpeg',
        dialogTitle: `Share ${documentName}`,
        UTI: 'public.jpeg',
      });

      return true;
    } catch (error) {
      console.error('Share document error:', error);
      Alert.alert('Error', 'Failed to share document');
      return false;
    }
  }

  /**
   * Share document data as text/JSON
   * @param {Object} documentData - Document data to share
   */
  async shareDocumentData(documentData) {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert(
          'Sharing Not Available',
          'Sharing is not available on this device'
        );
        return false;
      }

      // Create a temporary file with the document data
      const fileName = `document_data_${Date.now()}.json`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(documentData, null, 2),
        { encoding: 'utf8' }
      );

      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Share Document Data',
        UTI: 'public.json',
      });

      // Clean up temporary file
      await FileSystem.deleteAsync(fileUri, { idempotent: true });

      return true;
    } catch (error) {
      console.error('Share data error:', error);
      Alert.alert('Error', 'Failed to share document data');
      return false;
    }
  }

  /**
   * Share extracted text
   * @param {string} text - Text to share
   * @param {string} title - Title for the share dialog
   */
  async shareText(text, title = 'Share Text') {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert(
          'Sharing Not Available',
          'Sharing is not available on this device'
        );
        return false;
      }

      // Create a temporary text file
      const fileName = `text_${Date.now()}.txt`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, text, { encoding: 'utf8' });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: title,
        UTI: 'public.plain-text',
      });

      // Clean up temporary file
      await FileSystem.deleteAsync(fileUri, { idempotent: true });

      return true;
    } catch (error) {
      console.error('Share text error:', error);
      Alert.alert('Error', 'Failed to share text');
      return false;
    }
  }

  /**
   * Show share options menu
   * @param {Object} document - Document to share
   * @param {Function} callback - Callback after sharing
   */
  showShareOptions(document, callback) {
    Alert.alert(
      'Share Document',
      'Choose what to share',
      [
        {
          text: 'Share Image',
          onPress: async () => {
            const success = await this.shareImage(
              document.imageUri,
              document.data?.type || 'Document'
            );
            if (callback) callback(success);
          },
        },
        {
          text: 'Share Extracted Text',
          onPress: async () => {
            if (document.rawText) {
              const success = await this.shareText(
                document.rawText,
                `${document.data?.type || 'Document'} - Extracted Text`
              );
              if (callback) callback(success);
            } else {
              Alert.alert('No Text', 'No extracted text available to share');
            }
          },
        },
        {
          text: 'Share Data (JSON)',
          onPress: async () => {
            const success = await this.shareDocumentData(document);
            if (callback) callback(success);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  }
}

export default new SharingService();
