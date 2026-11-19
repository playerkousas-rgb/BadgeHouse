# Credits · © SCOUT SYSTEM

- 地圖：Natural Earth 1:110m land（公有領域），經 [World Atlas](https://github.com/topojson/world-atlas/tree/a912c0a22c3fbd1979cb6defdd6389d8c35e7c2a) 整理（[ISC 授權](public/static/licenses/LICENSE-world-atlas.txt)）。離線工具將資料預轉成 Equal Earth SVG 路徑及等距圓柱球面紋理；不向第三方傳送訪客定位。
- 小童軍、街坊、屋、傢俬同徽章示意：以 BadgeHouse 幾何原創繪製（WebGL 模型與 SVG 後備），不用生成照片或第三方美術素材。站點分享圖為同一組向量組成的靜態站務素材；app 不提供生成圖片服務。
- 「Noto Sans TC」UI subset 來自 [Google Fonts](https://github.com/google/fonts/tree/main/ofl/notosanstc)，附 [SIL Open Font License](public/static/fonts/OFL-Noto-Sans-TC.txt)。
- 工作流程與技能見[真理倉來源](https://github.com/playerkousas-rgb/readme/tree/4c63ac3096bf87fcff760b45b34adab14b1b2576)及[本倉技能目錄](skills/CATALOG.md)；無引入外部動效插件或示例圖片。
- 3D renderer： [three.js](https://github.com/mrdoob/three.js) `0.187.0`，附 [MIT 授權](public/static/licenses/LICENSE-three.txt)。
- 童軍地區：[Scoutworld](https://github.com/playerkousas-rgb/scoutworld/tree/9e1ec4d32c5d6cd3e4a96fdeed0dc610d6b34b56) 固定快照內五個 WOSM 區域、176 個 L2 條目。只取中英文地名、地區、代表座標、組織名稱、地區代碼及旗幟識別；不搬入會徽、聯絡資料、下級營地或全球分類。呢個係 Scoutworld 版本快照，唔係即時官方名冊；點位並非實際屋址。
- 旗幟：跟 Scoutworld 旗幟識別配對 [flag-icons](https://github.com/lipis/flag-icons) `7.6.0` 的本機 4:3 SVG（[MIT 授權](public/static/licenses/LICENSE-flag-icons.txt)）。重建：`python scripts/import-scoutworld.py <Scoutworld checkout> <flag-icons package directory>`。
- **組織標誌來源（v0.4.1）**：Scoutworld 快照的 `logoUrl` 是會徽參考，唔係會旗。只保留符合 WOSM 官方縮圖路徑嘅可點連結，唔下載、嵌入或向訪客預載。會旗另據[香港童軍總會政策通告 06/2022 附件二](https://www.scout.org.hk/uploads/tc/circulars/9926/pc-062022_c.pdf#page=4)、[日本童軍連盟公開規程第九章](https://www.scout.or.jp/about/regulations)及 [Scouts Canada 用品社圖片](https://www.scoutshop.ca/products/flag-hoist-sct-canada-50-x-36)，只作教育導覽；連結唔代表獲授權複製圖像或官方認可。
- **v0.7.0 設計參考**：版面及 tokens 沿用真理倉 [Scout Field](https://github.com/playerkousas-rgb/readme/blob/4c63ac3096bf87fcff760b45b34adab14b1b2576/templates/repo-starter/docs/design-styles_v1.0.md)；資源評估方法參考 [docs/23](https://github.com/playerkousas-rgb/readme/blob/d6241875f38971b6b8d0e5c9a86114289db0dd56/docs/23-design-resources.md)（commit `d624187`）。未引入新第三方圖標、插畫或字體；候選見 [設計資源評估](docs/design-resources.md)。

