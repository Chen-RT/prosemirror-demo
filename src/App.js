import { EditorState, TextSelection, NodeSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import React from "react";
import { Fragment } from "prosemirror-model";
import { countEditsPlugin } from "./plugins/count.plugin";

class App extends React.Component {
  view = null;

  componentDidMount() {
    demo1.bind(this)();
    document.querySelector('#editor').addEventListener("click", demo3.bind(this));
  }

  render() {
    return (
      <div className="App">
        <button onClick={bold.bind(this)} >Bold</button>
        <div id="editor"></div>
        <button onClick={demo2.bind(this)}>Demo 2</button>
        <button onClick={demo4.bind(this)}>Demo 4</button>
        <button onClick={demo5.bind(this)}>Demo 5</button>
        <button onClick={demo6.bind(this)}>Demo 6</button>
      </div>
    );
  }
}

// 初识 ProseMirror
function demo1() {
  let state = EditorState.create({ schema, plugins: [countEditsPlugin] });
  this.view = new EditorView(document.querySelector("#editor"), { state });
  console.log(this.view);
}

// 主动修改文档内容
function demo2() {
  const { state } = this.view;
  const { tr, schema } = state;
  tr.replaceWith(0, tr.doc.content.size, schema.text("Hello ProseMirror!"));
  this.view.dispatch(tr);
}

// 打印光标
function demo3() {
  console.log(this.view.state.doc);
  console.log(this.view.state.selection);
}

// 设置光标位置
function demo4() {
  demo2.bind(this)();
  // 创建一个新的文本选择对象，光标在位置5
  const selection = TextSelection.create(this.view.state.doc, 5);

  // 应用事务
  this.view.dispatch(this.view.state.tr.setSelection(selection));
  this.view.focus();
}

// 设置光标选区
function demo5() {
  demo2.bind(this)();
  const doc = this.view.state.doc;
  // 创建一个新的文本选择对象，选区从位置3到文档末尾
  const selection = TextSelection.create(doc, 3, doc.content.size);

  // 应用事务
  this.view.dispatch(this.view.state.tr.setSelection(selection));
  this.view.focus();
}

// 设置节点选区
function demo6() {
  // 假设我们要选择文档中的一个特定节点，节点位置为3
  const { state } = this.view;
  const { tr, schema, doc } = state;
  const { code_block: code, paragraph } = schema.nodes;
  // 创建一个代码块，里面是内容为"Code Block"文字的 paragraph 节点
  const codeNode = code.create({}, Fragment.from(paragraph.create({}, schema.text("Code Block"))));
  tr.replaceRangeWith(0, doc.content.size, codeNode);
  this.view.dispatch(tr);

  // 0 代表节点的开始位置
  const selection = NodeSelection.create(this.view.state.doc, 0);
  this.view.dispatch(this.view.state.tr.setSelection(selection));
  this.view.focus();
}

function bold() {
  const { state } = this.view;
  const { tr, schema, selection } = state;
  const { strong } = schema.marks;
  const { from, to } = selection;
  tr.addMark(from, to, strong.create());
  this.view.dispatch(tr);
}

export default App;
