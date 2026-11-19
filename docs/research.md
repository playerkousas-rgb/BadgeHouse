# P1：GitHub 相近作品及決定

## 世界／屋編輯 v0.2.0

| 來源（已查 GitHub README／專案） | 可借鑑 | BadgeHouse 做法 |
|---|---|---|
| [WorkAdventure](https://github.com/workadventure/workadventure/tree/5a702ae9c547074a4cee02ba15949e70f6b03f0e)：瀏覽器內以角色行走，進入自訂虛擬場景 | 移動同踏入新場景應該係真正互動，而唔係卡片按入去 | 只借體驗概念；不用佢嘅引擎、程式碼、圖資、聊天、視像或多人同步 |
| [Tiled](https://github.com/mapeditor/tiled/tree/b322627cfbf8bf462c527a3cb09e5dea5fb6679e)：把地圖拆成層、物件、屬性 | 將世界、街坊、屋同屋內擺設分開；客製設定唔儲存成圖片 | 第一版用安全列舉儲存配色／屋頂／擺設，唔嵌專業地圖編輯器、唔複製程式碼或素材 |
| [World Atlas](https://github.com/topojson/world-atlas/tree/a912c0a22c3fbd1979cb6defdd6389d8c35e7c2a)：Natural Earth 邊界資料 | 真實海岸線，地區位置用座標投影 | 採用 110m land 資料預轉 SVG 路徑；零遠端瓦片請求，唔帶地圖引擎，授權入 [CREDITS](../CREDITS.md) |

無 fork 上述作品，未宣稱相容。現有 BadgeHouse 嘅 IndexedDB 藏品、備份格式同相片處理沿用，避免介面改版導致舊藏品消失。

## 交換社群背景

- [The Scout Swap Shop](https://sne.tripod.com/swapshop.htm)：舊式跨地區換章刊登；BadgeHouse 以收藏者嘅屋同展品為入口，不強制公開電郵。
- [The History of Patch Trading](https://scouttrader.org/collecting/History.pdf)：活動交換有歷史與地域脈絡，唔代表現行世界大露營官方規則，站內守則待用戶確認。

## 立體場景 v0.3.0

查閱 [three.js](https://github.com/mrdoob/three.js/tree/3bae6906de8f57219a7d61dc6ce2cba7b34ca249) 同 MIT 專案 [three-gltf-viewer](https://github.com/donmccurdy/three-gltf-viewer)。前者提供材質、相機、拾取及 WebGL；後者適合展示通用外來模型，暫毋須引入 glTF 匯入或完整編輯器。採用 three.js 固定版號，所有模型由本倉幾何組成；沿用原有 SVG 作無 WebGL 後備。

## Scoutworld 地區資料 v0.4.0

用戶指定嘅 [Scoutworld 快照](https://github.com/playerkousas-rgb/scoutworld/tree/9e1ec4d32c5d6cd3e4a96fdeed0dc610d6b34b56) 將 WOSM 區域與成員地區分開。只取 L2 位置事實；排除 L3+ 營地及全球分類。五區分別係非洲 42、美洲 35、阿拉伯 19、亞太 33、歐洲 47。覆蓋範圍係探訪入口，唔係要為每處自動開屋；屋數由 BadgeHouse 自己嘅屋記錄計算。旗幟及授權見 [Credits](../CREDITS.md)。

## 3D 屋、室內及街道素材候選（未匯入）

| 候選 | 已核對 | BadgeHouse 取捨 |
|---|---|---|
| [Kenney City Kit (Suburban) 2.0](https://kenney.nl/assets/city-kit-suburban)、[City Kit (Roads) 2.2](https://kenney.nl/assets/city-kit-roads) | 官方頁標示免費 CC0、分別 40／90 件 | 借用住宅外觀同街道拼件，優先用行人路、街角；唔做四線大馬路。住宅外殼獨立放，門口動線仍由 BadgeHouse 控制，唔假設模型可以直接入內。 |
| [Kenney Holiday Kit 2.0](https://kenney.nl/assets/holiday-kit)、[Nature Kit](https://kenney.nl/assets/nature-kit) | 官方頁標示免費 CC0；有木屋、樹、石等類型 | 加拿大示範屋先試木屋同松林，只揀需要嘅件，唔搬節日裝飾或整包。 |
| [KayKit Furniture Bits 1.0](https://github.com/KayKit-Game-Assets/KayKit-Furniture-Bits-1.0/tree/96d5930a8dbdb363409bbc2d3341718b00e17c9c) | 在固定 commit 核對 CC0 1.0 及 53 個 glTF 模型，有書架、枱、燈、地氈、相框等；共用一張色彩 atlas | 室內首選。揀木枱、書架、燈同地氈，統一材質色系；章簿、領巾牆、巾圈盒仍由 BadgeHouse 設計及控制互動。 |
| [Quaternius Ultimate House Interior Pack](https://quaternius.com/packs/ultimatehomeinterior.html) | 作者頁標示 123 件、CC0；來源 FBX／OBJ／Blend | 補門、窗及 KayKit 欠缺嘅配件；若使用先轉 GLB，檢查材質、實際大小及軸向，唔搬整套。 |

**建議首個試場**：先做加拿大一條步行街同一間木屋完整路線，對照原版。留住球面行走、選門、室內先揀展示及 2D 操作，唔更改地區或屋數。以一套木色、暖燈、可辨認嘅門口，取代累加裝飾。香港保留海旁特色再配專門素材，唔直接套用美式郊區；地方風格參考同精準實景重建係兩回事。

**入庫條件**：逐件保留作者、原包版本、授權與原檔對照；只揀所需模型，本機 GLB／同源供應，街坊及屋內分開按需載入。門口 anchor、碰撞／遮擋、鏡頭及顏色自訂與外觀模型分開。試場需實測手機載入、幀率、鍵盤與無 WebGL 後備；今次只研究素材，未量度下載體積或實際效能。
