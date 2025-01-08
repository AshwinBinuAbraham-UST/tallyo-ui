export interface Product {
  _id: string
  createdAt: string
  lastUpdated: string
  deletedAt: null | string
  productCode: string
  productName: string
  productCost: number
  status: string
  imageUrl: string | null
  productCount: number
  __category__: {
    _id: string
    createdAt: string
    lastUpdated: string
    deletedAt: null | string
    categoryName: string
    categoryCode: string
  }
}
export interface Category {
  _id: string
  categoryName: string
  categoryCode: string
}
export interface TransactionItem {
  productCode: string
  productCost: number
  productId: string
  productName: string
  quantity: number
}

export interface Transaction {
  amount: number
  createdAt: string
  status: 'pending' | 'completed' | 'failed'
  transactionCode: string
  transactionItems: TransactionItem[]
  userCode: string
  username: string
}

export interface Category {
  categoryCode: string
  categoryName: string
  createdAt: string
  deletedAt: string | null
  lastUpdated: string
  __products__: Product[]
}

export interface Employee {
  accountStatus: 'active' | 'inactive' | 'suspended'
  createdAt: string
  deletedAt: string | null
  lastLogin: string
  lastUpdated: string
  phone: string | null
  pin: string
  profilePicture: string | null
  wallet: string
  walletLimit: string
  _id: string
}
export interface Orders{
  empCode: string
  orders:Partial<Product[]>
}
export interface Store {
  createdAt: string
  deletedAt: string | null
  lastLogin: string
  lastUpdated: string
  phone: string
  storeType: string
  storeLocation: string
  starRating:string
  logoUrl:string|null
  imageUrl:string|null
  _id: string
}

export interface User {
  createdAt: string
  deletedAt: string | null
  email: string
  fullName: string
  lastUpdated: string
  password: string
  role: 'employee' | 'admin' | 'store'
  status: 'active' | 'inactive' | 'suspended'
  userCode: string
  employee: Employee
  __store__: Store
  _id: string
}

export interface Summary {
  rating: number
  totalProducts: string
  totalTransactions: string
  totalUsers: string
}
