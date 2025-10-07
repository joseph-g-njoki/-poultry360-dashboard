// User types
export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'manager' | 'worker';
  phone?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Farm types
export interface Farm {
  id: number;
  name: string;
  location: string;
  owner_id: number;
  owner_name?: string;
  capacity: number;
  current_stock: number;
  farm_type: 'broiler' | 'layer' | 'mixed';
  created_at: string;
  updated_at: string;
  // Stats
  total_batches?: number;
  total_birds?: number;
  active_birds?: number;
  active_batches?: number;
}

export interface FarmFormData {
  name: string;
  location: string;
  owner_id?: number;
  capacity: number;
  farm_type: 'broiler' | 'layer' | 'mixed';
}

// Poultry Batch types
export interface PoultryBatch {
  id: number;
  batch_number: string;
  farm_id: number;
  farm_name?: string;
  poultry_type: 'broiler' | 'layer';
  breed: string;
  initial_count: number;
  current_count: number;
  arrival_date: string;
  age_weeks: number;
  status: 'active' | 'completed' | 'transferred';
  notes?: string;
  created_at: string;
  updated_at: string;
  // Stats
  total_mortality?: number;
  mortality_rate?: number;
  survival_rate?: number;
  total_eggs?: number;
  total_feed_kg?: number;
  avg_daily_eggs?: number;
}

export interface BatchFormData {
  batch_number: string;
  farm_id: number;
  poultry_type: 'broiler' | 'layer';
  breed: string;
  initial_count: number;
  current_count: number;
  arrival_date: string;
  age_weeks: number;
  status?: 'active' | 'completed' | 'transferred';
  notes?: string;
}

// Feed Record types
export interface FeedRecord {
  id: number;
  batch_id: number;
  batch_number?: string;
  feed_type: string;
  quantity_kg: number;
  cost?: number;
  date_fed: string;
  notes?: string;
  fed_by: number;
  fed_by_name?: string;
  created_at: string;
}

export interface FeedRecordFormData {
  batch_id: number;
  feed_type: string;
  quantity_kg: number;
  cost?: number;
  date_fed: string;
  notes?: string;
}

// Production Record types
export interface ProductionRecord {
  id: number;
  batch_id: number;
  batch_number?: string;
  date_recorded: string;
  eggs_collected: number;
  broken_eggs?: number;
  abnormal_eggs?: number;
  notes?: string;
  collected_by: number;
  collected_by_name?: string;
  created_at: string;
}

export interface ProductionRecordFormData {
  batch_id: number;
  date_recorded: string;
  eggs_collected: number;
  broken_eggs?: number;
  abnormal_eggs?: number;
  notes?: string;
}

// Mortality Record types
export interface MortalityRecord {
  id: number;
  batch_id: number;
  batch_number?: string;
  date_recorded: string;
  mortality_count: number;
  cause?: string;
  notes?: string;
  recorded_by: number;
  recorded_by_name?: string;
  created_at: string;
}

// Dashboard types
export interface DashboardOverview {
  farms: number;
  flocks: number;
  totalBirds: number;
  todayEggs: number;
  mortalityToday: number;
  totalMortality: number;
}

export interface Activity {
  type: 'feed' | 'production' | 'health' | 'mortality';
  date: string;
  description: string;
  performed_by?: string;
  farm_name?: string;
}

export interface ProductionPerformance {
  farm_name: string;
  batch_number: string;
  current_count: number;
  avg_daily_eggs: number;
  laying_rate_percent: number;
  total_eggs_30days: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// Daily Record types (for mobile app integration)
export interface DailyRecordFormData {
  date: string;
  farmId: number;
  flockId: number;
  eggsCollected: number;
  feedUsedKg: number;
  mortality: number;
  treatments?: string;
  notes?: string;
}