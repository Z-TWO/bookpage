<template>
  <div class="tdesign-demo-item--layout">
    <t-layout>
      <t-header>
        <t-head-menu theme="light" value="item1" height="120px">
          <h1 class="logo" style="color: #40a9ff; cursor:pointer;" @click="toIndex">图书管理系统</h1>
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
        <router-view />
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
            content: "借书记录",
            value: 1,
            onClick: () => this.$router.push("/index/user/borrowinfo"),
          },
          {
            content: "退出登陆",
            value: 2,
            onClick: () => {
              //删除tonken
              localStorage.removeItem("bookToken");
              //刷新页面
              location.reload();
            },
          },
        ],
      };
    },
    methods: {
      //跳转到登录页面
      toLoginPage: function () {
        this.$router.push("/login");
      },
      //跳转到注册页面
      toRegisterPage: function () {
        this.$router.push("/register");
      },
      toIndex: function () {
        this.$router.push("/index/book");
      },
    },
    created() {
      this.token = localStorage.getItem("bookToken");
    },
  };
</script>