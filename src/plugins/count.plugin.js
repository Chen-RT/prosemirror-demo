import { Plugin } from "prosemirror-state";

// 创建一个记录编辑次数的插件
export const countEditsPlugin = new Plugin({
  // 定义初始状态
  state: {
    init(_, { doc }) {
      // 决定了 state 的数据结构为 { count: number }
      return { count: 0 };
    },
    // 在每次事务（transaction）被应用时调用。用于根据事务更新插件的状态。
    apply(tr, value) {
      if (tr.docChanged) {
        return { count: value.count + 1 };
      }
      return value;
    },
  },

  // 添加一个视图更新函数，展示编辑次数
  // view(editorView)在编辑器创建视图时调用
  view(editorView) {
    const countDisplay = document.createElement("div");
    editorView.dom.parentNode.appendChild(countDisplay);

    return {
      // update(view, prevState)在编辑器状态发生变化时调用
      update(view, prevState) {
        const { count } = countEditsPlugin.getState(view.state);
        countDisplay.textContent = `Edits: ${count}`;
      },

      // destroy()在编辑器销毁时调用
      destroy() {
        countDisplay.remove();
      },
    };
  },
});
