var tabs;
chrome.bookmarks.getTree((tree) => {
  getBookmarksFolders(tree[0].children);
});

// Recursively display the bookmarks
function getBookmarksFolders(nodes) {
  for (const node of nodes) {
    if (node.children) {
      console.log(node.title);

      const folderList = document.getElementById("stFolderList");
      const opt = document.createElement("option");
      opt.value = node.id;
      opt.text = node.title;
      folderList.add(opt, null);

      getBookmarksFolders(node.children);
    }
  }
}

async function newFolder(newFolder) {
  await tabs.forEach((tab) =>
    chrome.bookmarks.create({
      parentId: newFolder.id,
      title: tab.title,
      url: tab.url,
    })
  );
  window.close();
}

async function saveOpenTabs() {
  var e = document.getElementById("stFolderList");
  var selectedValue = e.value;
  var selectedText = e.options[e.selectedIndex].text;
  tabs = await getOpenTabs();
  const d = new Date();
  let text = d.toLocaleString();
  if (selectedText == "Bookmarks bar")
    await chrome.bookmarks.create(
      {
        parentId: "1",
        title: "SaveYourTabs-" + text,
      },
      newFolder
    );
  else if (selectedText == "Other bookmarks")
    await chrome.bookmarks.create(
      {
        parentId: "2",
        title: "SaveYourTabs-" + text,
      },
      newFolder
    );
  else {
    await tabs.forEach((tab) =>
      chrome.bookmarks.create({
        parentId: selectedValue,
        title: tab.title,
        url: tab.url,
      })
    );
  }
  window.close();
}

async function getOpenTabs() {
  const tabs = await chrome.tabs.query({});
  tabs.forEach((element) => console.log(element.url));
  return tabs;
}

document.getElementById("btnSaveTabs").addEventListener("click", saveOpenTabs);
//document.getElementById("btnCreateFolder").addEventListener("click", "");
