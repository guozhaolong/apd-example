import AppBean from "./appbean";

export default class EQBean extends AppBean {
  public name = "装备";
  public buttons = [
    { type: 'appbutton', id: 'workorder_prevBtn', detail: { label: '上一条',event:'previous',icon:'left',visible:'insert' }},
    { type: 'appbutton', id: 'workorder_nextBtn', detail: { label: '下一条',event:'next',icon:'right',visible:'insert' }},
    { type: 'appbutton', id: 'workorder_saveBtn', detail: { label: '保存',event:'save',icon:'save',visible:'insert' }},
  ];
  public actions = [
    {type:'appaction', id: 'action1', detail: {event: 'action1', label: '操作一'}},
    {type:'appaction', id: 'action2', detail: {event: 'action2', label: '操作二'}},
    {type:'appaction', id: 'action3', detail: {event: 'action3', label: '操作三'}},
  ];

}
