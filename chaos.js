document.getElementById("chaos-btn").addEventListener("click", async () => {
  function test() {
    function walkDOMTree(
      root,
      whatToShow = NodeFilter.SHOW_ALL,
      { inspect, collect, callback } = {}
    ) {
      const walker = document.createTreeWalker(root, whatToShow, {
        acceptNode(node) {
          if (inspect && !inspect(node)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (collect && !collect(node)) {
            return NodeFilter.FILTER_SKIP;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      const nodes = [];
      let n;
      while ((n = walker.nextNode())) {
        callback?.(n);
        nodes.push(n);
      }

      return nodes;
    }

    const PARENT_TAGS_TO_EXCLUDE = ["STYLE", "SCRIPT", "TITLE"];

    function getAllTextNodes(el) {
      return walkDOMTree(el, NodeFilter.SHOW_TEXT, {
        inspect: (textNode) =>
          !PARENT_TAGS_TO_EXCLUDE.includes(textNode.parentElement?.nodeName),
      });
    }

    function generateRandomString(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
    const textNodes = getAllTextNodes(document.body);
    for (const node of textNodes) {
      node.textContent = generateRandomString(node.textContent.length);
    }
  }

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      func: test,
    })
    .then(() => console.log("injected a function"));
});
