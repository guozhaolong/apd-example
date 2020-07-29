import React, { useEffect, useMemo, useState } from 'react';
import AppDesigner from 'apd';
import { App,AppBean } from 'apd-renderer/dist'
import { Tabs } from 'antd';
import 'antd/lib/tabs/style';
import styles from './index.less';
import demoData from './demoWO';
import library from './LIBRARY';
import lookups from './LOOKUPS';
import menus from './MENUS';
import query from '../utils/simulator'
const { TabPane } = Tabs;

const plugins = {
  "appQuery": React.lazy(() => import('./custom/AppQuery') ),
  "wfMap": React.lazy(() => import('./custom/WFMap') ),
  "tableUploadBtn": React.lazy(() => import('./custom/TableUploadButton') )
};

const customEvents = (appBean)=>{
  return {
    test: () => {
      console.log(appBean);
    }
  }
};

const AppDemo = () => {
  const model = new AppBean({
    events: customEvents,
    appId: 'workorder',
    appName: '工单管理',
    query,
  });
  model.initLIBRARY(library);
  model.initLOOKUPS(lookups);
  model.initMENUS(menus);
  useEffect(()=>{
    model.init(demoData);
  },[]);
  return (
    <div className={styles.root}>
      <Tabs type="card">
        <TabPane tab="设计器" key="1" style={{padding:16}}>
          <AppDesigner data={demoData.app} onChange={(data) => model.init({app:data})}/>
        </TabPane>
        <TabPane tab="预览" key="2">
          <div style={{padding: 16,minHeight: 800}}>
            <App model={model} plugins={plugins}/>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AppDemo;
