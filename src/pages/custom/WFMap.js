import React, {useEffect, useState,} from 'react';
import WFD from 'wfd2';
import {Form,Input} from 'antd';

const height = 600;

const WFMap = ({model,widget,form}) => {
  const [wfName,setWFName] = useState();
  const [data,setData] = useState(undefined);
  useEffect(()=>{
    const Find_GQL = `
        query Find($app:String!, $pagination:Pagination, $where:String, $sorter: [SortItem!]){
          workflowProcessFind (app: $app,pagination:$pagination, where: $where,sorter:$sorter){
            list{
              id
              name
              appName
              json
            }
          }
        }
      `;
    model.query(Find_GQL, {
      app: 'workflowProcess',
      where: `this.appName = '${model.getAppId()}'`,
      pagination:{currentPage:1,pageSize:5}
    }).then(response => {
      if(response && !response.errors){
        const {appName,json} = _.get(response.data,'workflowProcessFind.list[0]');
        setWFName(appName);
        let wfJson = JSON.parse(json);
        const Find_TaskLink_GQL = `
          query Find($app:String!, $pagination:Pagination, $where:String, $sorter: [SortItem!],$id:ID!){
            ${model.getModelName()}Find (app: $app,pagination:$pagination, where: $where,sorter:$sorter){
              one(id: $id){
                linkTaskList{
                  head{
                    taskDefinitionKey
                  }
                }
              }
            }
          }
        `;
        model.query(Find_TaskLink_GQL, {
          app: model.getModelName(),
          id: model.getCurrentId()
        }).then(r => {
          if(r && !r.errors){
            const { taskDefinitionKey } = _.get(r.data,`${model.getModelName()}Find.one.linkTaskList`);
            if(wfJson.nodes){
              wfJson = {
                ...wfJson,
                nodes: wfJson.nodes.map(n => {
                  if(n.id === taskDefinitionKey){
                    return {
                      ...n,
                      active: true,
                    }
                  }
                  return n;
                })
              }
            }
            setData(wfJson);
          }
        });
      }
    });
  },[]);
  return (
    <div>
      <Form.Item label={"流程名称"}><Input disabled value={wfName} /></Form.Item>
      <WFD data={data} height={height-40} isView mode={"view"}/>
    </div>
  );
};

export default WFMap;
