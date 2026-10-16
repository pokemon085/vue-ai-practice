---
name: vue3-frontend-standards
description: Metrix SaaS Dashboard 的 Vue 3 前端開發規範與驗收流程。當使用者要求新增或修改元件、頁面、路由、Pinia store、SCSS 樣式與 RWD，或進行 Figma 設計稿轉前端、程式碼品質檢查時使用。不適用於非 Vue 專案或純後端任務。
---

# Vue 3 前端開發規範

本 Skill 定義本專案的架構、程式碼品質、樣式與驗收標準。所有由 AI 協助的開發任務都必須遵守，除使用者明確要求例外。

## 既有架構速查

| 目錄                        | 職責                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `src/views/`                | 路由頁面，負責版面組合與資料串接，不放細節 UI                                         |
| `src/components/layout/`    | 全站版型：`AppLayout`、`AppHeader`、`AppSidebar`、`AppBreadcrumbs`、`SidebarMenuItem` |
| `src/components/ui/`        | 通用 UI（`AppIcon`），不得依賴特定頁面資料                                            |
| `src/components/<feature>/` | 功能專屬元件，例如 `dashboard/`                                                       |
| `src/components/charts/`    | 圖表封裝（`BaseChart`，ECharts 採 `echarts/core` 模組化註冊）                         |
| `src/stores/`               | Pinia store：`ui.ts`（版面狀態）、`user.ts`（使用者資訊）                             |
| `src/router/index.ts`       | 路由設定與 `meta.title`                                                               |
| `src/data/`                 | 展示／選單資料，例如 `navigation.ts`、`dashboard.ts`                                  |
| `src/styles/`               | `_variables.scss`、`_mixins.scss`、`global.scss`                                      |
| `src/assets/`               | `icons/`（`index.ts` 匯出圖示別名）、`images/`                                        |

`composables/`、`types/`、`utils/` 尚未建立。只有當同一段邏輯出現第二個使用情境時才新增，不要為了形式預先建立空目錄或抽象層。

## A. 專案架構

- 沿用 Vue 3 + Vite + TypeScript + SCSS + Vue Router + Pinia，不得擅自改成 React、Tailwind 或 Vuetify。
- 新增檔案前，先確認現有目錄結構與可重用元件（用 Glob / Grep 搜尋既有實作），沿用既有命名與分層。
- 職責邊界：view 只做版面組合；可重用 UI 放 `components/ui`；特定業務放 `components/<feature>`；跨頁面狀態放 `stores`；靜態資料放 `data`。
- 不引入新的 UI 套件或狀態管理工具。需要新套件時先說明用途與替代方案，取得同意後才安裝。
- 不要為了形式建立過多資料夾或單層轉發的抽象層。

## B. Vue 元件設計

- 一律使用 Composition API 與 `<script setup lang="ts">`，不寫 Options API。
- Props / Emits 必須有 TypeScript 型別；有預設值時用 `withDefaults`，事件用 `defineEmits<{ ... }>()` 明確宣告。
- 大型頁面依「實際職責」拆成子元件，避免單一巨型元件；拆分的依據是重用性與職責，不是行數。
- 共用 UI 元件的 Props 要通用（如 `name`、`size`、`label`），不得直接依賴某個頁面的資料結構。
- 既有元件可重用時就不要另建相似元件；需要微調時優先擴充既有元件的 Props。
- 樣式一律 `scoped`；只有真正全域的設定放 `styles/global.scss`。

## C. 狀態管理

- 跨頁面或多個元件共用的狀態才放 Pinia（例如 `ui.ts` 的側欄狀態、`user.ts` 的使用者資訊）。
- 單一元件的表單、彈窗、下拉選單等局部狀態，優先使用 `ref` / `reactive`。
- 衍生資料優先評估 `computed`，不要用 `watch` 去同步一份可推導的狀態。
- 桌面端收合與手機端抽屜是不同的狀態（`sidebarCollapsed` / `mobileDrawerOpen`），不得合併為單一變數。
- 不要把所有狀態都塞進 Pinia，也不要無需求地把資料寫入 `localStorage`。

## D. TypeScript 與程式碼品質

- 優先使用明確型別：`type` / `interface`、函式回傳型別、可推導時才省略。
- 禁止 `any`；不確定型別時用 `unknown` 並在邊界收斂。禁止不必要的型別斷言（`as`）與非空斷言（`!`）。
- 非同步操作與 API 回應需依實際需求設計型別與錯誤處理；不得虛構 API 形狀。
- 共用型別放 `src/types/`，只被單一檔案使用時留在原檔。
- 不得為了讓 lint 通過而新增 `eslint-disable`、關閉規則或放寬設定；應修正根因。
- API 開發應沿用專案既有的共用請求封裝與 Service 架構，不得在各 Vue 元件中重複建立請求設定。
- 統一處理請求設定、回應與錯誤；錯誤需保留給呼叫端處理的能力，不得直接吞掉錯誤。
- 使用 Mock API 時，應將假資料與請求邏輯分離，並讓未來切換至真實 API 時不必大幅修改 Vue 元件。
- 新增 API 封裝或請求套件前，先檢查專案現況並提出計畫；未經使用者確認，不得擅自安裝套件或大幅調整架構。

## E. SCSS 與 RWD

- 使用 SCSS，沿用 `_variables.scss` 的設計 token 與 `_mixins.scss` 的 mixin。兩者已透過 Vite `additionalData` 自動注入所有 SFC，不需再 `@use`。
- 命名沿用既有 BEM-like 寫法：`.component__element--modifier`。
- 響應式一律用 `@include media-mobile / media-tablet / media-desktop`，斷點為 768px / 1280px，不要硬寫 `@media` 數字。
- 避免固定寬度造成溢出；優先用 grid / flex 與 `minmax`、`flex-wrap` 處理換行，而不是用 `overflow-x: hidden` 掩蓋問題。
- 控制巢狀層級（建議 3 層內），避免過度巢狀與 `!important`。
- 圓角沿用既有規範：6px、8px（輸入框／按鈕）、12px（卡片／彈窗）。

## F. Figma MCP 與 AI 輔助開發

- 先透過 Figma MCP 讀取設計稿，分析版面結構、間距、字體、顏色、圓角與元件層級，再開始實作。
- 先建立可重用的版型與共用元件，再加入互動與資料。
- 不要把整個頁面寫成單一大型元件。
- 不得虛構未提供的 API、資料或設計規格；不確定時明確說明假設，並標示為示意值。
- 圖示或素材無法從 Figma 取得時，直接說明，並以既有素材或色塊佔位，不要假裝已完全還原。
- 不擅自更換技術棧、不安裝大量套件、不重構與任務無關的程式碼。

## G. 開發驗收

每次完成開發任務後，依序執行並回報：

1. 說明修改了哪些檔案、每個檔案的修改原因與範圍。
2. `npm run lint` — ESLint 檢查（含 Vue 與 TypeScript 規則）。
3. `npm run format:check` — Prettier 格式檢查。
4. `npm run typecheck` — TypeScript 型別檢查。
5. `npm run build` — 完整建置（`vue-tsc --noEmit && vite build`）。
6. 回報錯誤、尚未驗證項目與需要人工確認的部分。

規則：

- 不得宣稱未實際執行的檢查已通過；指令失敗就貼出實際輸出。
- 無法實際驗證的項目（例如無法操作瀏覽器調整 viewport）要明確說明限制。
- 不得為了讓檢查通過而放寬設定或格式化無關的既有檔案；需要大範圍格式化時先詢問使用者。

## 可用指令

| 指令                   | 用途                            |
| ---------------------- | ------------------------------- |
| `npm run dev`          | 啟動 Vite 開發伺服器            |
| `npm run lint`         | ESLint 檢查                     |
| `npm run lint:fix`     | ESLint 自動修正可修項目         |
| `npm run format`       | Prettier 格式化                 |
| `npm run format:check` | Prettier 格式檢查（不修改檔案） |
| `npm run typecheck`    | `vue-tsc --noEmit`              |
| `npm run build`        | 型別檢查 + 生產建置             |
