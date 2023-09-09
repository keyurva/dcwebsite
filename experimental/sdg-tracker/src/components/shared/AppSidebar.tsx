/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Layout, Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { MenuItemType, useStoreState, useStoreActions } from "../../state";

const { Sider } = Layout;

const MenuTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
`;

const StyledMenu = styled(Menu)`
  .ant-menu-submenu-title {
  }
  .-title-content {
    overflow: hidden;
    text-overflow: ellipsis;
    flex: auto !important;
  }
`;

const AppSidebar: React.FC<{
  placeDcid: string;
  variableDcid: string;
  setVariableDcid: (variableDcid: string) => void;
}> = ({ placeDcid, variableDcid, setVariableDcid }) => {
  const sidebarMenuHierarchy = useStoreState((s) => s.sidebarMenuHierarchy);
  const [siderHidden, setSiderHidden] = useState<boolean>(false);
  const topicDcids = useStoreState((s) => s.topicDcids);
  const existencesByPlaceDcid = useStoreState((s) => s.existingTopicDcids.byPlaceDcid);
  const fetchExistence = useStoreActions((a) => a.fetchExistence);
  const [isExistenceFetched, setIsExistenceFetched] = useState(false);
  const [existingTopicDcids, setExistingTopicDcids] =
    useState<Set<string>>();

  const menuItemTypeFilter = (item: MenuItemType) =>
    !existingTopicDcids ||
    existingTopicDcids?.has(item.key) ||
    existingTopicDcids?.has(`summary-${item.key}`);

  const anyMenuItemFilter = (items: MenuItemType[]) => {
    if (!items || items.length === 0) {
      return false;
    }
    return items.some(menuItemTypeFilter);
  }

  const getMenuItem = (item: MenuItemType) => {
    if (anyMenuItemFilter(item.children || [])) {
      return (
        <SubMenu
          className={`-dc-sidebar-submenu -dc-sidebar-submenu-${item.key}`}
          key={item.key}
          title={item.label}
          icon={item.icon}
        >
          {item.children?.filter(menuItemTypeFilter).map((subItem) => getMenuItem(subItem))}
        </SubMenu>
      );
    }
    return (
      <Menu.Item
        className={`-dc-sidebar-menu-item -dc-sidebar-menu-item-${item.key}`}
        key={item.key}
        icon={item.icon}
      >
        {item.label}
      </Menu.Item>
    );
  };

  /**
   * Fetch existences
   */
  useEffect(() => {
    let isFetching = true;
    if (!placeDcid || !topicDcids || topicDcids.length === 0) {
      return;
    }

    (async () => {
      const existingTopicDcids = await fetchExistence({
        placeDcid,
        topicDcids,
        existencesByPlaceDcid,
      });

      if (isFetching) {
        setIsExistenceFetched(true);
        setSiderHidden(false);
        setExistingTopicDcids(existingTopicDcids);
      }
    })();

    return () => {
      isFetching = false;
    }
  }, [placeDcid, topicDcids]);

  return (
    <Sider
      key={placeDcid || "Earth"}
      breakpoint="lg"
      collapsedWidth="0"
      width={320}
      onBreakpoint={(broken) => {
        setSiderHidden(broken);
      }}
      style={{
        background: "white",
        overflow: !siderHidden ? "auto" : undefined,
      }}
    >
      <MenuTitle>Goals</MenuTitle>
      <StyledMenu
        defaultSelectedKeys={[variableDcid]}
        mode="inline"
        defaultOpenKeys={["1"]}
        style={{ borderRight: 0 }}
        onClick={(item) => {
          setVariableDcid(item.key.replace("summary-", ""));
        }}
      >
        {sidebarMenuHierarchy.filter(menuItemTypeFilter).map((vg) => getMenuItem(vg))}
      </StyledMenu>
    </Sider>
  );
};

export default AppSidebar;
