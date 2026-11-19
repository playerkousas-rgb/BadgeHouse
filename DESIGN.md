# DESIGN · Scout Field · BadgeHouse v0.7.0

依[真理倉 Scout Field](https://github.com/playerkousas-rgb/readme/blob/4c63ac3096bf87fcff760b45b34adab14b1b2576/templates/repo-starter/docs/design-styles_v1.0.md)做導航與工具介面。戶外主題適合地圖；動作集中喺畫面，不用宣傳式 hero 或生成相片。

| Token | 色 |
|---|---|
| 背景 | `#f7f8f3` |
| 面板 | `#ffffff` |
| 文字 | `#22302a` |
| 次文字 | `#5c6b63` |
| 主動作 | `#2c5a3c` |
| 邊界 | `#d8e0da` |

- 核心文字／底色對比以 WCAG 計算：主字對背景 12.91:1、次字對背景 5.26:1、白字主掣 7.97:1。
- 介面用 system／Noto Sans TC，10–12px 圓角，實色無堆疊陰影。橙只用於地圖行程與位置，唔靠色單獨傳遞到達狀態。
- 手機以全寬場景、地區按鈕及到達後嘅下一步作同一構圖。SVG 點位有鍵盤操作，旁邊有原生按鈕，唔要求細細粒點位先去到。
- 動態係使用者觸發嘅 waypoint walk／step cycle，唔係入場表演；只調位置 transform；`prefers-reduced-motion` 跳至終點。無引入動畫 runtime。
- 3D 地球以點表示地區，旗幟及數字直接標識揀中或有屋嘅地區。旁邊地區清單顯示每一列嘅旗與屋數，無需分辨顏色或點中細點。空地區唔畫假門；屋內實物同原生按鈕對應同三類展示。
- 六條 critique、三寬以上實拍同雙軸審核見 [設計驗收](docs/design-review.md)。

## v0.7.0 增量

- Tokens 不變（背景 `#f7f8f3`、面板 `#ffffff`、文字 `#22302a`、次文字 `#5c6b63`、主動作 `#2c5a3c`、邊界 `#d8e0da`）；新增語意：`--input-line #7d8a80`（輸入框與下拉選單邊界）、`--tint #e9f0e7`（選定／現時頁面底）、`--ring #275a3b`（鍵盤焦點）。
- 對比（WCAG 2.x 公式，本機計算）：主字對背景 12.91:1；次字對背景 5.26:1；次字對白 5.62:1；白字主掣 7.97:1；主綠字對背景 7.47:1；次字對 tint 4.85:1；導覽字 `#4f6358` 對白 ≥6:1；輸入框邊界 `#7d8a80` 對白 3.61:1（≥3:1，WCAG 1.4.11）。
- 原有 `#d8e0da` 只做卡片裝飾邊界（對背景 1.26:1），唔再用作輸入框或唯一操作邊界。
- 觸控目標：掣、導覽、下拉、搜尋框 ≥44px；手機版導覽 56px。
- 指示：現時頁面用 `::after` 底線；選定地區用 `inset 3px` 左側單線，兩者都有文字或 `aria-pressed`／`aria-current`，唔靠顏色單獨傳遞。
- 唔做：陰影堆疊、漸層、玻璃模糊、emoji、橙色用於地圖以外位置、入場表演動畫。
- 版號：`0.7.0`（檔名、APP_VERSION、頁尾、`package.json`、測試）。
