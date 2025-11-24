# canva-insert-SDK

## セットアップ

### 1. Google Drive API キーの取得

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. 「APIとサービス」→「ライブラリ」で「Google Drive API」を有効化
4. 「APIとサービス」→「認証情報」→「認証情報を作成」→「APIキー」
5. 作成されたAPIキーをコピー

### 2. 環境変数の設定

1. `configs/.env.example` をコピーして `configs/.env` ファイルを作成
   ```bash
   cp configs/.env.example configs/.env
   ```
2. `configs/.env` ファイルを開き、取得したAPIキーを設定
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

### 3. ローカルサーバーの起動

```bash
python3 server.py
```

サーバーが起動したら `http://localhost:8080` で稼働します。

## 使い方

### Google DriveのフォルダIDの取得方法

1. Google Driveでフォルダを開く
2. ブラウザのアドレスバーのURLを確認
3. URLの形式: `https://drive.google.com/drive/folders/【フォルダID】`
4. `folders/` の後ろの文字列がフォルダID

**例:**
```
URL: https://drive.google.com/drive/folders/1a2B3c4D5e6F7g8H9i0J
フォルダID: 1a2B3c4D5e6F7g8H9i0J
```

### アプリの使い方

1. ローカルサーバーを起動
2. Canvaでアプリをプレビュー
3. Google Driveでフォルダを**「リンクを知っている全員が閲覧可」に設定**
4. 上記の方法で取得したフォルダIDを入力
5. 「画像一覧を読み込む」をクリック
6. 「すべての画像を自動配置」でCanvaに画像を挿入

**重要:** 
- フォルダは必ず「リンクを知っている全員」に共有設定してください
- フォルダ内の画像ファイルも同様に共有されている必要があります

## キャッシュ問題の解決方法

Canvaのプレビューでコード変更が反映されない場合：

1. `version.json` のバージョン番号を変更
   ```json
   {
     "version": "1"
   }
   ```
   ↓
   ```json
   {
     "version": "2"
   }
   ```

2. Canvaプレビューをリロード

**理由:** Canvaのiframeが強くスクリプトをキャッシュするため、バージョン番号の変更で確実に最新版を読み込ませる必要があります。