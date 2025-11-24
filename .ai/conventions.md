# コーディング規約

## JavaScript

### スタイル
- セミコロンあり
- インデント: 2スペース
- 関数: async/await 優先（Promise.then は避ける）

### 命名規則
- 変数/関数: camelCase
- 定数: UPPER_SNAKE_CASE（必要に応じて）
- グローバル変数: `window.` プレフィックスで明示

### 例
```javascript
// ✅ Good
const folderId = document.getElementById("folderId").value;
const files = await listDriveFiles(folderId);
window.driveFiles = files;

// ❌ Bad
const folder_id = document.getElementById("folderId").value;
listDriveFiles(folder_id).then(files => {
  driveFiles = files; // グローバル汚染
});
```

## Python

### スタイル
- PEP 8 準拠
- インデント: 4スペース
- 型ヒント不要（シンプル優先）

### server.py の変更ルール
- CORS ヘッダは必ず維持
- ポート変更時は README.md も更新

## HTML

### スタイル
- インデント: 2スペース
- 属性: ダブルクォート

### script タグのルール
- **必ず絶対URL**
- **必ずクエリパラメータ `?v=N` 付与**
- defer 属性使用

## コミットメッセージ
- 日本語OK
- プレフィックス不要（小規模プロジェクトのため）
- 例: `画像配置ロジックを修正`, `CORSヘッダを追加`
