
const dumpTreeNodes = (bookmarkNodes, deep) => {
  let list = '';
  deep = deep || 0;
  for (let i = 0; i < bookmarkNodes.length; i++) {
    list += dumpNode(bookmarkNodes[i], deep);
  }
  document.getElementById("stFolderList").innerHTML = list;
  return list;
};

const dumpNode = (bookmarkNode, deep) => {
  if (bookmarkNode.children) { // bookmarkNode.children.length > 0 can I get empty folder?

    let option = '';
    console.log(bookmarkNode.children);
    if (bookmarkNode.title) {
      option = '<option value="' + bookmarkNode.id + '"' + '>' + buildDeepStyle(deep) + bookmarkNode.title + '</option>';
    }
    option += dumpTreeNodes(bookmarkNode.children, deep + 1);
    return option;
  }
  return '';
};

const buildDeepStyle = (deep) => {
  let str = '\xa0', result = '';
  deep = Math.max(deep - 1, 0) * 4;
  while (deep--) result += str;
  return result;
};

const saveTabs = async (folder) => {
  await openTabs.forEach((tab) =>
    chrome.bookmarks.create({
      parentId: folder.id,
      title: tab.title,
      url: tab.url,
    })
  );
}
const saveOpenTabs = async () => {
  let e = document.getElementById("stFolderList");
  let selectedId = e.value;
  let selectedText = e.options[e.selectedIndex].text;

  const d = new Date();
  let text = d.toLocaleString();
  console.log('text: ' + selectedText);
  console.log('id: ' + selectedId);
  if (selectedId == 1) { //bookmarks bar
    await chrome.bookmarks.create(
      {
        parentId: "1",
        title: "SaveYourTabs-" + text,
      },
      saveTabs
    );
  }
  else if (selectedId == 2) { // other bookmarks
    await chrome.bookmarks.create(
      {
        parentId: "2",
        title: "SaveYourTabs-" + text,
      },
      saveTabs
    );
  }
  else { // another folder selected by the user
    let folder = {
      id: selectedId
    };
    await saveTabs(folder);
  }
  window.close();
}
var openTabs;

chrome.bookmarks.getTree(dumpTreeNodes);
await chrome.tabs.query({
  currentWindow: true,
  pinned: false
}, function (tabs) {

  openTabs = tabs.filter(function (tab) {
    return tab.url.indexOf('chrome://') === -1;
  });
  openTabs.forEach((element) => console.log(element.url));

});


document.getElementById("btnSaveTabs").addEventListener("click", saveOpenTabs);