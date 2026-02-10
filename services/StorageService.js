import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  DOCUMENTS: '@documents',
  SETTINGS: '@settings',
};

class StorageService {
  /**
   * Save a scanned document
   */
  async saveDocument(documentData) {
    try {
      const documents = await this.getAllDocuments();
      const newDocument = {
        id: Date.now().toString(),
        ...documentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      documents.push(newDocument);
      await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
      
      return newDocument;
    } catch (error) {
      console.error('Save Document Error:', error);
      throw error;
    }
  }

  /**
   * Get all documents
   */
  async getAllDocuments() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Get Documents Error:', error);
      return [];
    }
  }

  /**
   * Get document by ID
   */
  async getDocumentById(id) {
    try {
      const documents = await this.getAllDocuments();
      return documents.find(doc => doc.id === id);
    } catch (error) {
      console.error('Get Document Error:', error);
      return null;
    }
  }

  /**
   * Update document
   */
  async updateDocument(id, updates) {
    try {
      const documents = await this.getAllDocuments();
      const index = documents.findIndex(doc => doc.id === id);
      
      if (index !== -1) {
        documents[index] = {
          ...documents[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
        return documents[index];
      }
      
      return null;
    } catch (error) {
      console.error('Update Document Error:', error);
      throw error;
    }
  }

  /**
   * Delete document
   */
  async deleteDocument(id) {
    try {
      const documents = await this.getAllDocuments();
      const filtered = documents.filter(doc => doc.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Delete Document Error:', error);
      throw error;
    }
  }

  /**
   * Search documents
   */
  async searchDocuments(query) {
    try {
      const documents = await this.getAllDocuments();
      const lowerQuery = query.toLowerCase();
      
      return documents.filter(doc => {
        const searchableText = JSON.stringify(doc).toLowerCase();
        return searchableText.includes(lowerQuery);
      });
    } catch (error) {
      console.error('Search Documents Error:', error);
      return [];
    }
  }

  /**
   * Clear all data (use with caution)
   */
  async clearAll() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
      return true;
    } catch (error) {
      console.error('Clear All Error:', error);
      throw error;
    }
  }
}

export default new StorageService();
