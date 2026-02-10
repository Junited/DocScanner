import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import StorageService from '../services/StorageService';

const { width } = Dimensions.get('window');

export default function HistoryScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadDocuments();
    }, [])
  );

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await StorageService.getAllDocuments();
      setDocuments(docs.reverse()); // Show newest first
    } catch (error) {
      console.error('Load documents error:', error);
      Alert.alert('Error', 'Failed to load documents');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDocuments();
  };

  const handleDeleteDocument = async (id) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deleteDocument(id);
              loadDocuments();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete document');
            }
          },
        },
      ]
    );
  };

  const filters = ['All', 'Passport', 'ID Card', 'Receipt', 'Invoice', 'Contract'];

  const getCategoryColor = (category) => {
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
    return colors[category] || '#6B7280';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      JSON.stringify(doc).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'All' || 
      doc.documentType?.toLowerCase().includes(activeFilter.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="filter-outline" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterPill,
              activeFilter === filter && styles.filterPillActive,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Document Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'} found
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortText}>Sort by date</Text>
          <Ionicons name="chevron-down" size={16} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Documents List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc, index) => (
            <TouchableOpacity
              key={doc.id}
              style={[
                styles.documentCard,
                index === filteredDocuments.length - 1 && styles.documentCardLast,
              ]}
              onPress={() => navigation.navigate('DocumentPreview', { 
                imageUri: doc.imageUri,
                existingData: doc 
              })}
            >
              {/* Document Preview Thumbnail */}
              <View style={styles.documentThumbnail}>
                <MaterialCommunityIcons
                  name="file-document"
                  size={32}
                  color={getCategoryColor(doc.documentType)}
                />
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: getCategoryColor(doc.documentType) },
                  ]}
                >
                  <Text style={styles.categoryBadgeText}>1</Text>
                </View>
              </View>

              {/* Document Info */}
              <View style={styles.documentInfo}>
                <Text style={styles.documentName} numberOfLines={1}>
                  {doc.data?.type || 'Document'}
                </Text>
                <View style={styles.documentMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={12} color="#999" />
                    <Text style={styles.metaText}>{formatDate(doc.createdAt)}</Text>
                  </View>
                  {doc.languages && doc.languages.length > 0 && (
                    <>
                      <View style={styles.metaDot} />
                      <View style={styles.metaItem}>
                        <Ionicons name="language" size={12} color="#999" />
                        <Text style={styles.metaText}>{doc.languages[0]}</Text>
                      </View>
                    </>
                  )}
                </View>
                <View style={styles.documentFooter}>
                  <View
                    style={[
                      styles.categoryTag,
                      { backgroundColor: `${getCategoryColor(doc.documentType)}15` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryTagText,
                        { color: getCategoryColor(doc.documentType) },
                      ]}
                    >
                      {doc.documentType?.toUpperCase().replace('_', ' ') || 'UNKNOWN'}
                    </Text>
                  </View>
                  <Text style={styles.documentSize}>
                    {Math.round(doc.confidence * 100)}% confident
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.documentActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    // Share functionality
                  }}
                >
                  <Ionicons name="share-outline" size={20} color="#6366F1" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDeleteDocument(doc.id);
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={80}
              color="#E5E7EB"
            />
            <Text style={styles.emptyStateTitle}>No Documents Found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery || activeFilter !== 'All' 
                ? 'No documents match your search'
                : 'Start scanning documents to see them here'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Ionicons name="camera" size={28} color="#fff" />
      </TouchableOpacity>
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
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#6366F1',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  documentCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  documentCardLast: {
    marginBottom: 0,
  },
  documentThumbnail: {
    width: 70,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  categoryBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  documentInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CCC',
    marginHorizontal: 8,
  },
  documentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  documentSize: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  documentActions: {
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
});
