<template>
  <div class="tdesign-demo-item--layout">
    <t-layout>
      <t-header>
        <t-head-menu theme="light" value="item1" height="120px">
          <h1 class="logo" style="color: #40a9ff">图书管理系统</h1>

          <template #operations>
            <t-dropdown
              :options="options"
              @click="clickHandler"
              :minColumnWidth="120"
            >
              <a href="javascript:;" style="margin-right: 50px"
                ><icon class="t-menu__operations-icon" name="user"
              /></a>
            </t-dropdown>
          </template>
        </t-head-menu>
      </t-header>
      <br /><br /><br />
      <t-content>
        <t-row justify="center" :gutter="[0, 20]">
          <t-col :span="6">
            <div>
              <t-button theme="success">查新所有书籍</t-button>
            </div>
          </t-col>
          <t-col :span="1" :offset="2">
            <div class="tdesign-demo-block-column" style="max-width: 200px">
              <t-input v-model="value" placeholder="输入关键词" />
            </div>
          </t-col>
          <t-col :span="1">
            <t-button variant="outline" :icon="renderIcon"> 搜索 </t-button>
          </t-col>
          <t-col :span="10">
            <div>
              <t-table
                :data="data"
                :align="center"
                :columns="columns"
                :rowKey="index"
                :height="500"
                :pagination="pagination"
              ></t-table>
              <br /><br />
            </div>
          </t-col>
        </t-row>
      </t-content>
      <t-footer>
        Copyright @ 2019-{{ new Date().getFullYear() }} Tencent. All Rights
        Reserved
      </t-footer>
    </t-layout>
  </div>
</template>

<script>
import { Icon } from "tdesign-icons-vue";

const data = [];
for (let i = 0; i < 20; i++) {
  data.push({
    index: i,
    platform: i % 2 === 0 ? "共有" : "私有",
    type: ["String", "Number", "Array", "Object"][i % 4],
    default: ["-", "0", "[]", "{}"][i % 4],
    detail: {
      postion: `读取 ${i} 个数据的嵌套信息值`,
    },
    needed: i % 4 === 0 ? "是" : "否",
    description: "数据源",
  });
}

export default {
  components: {
    Icon,
  },
  data() {
    return {
      value: "",
      pagination: {
        current: 1,
        pageSize: 10,
      },
      data,
      columns: [
        {
          colKey: "id",
          title: "序号",
        },
        {
          colKey: "name",
          title: "书名",
        },
        {
          colKey: "property",
          title: "作者",
        },
        {
          colKey: "default",
          title: "出版社",
        },
        {
          colKey: "needed",
          title: "库存",
        },
        {
          colKey: "description",
          title: "操作",
        },
      ],
      options: [
        {
          content: "我的信息",
          value: 1,
        },
        {
          content: "借书记录",
          value: 2,
        },
      ],
    };
  },
  methods: {
    clickHandler(data) {
      this.$message.success(`选中【${data.content}】`);
    },
  },
};
</script>
