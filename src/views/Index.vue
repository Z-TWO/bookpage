<template>
  <div class="tdesign-demo-item--layout">
    <t-layout>
      <t-header>
        <t-head-menu theme="light" value="item1" height="120px">
          <h1 class="logo" style="color: #40a9ff">图书管理系统</h1>
          <template #operations>
            <template v-if="token === null">
              <a href="javascript:;" @click="toLoginPage">
                <icon class="t-menu__operations-icon" name="login" />
              </a>
              <a href="javascript:;" @click="toRegisterPage">
                <icon class="t-menu__operations-icon" name="user-add" /></a>
            </template>
            <template v-else>
              <t-dropdown :options="options" @click="clickHandler" :minColumnWidth="120">
                <a href="javascript:;" style="margin-right: 50px">
                  <icon class="t-menu__operations-icon" name="user" /></a>
              </t-dropdown>
            </template>
          </template>
        </t-head-menu>
      </t-header>
      <br /><br /><br />

      <t-content>
        <t-row justify="center" :gutter="[0, 20]">
          <t-col :span="6">
            <div>
              <t-button theme="success" @click="getBookData()">查看所有书籍</t-button>
            </div>
          </t-col>
          <t-col :span="1" :offset="2">
            <div class="tdesign-demo-block-column" style="max-width: 200px">
              <t-input v-model="value" placeholder="输入关键词" />
            </div>
          </t-col>
          <t-col :span="1">
            <t-button variant="outline" @click="searchBook()"> 搜索 </t-button>
          </t-col>
          <t-col :span="10">
            <div>
              <t-table :data="data" :columns="columns" :rowKey="index" :height="500" :pagination="pagination"
                @page-change="onPageChange">
                <template #info="{ row }">
                  <p v-if="row.info === null">无</p>
                  <p v-else>{{ row.info }}</p>
                </template>
                <template #op-column>
                  <p>操作</p>
                </template>
                <template #option="{ row }">
                  <t-button @click="borrow(row)" theme="warning" :disabled="row.currentNum <= 0">借书</t-button>
                </template>
              </t-table>
              <br /><br />
            </div>
          </t-col>
        </t-row>
      </t-content>

      <t-footer>
        Copyright @ 2021-{{ new Date().getFullYear() }} ZTwo. All Rights
        Reserved
      </t-footer>
    </t-layout>
  </div>
</template>

<script>
  import {
    Icon
  } from "tdesign-icons-vue";
  import {
    getRequest,
    postRequest
  } from '../util/httputil.js'

  export default {
    components: {
      Icon,
    },
    data() {
      return {
        value: "",
        index: "",
        token: null,
        data: [],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
          onChange: (pageInfo) => {
            this.pagination.current = pageInfo.current;
            this.pagination.pageSize = pageInfo.pageSize;
            if (this.pagination.total <= this.pagination.pageSize)
              this.pagination.curr = 1;
          },
        },
        columns: [{
            align: "center",
            colKey: "id",
            title: "书籍ID",
            disabled: ({
              rowIndex
            }) => rowIndex === 1 || rowIndex === 3,
          },
          {
            align: "center",
            colKey: "name",
            title: "书名",
          },
          {
            align: "center",
            colKey: "author",
            title: "作者",
          },
          {
            align: "center",
            colKey: "pressName",
            title: "出版社",
          },
          {
            align: "center",
            colKey: "pressDate",
            title: "发行日期",
          },
          {
            align: "center",
            colKey: "info",
            title: "描述",
          },
          {
            align: "center",
            colKey: "currentNum",
            title: "库存",
          },
          {
            align: "center",
            colKey: "option",
            title: "操作",
          },
        ],
        options: [{
            content: "我的信息",
            value: 1,
          },
          {
            content: "借书记录",
            value: 2,
          },
          {
            content: "退出登陆",
            value: 3,
            onClick: () => {
              //删除tonken
              localStorage.removeItem("token");
              //刷新页面
              location.reload();
            },
          },
        ],
      };
    },
    methods: {
      clickHandler(data) {
        this.$message.success(`选中【${data.content}】`);
      },
      borrow({
        id
      }) {
        console.log(id)
      },
      getBookData: function () {
        let params = {
          curr: this.pagination.current,
          size: this.pagination.pageSize,
        }
        getRequest('/book/', params)
          .then((res) => {
            if (res.data.code == 200) {
              let datas = res.data.data;
              this.data = datas.list;
              this.pagination.total = datas.total;
            }
          })
      },
      searchBook: function () {
        let params = {
          keyWorld: this.value,
          curr: this.pagination.curr,
          size: this.pagination.size,
        }
        postRequest('/book/search', params)
          .then((res) => {
            if (res.data.code === 200) {
              let datas = res.data.data;
              console.log(this.value);
              this.data = datas.list;
              this.pagination.total = datas.total;
            }
          })
      },
      onPageChange: function (pageInfo) {
        console.log("page-change:", pageInfo);
      },
      toLoginPage: function () {
        this.$router.push("/login");
      },
      toRegisterPage: function () {
        this.$router.push("/register");
      },
    },
    created() {
      this.getBookData();
      this.token = localStorage.getItem("token");
    },
  };
</script>