import React, { useMemo, useState } from 'react';
import AppDesigner from 'apd';
import AppRenderer from 'apd-renderer'
import { Tabs } from 'antd';
import 'antd/lib/tabs/style';
import styles from './index.less';
import WOBean from '../utils/wobean';
import demoData from './demoWO';
import library from './LIBRARY';
import lookups from './LOOKUPS';
import menus from './MENUS';
const { TabPane } = Tabs;

const plugins = {
  "custom.js": React.lazy(() => import('./custom') )
};

const AppDemo = () => {
  const model = useMemo(()=> new WOBean(demoData),[]);
  model.initLIBRARY(library);
  model.initLOOKUPS(lookups);
  model.initMENUS(menus);
  return (
    <div className={styles.root}>
      <Tabs type="card">
        <TabPane tab="设计器" key="1" style={{padding:16}}>
          <AppDesigner data={demoData} onChange={(data) => model.updateWidgets(data,true)}/>
        </TabPane>
        <TabPane tab="预览" key="2">
          <div style={{padding: 16,minHeight: 800}}>
            <AppRenderer model={model} plugins={plugins}/>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AppDemo;
