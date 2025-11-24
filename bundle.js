console.log('[Bundle] Loading Canva App bundle.js');

// Google Drive API
async function listDriveFiles(folderId) {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name,webContentLink,thumbnailLink,webViewLink)`;
  const res = await fetch(url);
  const json = await res.json();
  return json.files || [];
}

// アプリのメインロジック
async function initApp() {
  console.log('[Bundle] Initializing app');
  
  // UIを動的に作成
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>Google Drive → Canva 自動画像配置</h2>
    <div>
      <input id="folderId" placeholder="Google Drive Folder ID" style="width: 100%" />
      <button id="load">画像一覧を読み込む</button>
    </div>
    <div id="fileList"></div>
    <button id="insertAll">すべての画像を自動配置</button>
  `;
  document.body.appendChild(container);
  
  console.log('[Bundle] UI created');
  
  const fileList = document.getElementById("fileList");
  const loadBtn = document.getElementById("load");
  const insertBtn = document.getElementById("insertAll");

  loadBtn.onclick = async () => {
    const folderId = document.getElementById("folderId").value;
    if (!folderId) return alert("フォルダIDを入力");

    try {
      const files = await listDriveFiles(folderId);
      window.driveFiles = files;

      fileList.innerHTML = files
        .map(f => `<div>${f.name}</div>`)
        .join("");
      
      console.log('[Bundle] Loaded', files.length, 'files');
    } catch (err) {
      console.error('[Bundle] Error loading files:', err);
      alert('ファイルの読み込みに失敗しました: ' + err.message);
    }
  };

  insertBtn.onclick = async () => {
    if (!window.driveFiles) return alert("画像を読み込んでください");

    try {
      for (const f of window.driveFiles) {
        const image = await Canva.createImage({
          url: f.webContentLink
        });

        await Canva.addElements([
          {
            type: "image",
            ref: image,
            pageIndex: 0,
            x: 0,
            y: 0
          }
        ]);
      }
      alert("画像の一括配置が完了！");
      console.log('[Bundle] All images inserted');
    } catch (err) {
      console.error('[Bundle] Error inserting images:', err);
      alert('画像の配置に失敗しました: ' + err.message);
    }
  };
  
  console.log('[Bundle] App initialized successfully');
}

// 初期化実行
initApp().catch(err => console.error('[Bundle] Initialization error:', err));

