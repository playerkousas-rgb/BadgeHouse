# DESIGN · Scout Field · BadgeHouse v0.6.0

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
