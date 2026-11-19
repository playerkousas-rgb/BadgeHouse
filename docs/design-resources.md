# 設計資源評估 · BadgeHouse v0.7.0

> **點解有呢份**：跟住真理倉 [`docs/23 設計資源總索引`](https://github.com/playerkousas-rgb/readme/blob/d6241875f38971b6b8d0e5c9a86114289db0dd56/docs/23-design-resources.md)（2026-11-19 讀取，commit `d624187`）嘅方法：**只放連結＋摘要＋決定，唔複製內容**；每項都對應一條規則（W8 標來源、S1 唔整套塞入、S7 dist < 5MB）。
> 本頁係 BadgeHouse 自己嘅決定記錄；星星數同目錄以 23 原文為準。

## 1. 方法（同 23 §3 一致）

1. 先定**風格來源**：用真理倉 Scout Field（`design-styles_v1.0.md` A 套，pinned `4c63ac3`），唔搬品牌風格。
2. 揀 tokens：色、字、距、圓角落到 `DESIGN.md` 及 `style-v0.7.0.css`，唔散落 raw hex。
3. 每個素材：**授權核實 → 必要性 → 體積 → 決定**。唔需要就唔入。
4. 有用到先寫 `CREDITS.md`（W8）。

## 2. 候選與決定

| 類別 | 候選（來源） | 授權（核實） | 決定 | 理由 |
|---|---|---|---|---|
| 圖標 | [Lucide](https://github.com/lucide-icons/lucide) | ISC（商用可用） | **未引入**，保留現有內嵌 SVG | 現有 20 多個圖標已內嵌；引入 package 會加 bundle；若日後換用，要加 ISC 聲明入 `CREDITS.md` |
| 圖標 | [Iconify](https://icon-sets.iconify.design)（23 §5） | 各套授權不同 | 不採用 | 要逐套核授權，今次用唔到 |
| 字體 | Noto Sans TC（Google Fonts，23 §5） | SIL OFL 1.1 | **已用**（UI subset，既有） | 已入 `CREDITS.md`；中文 subset 控制體積 |
| 配色 | Realtime Colors／Coolors（23 §5） | 工具，唔影響授權 | 不採用 | 現有 Scout Field tokens 已覆蓋；改用本機 WCAG 計算 |
| 對比 | [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)（23 §5） | 工具 | **同等方法已做**：本機按 WCAG 2.x 公式計算（見 DESIGN.md） | 離線可重現，寫入 DESIGN.md |
| 插畫 | unDraw／Storyset（23 §5） | 可改色但要標來源 | 不採用 | 現有屋、街坊、傢俬為 BadgeHouse 原創幾何；插畫會打亂風格 |
| 3D 素材 | Kenney／KayKit／Quaternius（`docs/research.md` §3D 候選） | CC0（已核對，見該文） | 未匯入（另案） | 屬 v0.3 之後方向，體積與手機效能未測，需獨立試場 |
| UI library | shadcn／antd（23 §2.5、§5） | MIT | 不採用 | 單一 JS、零 build 框架傾向；加 library 會打破 S1 |
| 動效 | GSAP／motion-prompt（`skills/promoted/web-motion`） | GSAP 免費；motion-prompt MIT | 不採用 | 今次只做靜態視覺；動態屬用戶觸發，維持現有 reduced-motion 路線 |
| 配色靈感 | Nippon Colors、Adobe Color、Color Hunt（23 §5.1） | 工具／靈感 | 不採用 | 現有色票已定案；靈感唔等於授權 |
| 排版畫廊 | navbar.gallery、footer.design、cta.gallery（23 §5.3） | 靈感，唔可抄 | 只作詞彙參考 | 導覽、頁尾、按鈕結構參考，唔抄品牌外觀（W8） |

## 3. 本次實際用咗

- 真理倉 Scout Field tokens（已有）；WCAG 對比計算；Chromium 實拍三寬。
- **無新第三方檔**：`public/` 新增只有版號升級後嘅改名檔（同內容），冇新授權義務。

## 4. 下一步候選（未做）

- 「我嘅屋」設計表單用 `<details>` 分組，減少手機捲動（需要 DOM 改動，另一輪）。
- 如要換圖標系統：先經 Lucide（ISC）試一個子集，量度體積後再決定。
- 3D 街坊素材：按 `docs/research.md` 入庫條件另開試場。
