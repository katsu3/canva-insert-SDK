# Canva Apps ローカル開発環境デバッグ依頼

## ⭐ 現在の問題
Canvaでアプリをプレビューすると、以下のエラーが表示されます:

**"An error occurred and we couldn't load the app's JavaScript bundle from http://localhost:8080"**

## ⭐ ローカル開発情報
- **Development URL**: `http://localhost:8080`
- **エントリーポイント**: `index.html`（manifest.jsonで指定）
- **サーバー**: Python 3 HTTPServer（CORS対応済）
- **CORS 設定**:
  ```
  Access-Control-Allow-Origin: https://www.canva.com
  Access-Control-Allow-Credentials: true
  ```

## ⭐ ファイル構成
```
プロジェクトルート/
├── index.html
├── app.js
├── drive.js
├── version.json  # version="5"
├── manifest.json
└── server.py
```

## ⭐ スクリプトロード方法（重要）
`index.html` で `version.json` をロードし、以下の URL を動的に読み込み:
- `http://localhost:8080/app.js?v=5`
- `http://localhost:8080/drive.js?v=5`

`version.json` 取得失敗時は `Date.now()` をフォールバックとして使用。

**実装コード**:
```javascript
const SERVER_URL = 'http://localhost:8080';

fetch(`${SERVER_URL}/version.json`)
  .then(r => r.json())
  .then(data => loadScripts(data.version))
  .catch(err => loadScripts(Date.now()));

function loadScripts(version) {
  const scripts = [
    `${SERVER_URL}/app.js?v=${version}`,
    `${SERVER_URL}/drive.js?v=${version}`
  ];
  scripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = () => console.log('[Canva App] ✅ Loaded:', src);
    script.onerror = (e) => console.error('[Canva App] ❌ Failed to load:', src, e);
    document.head.appendChild(script);
  });
}
```

## ⭐ 期待されるデバッグログ
```
[Canva App] Starting to load scripts from: http://localhost:8080
[Canva App] version.json response: 200 OK
[Canva App] version.json data: {version: "5"}
[Canva App] Loading scripts: [...]
[Canva App] ✅ Loaded: http://localhost:8080/app.js?v=5
[Canva App] ✅ Loaded: http://localhost:8080/drive.js?v=5
```

## ⭐ 確認済み事項
✅ ローカルサーバーは稼働中（`http://localhost:8080`）  
✅ `app.js`, `drive.js` はプロジェクトルートに存在  
✅ CORS ヘッダ設定済み  
✅ `version.json` は配信されている（サーバーログで200確認）  
✅ 絶対URLでスクリプト読み込み  
✅ 詳細デバッグログ実装済み  

## ⭐ 依頼内容

以下の点から、**原因の可能性を絞り込んでください**:

### 1. Canva iframe 環境での制約
- Canva iframe 内で `script` タグによる絶対 URL ロードが失敗する要因は？
- `localhost` からのスクリプト読み込みに特別な制限があるか？

### 2. CORS 関連
- CORS 設定が正しくてもロード失敗するケースは？
- プリフライトリクエスト（OPTIONS）の必要性は？

### 3. Canva Apps の仕組み
- Canva Apps の "JavaScript bundle" 判定の仕組みは？
- 動的なスクリプトロードではなく、静的な `<script>` タグが必須か？

### 4. クエリパラメータ付きロード
- ローカルでの `?v=5` クエリ付き js ファイルが読まれない典型原因は？
- `SimpleHTTPRequestHandler` はクエリパラメータを正しく処理するか？

### 5. その他の可能性
- 他に考えられる不具合要因は？
- 検証すべき手順は？

## ⭐ 次に必要な情報

以下をCanva側で確認して共有してください:

### ブラウザ DevTools Console
- `[Canva App]` で始まる全てのログ
- エラーメッセージ全文
- CORS 関連のエラー

### ブラウザ DevTools Network タブ
以下のリクエストの詳細:
- `http://localhost:8080/index.html`
- `http://localhost:8080/version.json`
- `http://localhost:8080/app.js?v=5`
- `http://localhost:8080/drive.js?v=5`

各リクエストについて:
- **Status Code**
- **Response Headers**（特に CORS 関連）
- **Response Body**（エラーの場合）

---

**最終更新**: 2025年11月25日  
**バージョン**: `version.json` = "5"  
**サーバー**: Python 3 HTTPServer (port 8080, CORS enabled)
