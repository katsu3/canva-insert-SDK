const fileList = document.getElementById("fileList");

document.getElementById("load").onclick = async () => {
  const folderId = document.getElementById("folderId").value;
  if (!folderId) return alert("フォルダIDを入力");

  const files = await listDriveFiles(folderId);
  window.driveFiles = files;

  fileList.innerHTML = files
    .map(f => `<div>${f.name}</div>`)
    .join("");
};

document.getElementById("insertAll").onclick = async () => {
  if (!window.driveFiles) return alert("画像を読み込んでください");

  for (const f of window.driveFiles) {
    // Canvaへの画像挿入
    const image = await Canva.createImage({
      url: f.webContentLink
    });

    await Canva.addElements([
      {
        type: "image",
        ref: image,
        pageIndex: 0,      // とりあえず1ページ目に全部追加
        x: 0,
        y: 0
      }
    ]);
  }
  alert("画像の一括配置が完了！");
};
