import type { IconName } from '@/assets/icons'

/**
 * Dashboard 靜態示意資料。
 *
 * 文字與結構取自 Figma 節點「Dashboard」#12:9517。
 * 設計稿中的圖表（圓餅圖、長條圖）是匯出的 SVG 圖片，沒有可讀取的原始數據，
 * 因此圖表數值為依視覺比例推估的示意值；商品縮圖也因 Figma API 速率上限無法匯出，
 * 目前以佔位元件呈現。串接正式 API 時可直接替換本檔內容。
 */

export interface SummaryMetric {
  label: string
  value: string
  /** 與前期比較的增減文字，例如 '+20.00%' */
  delta?: string
  /** 增減顏色的語意：up = Action/Green，down = Action/Red */
  deltaTone?: 'up' | 'down'
  /** 標籤顏色：設計稿只有 Abandoned Cart 用 Action/Red，其餘為 Black/30 */
  labelTone?: 'muted' | 'danger'
}

export interface SummaryCardData {
  /** 卡片名稱，僅作為無障礙標示（設計稿的卡片本身沒有獨立標題文字） */
  title: string
  icon: IconName
  /** 圖示方塊底色：Sales 為藍色 tint、Customers 為橘色 tint */
  iconTone?: 'primary' | 'secondary'
  /** 設計稿右上角的篩選文字；未提供時不顯示 */
  filterLabel?: string
  /** 卡片底色：primary 對應設計稿中藍色的 All Products 卡片 */
  tone?: 'white' | 'primary'
  metrics: SummaryMetric[]
}

/** 上方三張並排的 Summary Card。 */
export const dashboardSummaryCards: SummaryCardData[] = [
  {
    title: 'Sales',
    icon: 'orders',
    filterLabel: 'This Week',
    metrics: [
      { label: 'Sales', value: '₦4,000,000.00' },
      { label: 'Volume', value: '450', delta: '+20.00%', deltaTone: 'up' },
    ],
  },
  {
    title: 'Customers',
    icon: 'customers',
    iconTone: 'secondary',
    filterLabel: 'This Week',
    metrics: [
      { label: 'Customers', value: '1,250', delta: '+15.80%', deltaTone: 'up' },
      { label: 'Active', value: '1,180', delta: '85%' },
    ],
  },
  {
    title: 'All Orders',
    icon: 'inventory',
    filterLabel: 'This Week',
    metrics: [
      { label: 'All Orders', value: '450' },
      { label: 'Pending', value: '5' },
      { label: 'Completed', value: '445' },
    ],
  },
]

/** 圓餅圖卡片（Marketting）右側的兩張 Summary Card。 */
export const dashboardSideCards: SummaryCardData[] = [
  {
    title: 'All Products',
    icon: 'inventory',
    tone: 'primary',
    metrics: [
      { label: 'All Products', value: '45' },
      { label: 'Active', value: '32', delta: '+24%', deltaTone: 'up' },
    ],
  },
  {
    title: 'Abandoned Cart',
    icon: 'orders',
    filterLabel: 'This Week',
    metrics: [
      {
        label: 'Abandoned Cart',
        value: '20%',
        delta: '+0.00%',
        deltaTone: 'down',
        labelTone: 'danger',
      },
      { label: 'Customers', value: '30' },
    ],
  },
]

/**
 * 圓餅圖的三個分類與顏色。
 * 顏色對應 styles/_variables.scss 的 $primary-100 / $primary-50 / $secondary-100
 * （SCSS 變數無法直接給 ECharts 使用，因此在此重複一份，修改時需同步）。
 */
export interface DonutKey {
  label: string
  color: string
  value: number
}

/** 圓餅圖卡片的標題（設計稿原文拼字為 Marketting，此處保留原樣） */
export const marketingTitle = 'Marketting'

export const marketingKeys: DonutKey[] = [
  { label: 'Acquisition', color: '#5570f1', value: 45 },
  { label: 'Purchase', color: '#97a5eb', value: 30 },
  { label: 'Retention', color: '#ffcc91', value: 25 },
]

/** 長條圖（Summary）：設計稿的 y 軸為 100k ～ 20k，共 7 天。 */
export const summaryBarChart = {
  /** 卡片標題與右上角的切換文字 */
  title: 'Summary',
  tabs: ['Sales', 'Last 7 Days'],
  /** y 軸上限（對應設計稿最上方的 100k） */
  max: 100000,
  /** y 軸刻度間距（對應 100k / 80k / 60k / 40k / 20k 五個標籤） */
  interval: 20000,
  barWidth: 13,
  color: '#5570f1',
  data: [
    { label: 'Sept 10', value: 82000 },
    { label: 'Sept 11', value: 46000 },
    { label: 'Sept 12', value: 64000 },
    { label: 'Sept 13', value: 31000 },
    { label: 'Sept 14', value: 75000 },
    { label: 'Sept 15', value: 52000 },
    { label: 'Sept 16', value: 88000 },
  ],
}

export type OrderStatus = 'Pending' | 'Completed'

export interface OrderItem {
  /** 商品名稱（設計稿 9 筆皆為同一示範資料） */
  name: string
  date: string
  amount: string
  status: OrderStatus
  /** 商品縮圖佔位色（設計稿有兩張不同的商品圖） */
  thumbTone: 'primary' | 'secondary'
}

/** Recent Orders：設計稿為 9 筆重複的示範資料，這裡保留同樣的筆數與狀態順序。 */
const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  'Pending',
  'Completed',
  'Pending',
  'Completed',
  'Completed',
  'Completed',
  'Pending',
  'Pending',
  'Pending',
]

const ORDER_THUMB_SEQUENCE: Array<OrderItem['thumbTone']> = [
  'primary',
  'secondary',
  'primary',
  'secondary',
  'secondary',
  'secondary',
  'primary',
  'primary',
  'primary',
]

/**
 * Recent Orders 的清單內容。
 * 設計稿的 Dashboard（#12:9517）在 Order Summary 區塊放的是「空狀態」變體，
 * 另一個同版面的影格（#64:25743）則是已填入訂單的變體；
 * 這裡採用已填入的版本，才能一併呈現 OrderCard 的元件結構。
 */
export const recentOrderPanelTitle = 'Recent Orders'

export const recentOrders: OrderItem[] = ORDER_STATUS_SEQUENCE.map((status, index) => ({
  name: 'iPhone 13',
  date: '12 Sept 2022',
  amount: '₦730,000.00 x 1',
  status,
  thumbTone: ORDER_THUMB_SEQUENCE[index],
}))
