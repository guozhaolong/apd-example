export default [
  { type: 'table', id: 'selectEQ1', detail: { pageSize:5,inputMode: 'readonly',width:700}},
  { type: 'tablecol', parentId: 'selectEQ1', id: 'selectEQ1_col1', detail: { label: '装备编号',dataAttribute:'eqNum',event:'toggleLOOKUPS'}},
  { type: 'tablecol', parentId: 'selectEQ1', id: 'selectEQ1_col2', detail: { label: '装备描述',dataAttribute:'desc'}},

  { type: 'table', id: 'selectEQ2', detail: { pageSize:5,inputMode: 'readonly',width:700}},
  { type: 'tablecol', parentId: 'selectEQ2', id: 'selectEQ2_col1', detail: { label: '装备编号',dataAttribute:'eqNum',event:'toggleLOOKUPS'}},
  { type: 'tablecol', parentId: 'selectEQ2', id: 'selectEQ2_col2', detail: { label: '装备描述',dataAttribute:'desc'}},
  { type: 'tablecol', parentId: 'selectEQ2', id: 'selectEQ2_col3', detail: { label: '状态',dataAttribute:'status'}},

  { type: 'table', id: 'selectWO', detail: { pageSize:5,inputMode: 'readonly',width: 800}},
  { type: 'tablecol', parentId: 'selectWO', id: 'selectWO_col1', detail: { label: '工单编号',dataAttribute:'woNum',event:'toggleLOOKUPS'}},
  { type: 'tablecol', parentId: 'selectWO', id: 'selectWO_col2', detail: { label: '工单描述',dataAttribute:'desc'}},
  { type: 'tablecol', parentId: 'selectWO', id: 'selectWO_col3', detail: { label: '状态',dataAttribute:'status'}},
  { type: 'tablecol', parentId: 'selectWO', id: 'selectWO_col4', detail: { label: '创建时间',dataAttribute:'created_time'}},

  { type: 'table', id: 'selectItem', detail: { pageSize:5,inputMode: 'readonly',width: 800}},
  { type: 'tablecol', parentId: 'selectItem', id: 'selectItem_col1', detail: { label: '物料编号',dataAttribute:'woNum',event:'toggleLOOKUPS'}},
  { type: 'tablecol', parentId: 'selectItem', id: 'selectItem_col2', detail: { label: '物料描述',dataAttribute:'desc'}},
  { type: 'tablecol', parentId: 'selectItem', id: 'selectItem_col3', detail: { label: '单价',dataAttribute:'cost'}},
  { type: 'tablecol', parentId: 'selectItem', id: 'selectItem_col4', detail: { label: '数量',dataAttribute:'amount'}},
];
