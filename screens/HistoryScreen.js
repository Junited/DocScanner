import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Mock data for scanned documents
  const documents = [
    {
      id: 1,
      name: 'Invoice_March_2024',
      pages: 3,
      size: '2.4 MB',
      date: 'Mar 8, 2024',
      time: '10:30 AM',
      category: 'Invoice',
    },
    {
      id: 2,
      name: 'Receipt_Grocery_Store',
      pages: 1,
      size: '856 KB',
      date: 'Mar 7, 2024',
      time: '4:15 PM',
      category: 'Receipt',
    },
    {
      id: 3,
      name: 'Contract_Agreement',
      pages: 5,
      size: '3.8 MB',
      date: 'Mar 6, 2024',
      time: '2:20 PM',
      category: 'Contract',
    },
    {
      id: 4,
      name: 'ID_Card_Front',
      pages: 1,
      size: '1.2 MB',
      date: 'Mar 5, 2024',
      time: '11:45 AM',
      category: 'ID',
    },
    {
      id: 5,
      name: 'Business_Card_John',
      pages: 1,
      size: '645 KB',
      date: 'Mar 4, 2024',
      time: '9:00 AM',
      category: 'Business Card',
    },
    {
      id: 6,
      name: 'Report_Q1_2024',
      pages: 12,
      size: '5.6 MB',
      date: 'Mar 3, 2024',
      time: '3:30 PM',
      category: 'Report',
    },
    {
      id: 7,
      name: 'Receipt_Restaurant',
      pages: 1,
      size: '720 KB',
      date: 'Mar 2, 2024',
      time: '7:45 PM',
      category: 'Receipt',
    },
    {
      id: 8,
      name: 'Prescription_Medical',
      pages: 2,
      size: '1.5 MB',
      date: 'Mar 1, 2024',
      time: '1:15 PM',
      category: 'Medical',
    },
  ];

  const filters = ['All', 'Recent', 'Invoice', 'Receipt', 'Contract'];

  const getCategoryColor = (category) => {
    const colors = {
      Invoice: '#6366F1',
      Receipt: '#10B981',
      Contract: '#F59E0B',
      ID: '#EF4444',
      'Business Card': '#8B5CF6',
      Report: '#3B82F6',
      Medical: '#EC4899',
    };
    return colors[category] || '#6B7280';
  };

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
          {documents.length} {documents.length === 1 ? 'document' : 'documents'} found
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
      >
        {documents.map((doc, index) => (
          <TouchableOpacity
            key={doc.id}
            style={[
              styles.documentCard,
              index === documents.length - 1 && styles.documentCardLast,
            ]}
          >
            {/* Document Preview Thumbnail */}
            <View style={styles.documentThumbnail}>
              <MaterialCommunityIcons
                name="file-document"
                size={32}
                color="#6366F1"
              />
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: getCategoryColor(doc.category) },
                ]}
              >
                <Text style={styles.categoryBadgeText}>{doc.pages}</Text>
              </View>
            </View>

            {/* Document Info */}
            <View style={styles.documentInfo}>
              <Text style={styles.documentName} numberOfLines={1}>
                {doc.name}
              </Text>
              <View style={styles.documentMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={12} color="#999" />
                  <Text style={styles.metaText}>{doc.date}</Text>
                </View>
                <View style={styles.metaDot} />
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={12} color="#999" />
                  <Text style={styles.metaText}>{doc.time}</Text>
                </View>
              </View>
              <View style={styles.documentFooter}>
                <View
                  style={[
                    styles.categoryTag,
                    { backgroundColor: `${getCategoryColor(doc.category)}15` },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryTagText,
                      { color: getCategoryColor(doc.category) },
                    ]}
                  >
                    {doc.category}
                  </Text>
                </View>
                <Text style={styles.documentSize}>{doc.size}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.documentActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={20} color="#6366F1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#6366F1" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty State (shown when no documents match) */}
        {documents.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={80}
              color="#E5E7EB"
            />
            <Text style={styles.emptyStateTitle}>No Documents Found</Text>
            <Text style={styles.emptyStateText}>
              Start scanning documents to see them here
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
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
